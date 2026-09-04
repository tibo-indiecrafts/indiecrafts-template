import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { handleClerkUserDeleted } from "./clerk-deleted";

const SALT = "wh-salt";
const EMAIL = "gone@x.com";
const USER = "user_gone";

// Adapters WITHOUT clerk (the webhook path) — d1 real, sanity mocked.
function webhookAdapters() {
  const sanity = createSanityErasureAdapter(
    { findByEmail: vi.fn(async () => []), pseudonymise: vi.fn(async () => {}) },
    SALT,
  );
  return [
    createCoreErasureAdapter(env.CORE_DB, SALT),
    createAuditErasureAdapter(env.DB, env.CORE_DB, SALT),
    sanity,
    createOrdersErasureAdapter(),
  ];
}

describe("handleClerkUserDeleted", () => {
  it("runs the full engine minus clerk and pseudonymizes the profile + audits it", async () => {
    (
      env as unknown as { GDPR_FINGERPRINT_SALT: string }
    ).GDPR_FINGERPRINT_SALT = SALT;
    const fp = await fingerprintEmail(EMAIL, SALT);
    await env.CORE_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind(USER, EMAIL, fp, new Date(0).toISOString())
      .run();

    await handleClerkUserDeleted(
      env as never,
      USER,
      "2026-01-01T00:00:00.000Z",
      () => webhookAdapters(),
    );

    const prof = await env.CORE_DB.prepare(
      "SELECT anonymized FROM user_profiles WHERE user_id = ?",
    )
      .bind(USER)
      .first<{ anonymized: number }>();
    expect(prof?.anonymized).toBe(1); // engine's d1-core pseudonymized it

    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE event = 'erasure.clerk_deleted' AND target_user_id = ?",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.clerk_deleted");

    // Proof-of-erasure row — mirrors self.ts's erasure_requests bookkeeping.
    const request = await env.CORE_DB.prepare(
      "SELECT status, user_id, email_fingerprint, completed_at FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{
        status: string;
        user_id: string;
        email_fingerprint: string;
        completed_at: string | null;
      }>();
    expect(request?.status).toBe("completed");
    expect(request?.user_id).toBe(USER);
    expect(request?.email_fingerprint).toBe(fp);
    expect(request?.completed_at).toBe("2026-01-01T00:00:00.000Z");
  });

  it("falls back to a partial pseudonymize when there is no profile row", async () => {
    await handleClerkUserDeleted(
      env as never,
      "user_no_profile",
      "2026-01-01T00:00:00.000Z",
      () => webhookAdapters(),
    );
    // No throw; nothing to key the engine on. (Assert it did not create an audit row.)
    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = 'user_no_profile'",
    ).first();
    expect(audit).toBeNull();
    // Nor a proof-of-erasure row — the engine never ran.
    const request = await env.CORE_DB.prepare(
      "SELECT id FROM erasure_requests WHERE user_id = 'user_no_profile'",
    ).first();
    expect(request).toBeNull();
  });

  it("scrubs email + name even when the salt is unset (no silent no-op)", async () => {
    const prevSalt = (env as unknown as { GDPR_FINGERPRINT_SALT?: string })
      .GDPR_FINGERPRINT_SALT;
    (
      env as unknown as { GDPR_FINGERPRINT_SALT?: string }
    ).GDPR_FINGERPRINT_SALT = undefined;
    try {
      const USER = "user_nosalt";
      await env.CORE_DB.prepare(
        "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, NULL, ?)",
      )
        .bind(USER, "keep@x.com", "Real Name", new Date(0).toISOString())
        .run();

      await handleClerkUserDeleted(
        env as never,
        USER,
        "2026-01-01T00:00:00.000Z",
      );

      const prof = await env.CORE_DB.prepare(
        "SELECT email, full_name, anonymized FROM user_profiles WHERE user_id = ?",
      )
        .bind(USER)
        .first<{ email: string; full_name: string; anonymized: number }>();
      expect(prof?.anonymized).toBe(1); // scrubbed, NOT a silent no-op
      expect(prof?.email).not.toBe("keep@x.com"); // email pseudonymized
      expect(prof?.full_name).toBe("Deleted User");
    } finally {
      (
        env as unknown as { GDPR_FINGERPRINT_SALT?: string }
      ).GDPR_FINGERPRINT_SALT = prevSalt;
    }
  });
});
