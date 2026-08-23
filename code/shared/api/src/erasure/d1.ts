import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import type {
  ErasureAdapter,
  AdapterPreview,
  AdapterResult,
} from "@indiecrafts/packages-shared-compliance/shared";

// The D1 erasure adapter for the EU audit/identity database. Policy (spec §8.3):
//   user_profiles  → pseudonymise (scrub email/name, keep the fingerprint)
//   session_events → delete (low-sensitivity sign-in activity; no severity)
//   security_events→ delete low/medium; pseudonymise high/critical (user_id → fingerprint)
//   consent_events → pseudonymise (subject_id → fingerprint, subject_type → visitor)
//   admin_audit    → retain (the accountability trail)
// The subject is resolved by email_fingerprint, so it works before AND after the
// profile's plaintext email has been scrubbed.
export function createD1ErasureAdapter(
  db: D1Database,
  salt: string,
): ErasureAdapter {
  // Resolve the Clerk user_id (if any) + the fingerprint for this email.
  async function resolve(
    email: string,
  ): Promise<{ userId: string | null; fp: string }> {
    const fp = await fingerprintEmail(email, salt);
    const row = await db
      .prepare("SELECT user_id FROM user_profiles WHERE email_fingerprint = ?")
      .bind(fp)
      .first<{ user_id: string }>();
    return { userId: row?.user_id ?? null, fp };
  }

  const countFor = async (
    sql: string,
    ...binds: unknown[]
  ): Promise<number> => {
    const r = await db
      .prepare(sql)
      .bind(...binds)
      .first<{ c: number }>();
    return r?.c ?? 0;
  };

  return {
    name: "d1",

    async findByEmail(email) {
      const { fp } = await resolve(email);
      const profiles = await countFor(
        "SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?",
        fp,
      );
      return { found: profiles > 0, detail: { user_profiles: profiles } };
    },

    async export(email) {
      const { userId, fp } = await resolve(email);
      const all = async (sql: string, ...b: unknown[]) =>
        (
          await db
            .prepare(sql)
            .bind(...b)
            .all()
        ).results;
      return {
        user_profiles: await all(
          "SELECT * FROM user_profiles WHERE email_fingerprint = ?",
          fp,
        ),
        session_events: userId
          ? await all("SELECT * FROM session_events WHERE user_id = ?", userId)
          : [],
        security_events: userId
          ? await all("SELECT * FROM security_events WHERE user_id = ?", userId)
          : [],
        consent_events: await all(
          "SELECT * FROM consent_events WHERE subject_id = ? OR email_fingerprint = ?",
          userId ?? "",
          fp,
        ),
      };
    },

    async preview(email): Promise<AdapterPreview> {
      const { userId, fp } = await resolve(email);
      // No matching profile → nothing keyed by user_id to erase. Short-circuit
      // rather than binding a "" sentinel into the WHERE clauses below.
      if (!userId) return { store: "d1", wouldAnonymize: {}, wouldDelete: {} };
      return {
        store: "d1",
        wouldAnonymize: {
          user_profiles: await countFor(
            "SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?",
            fp,
          ),
          security_events_high: await countFor(
            "SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity IN ('high','critical')",
            userId,
          ),
          consent_events: await countFor(
            "SELECT COUNT(*) c FROM consent_events WHERE subject_id = ?",
            userId,
          ),
        },
        wouldDelete: {
          session_events: await countFor(
            "SELECT COUNT(*) c FROM session_events WHERE user_id = ?",
            userId,
          ),
          security_events_low: await countFor(
            "SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity IN ('low','medium')",
            userId,
          ),
        },
      };
    },

    async anonymize(email): Promise<AdapterResult> {
      const { userId, fp } = await resolve(email);
      if (!userId) return { store: "d1", anonymized: {}, deleted: {} };
      const p = await db
        .prepare(
          "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE email_fingerprint = ?",
        )
        .bind(
          `deleted_${userId}@anonymized.local`,
          "Deleted User",
          new Date().toISOString(),
          fp,
        )
        .run();
      const sec = await db
        .prepare(
          "UPDATE security_events SET user_id = ? WHERE user_id = ? AND severity IN ('high','critical')",
        )
        .bind(fp, userId)
        .run();
      const con = await db
        .prepare(
          "UPDATE consent_events SET subject_id = ?, subject_type = 'visitor' WHERE subject_id = ?",
        )
        .bind(fp, userId)
        .run();
      return {
        store: "d1",
        anonymized: {
          user_profiles: p.meta?.changes ?? 0,
          security_events: sec.meta?.changes ?? 0,
          consent_events: con.meta?.changes ?? 0,
        },
        deleted: {},
      };
    },

    async delete(email): Promise<AdapterResult> {
      const { userId } = await resolve(email);
      if (!userId) return { store: "d1", anonymized: {}, deleted: {} };
      const ses = await db
        .prepare("DELETE FROM session_events WHERE user_id = ?")
        .bind(userId)
        .run();
      const sec = await db
        .prepare(
          "DELETE FROM security_events WHERE user_id = ? AND severity IN ('low','medium')",
        )
        .bind(userId)
        .run();
      return {
        store: "d1",
        anonymized: {},
        deleted: {
          session_events: ses.meta?.changes ?? 0,
          security_events: sec.meta?.changes ?? 0,
        },
      };
    },
  };
}
