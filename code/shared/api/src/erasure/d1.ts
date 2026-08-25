import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import type {
  ErasureAdapter,
  AdapterPreview,
  AdapterResult,
} from "@indiecrafts/packages-shared-compliance/shared";

// The D1 erasure adapters, split across the two EU D1s (spec §8.3):
//   CORE  — user_profiles → pseudonymise (scrub email/name, keep the fingerprint)
//           consent_events → pseudonymise (subject_id → fingerprint, subject_type → visitor)
//   AUDIT — session_events → delete (low-sensitivity sign-in activity; no severity)
//           security_events → pseudonymise high/critical (user_id → fingerprint); delete
//                              every other severity (the exact complement, so no severity
//                              value is silently kept)
//           admin_audit → retain (the accountability trail; no adapter statement)
// The audit adapter has no identity table of its own, so it resolves the subject by reading
// core.user_profiles (via resolveSubject) before touching its own tables.

// Resolve the Clerk user_id + fingerprint for an email from core.user_profiles.
// Falls back to a plaintext email match (a profile row can predate the fingerprint).
export async function resolveSubject(
  coreDb: D1Database,
  email: string,
  salt: string,
): Promise<{ userId: string | null; fp: string }> {
  const fp = await fingerprintEmail(email, salt);
  const row = await coreDb
    .prepare(
      "SELECT user_id FROM user_profiles WHERE email_fingerprint = ? OR LOWER(email) = ?",
    )
    .bind(fp, email.toLowerCase().trim())
    .first<{ user_id: string }>();
  return { userId: row?.user_id ?? null, fp };
}

// CORE adapter — identity + consent (pseudonymise).
export function createCoreErasureAdapter(
  coreDb: D1Database,
  salt: string,
): ErasureAdapter {
  const countFor = async (sql: string, ...b: unknown[]) =>
    (
      await coreDb
        .prepare(sql)
        .bind(...b)
        .first<{ c: number }>()
    )?.c ?? 0;
  return {
    name: "d1-core",
    async findByEmail(email) {
      const { fp } = await resolveSubject(coreDb, email, salt);
      const n = await countFor(
        "SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?",
        fp,
      );
      return { found: n > 0, detail: { user_profiles: n } };
    },
    async export(email) {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      const all = async (sql: string, ...b: unknown[]) =>
        (
          await coreDb
            .prepare(sql)
            .bind(...b)
            .all()
        ).results;
      return {
        user_profiles: await all(
          "SELECT * FROM user_profiles WHERE email_fingerprint = ?",
          fp,
        ),
        consent_events: await all(
          "SELECT * FROM consent_events WHERE subject_id = ? OR email_fingerprint = ?",
          userId ?? "",
          fp,
        ),
      };
    },
    async preview(email): Promise<AdapterPreview> {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      if (!userId)
        return { store: "d1-core", wouldAnonymize: {}, wouldDelete: {} };
      return {
        store: "d1-core",
        wouldAnonymize: {
          user_profiles: await countFor(
            "SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?",
            fp,
          ),
          consent_events: await countFor(
            "SELECT COUNT(*) c FROM consent_events WHERE subject_id = ?",
            userId,
          ),
        },
        wouldDelete: {},
      };
    },
    async anonymize(email): Promise<AdapterResult> {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-core", anonymized: {}, deleted: {} };
      const p = await coreDb
        .prepare(
          "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE user_id = ?",
        )
        .bind(
          `deleted_${userId}@anonymized.local`,
          "Deleted User",
          new Date().toISOString(),
          userId,
        )
        .run();
      const con = await coreDb
        .prepare(
          "UPDATE consent_events SET subject_id = ?, subject_type = 'visitor' WHERE subject_id = ?",
        )
        .bind(fp, userId)
        .run();
      return {
        store: "d1-core",
        anonymized: {
          user_profiles: p.meta?.changes ?? 0,
          consent_events: con.meta?.changes ?? 0,
        },
        deleted: {},
      };
    },
    async delete() {
      return { store: "d1-core", anonymized: {}, deleted: {} }; // core pseudonymises; nothing hard-deleted
    },
  };
}

// AUDIT adapter — session/security firehose. Reads core to resolve user_id, writes audit.
export function createAuditErasureAdapter(
  auditDb: D1Database,
  coreDb: D1Database,
  salt: string,
): ErasureAdapter {
  const countFor = async (sql: string, ...b: unknown[]) =>
    (
      await auditDb
        .prepare(sql)
        .bind(...b)
        .first<{ c: number }>()
    )?.c ?? 0;
  return {
    name: "d1-audit",
    async findByEmail(email) {
      const { userId } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { found: false };
      const n = await countFor(
        "SELECT COUNT(*) c FROM session_events WHERE user_id = ?",
        userId,
      );
      return { found: n > 0, detail: { session_events: n } };
    },
    async export(email) {
      const { userId } = await resolveSubject(coreDb, email, salt);
      const all = async (sql: string, ...b: unknown[]) =>
        (
          await auditDb
            .prepare(sql)
            .bind(...b)
            .all()
        ).results;
      return {
        session_events: userId
          ? await all("SELECT * FROM session_events WHERE user_id = ?", userId)
          : [],
        security_events: userId
          ? await all(
              "SELECT * FROM security_events WHERE user_id = ?",
              userId,
            )
          : [],
      };
    },
    async preview(email): Promise<AdapterPreview> {
      const { userId } = await resolveSubject(coreDb, email, salt);
      if (!userId)
        return { store: "d1-audit", wouldAnonymize: {}, wouldDelete: {} };
      return {
        store: "d1-audit",
        wouldAnonymize: {
          security_events_high: await countFor(
            "SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity IN ('high','critical')",
            userId,
          ),
        },
        wouldDelete: {
          session_events: await countFor(
            "SELECT COUNT(*) c FROM session_events WHERE user_id = ?",
            userId,
          ),
          security_events_deleted: await countFor(
            "SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity NOT IN ('high','critical')",
            userId,
          ),
        },
      };
    },
    async anonymize(email): Promise<AdapterResult> {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-audit", anonymized: {}, deleted: {} };
      const sec = await auditDb
        .prepare(
          "UPDATE security_events SET user_id = ? WHERE user_id = ? AND severity IN ('high','critical')",
        )
        .bind(fp, userId)
        .run();
      return {
        store: "d1-audit",
        anonymized: { security_events: sec.meta?.changes ?? 0 },
        deleted: {},
      };
    },
    async delete(email): Promise<AdapterResult> {
      const { userId } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-audit", anonymized: {}, deleted: {} };
      const ses = await auditDb
        .prepare("DELETE FROM session_events WHERE user_id = ?")
        .bind(userId)
        .run();
      const sec = await auditDb
        .prepare(
          "DELETE FROM security_events WHERE user_id = ? AND severity NOT IN ('high','critical')",
        )
        .bind(userId)
        .run();
      return {
        store: "d1-audit",
        anonymized: {},
        deleted: {
          session_events: ses.meta?.changes ?? 0,
          security_events: sec.meta?.changes ?? 0,
        },
      };
    },
  };
}
