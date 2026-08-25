import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { createAuditErasureAdapter, createCoreErasureAdapter } from "./d1";

const SALT = "test-erasure-salt";
const EMAIL = "erase-me@x.com";
const USER = "user_erase_1";

// One local test D1 carries both the core + audit migrations (see vitest.config.ts), so
// coreDb and auditDb are the SAME handle here. The adapters take separate handles for
// runtime binding separation; these tests exercise the SQL behavior, not the physical
// DB split, so one handle for both is correct.
const coreDb = env.DB;
const auditDb = env.DB;

async function seed() {
  const fp = await fingerprintEmail(EMAIL, SALT);
  const now = new Date(0).toISOString();
  await coreDb
    .prepare(
      "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(USER, EMAIL, "Real Name", fp, now)
    .run();
  await auditDb
    .prepare(
      "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
    )
    .bind(now, USER)
    .run();
  await auditDb
    .prepare(
      "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'failed_login', 'low', ?)",
    )
    .bind(now, USER)
    .run();
  await auditDb
    .prepare(
      "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'credential_stuffing', 'high', ?)",
    )
    .bind(now, USER)
    .run();
  await coreDb
    .prepare(
      "INSERT INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'user', ?, ?, 'cookie_analytics', 1, 'v1', 'website', ?)",
    )
    .bind(now, USER, fp, `${USER}:k`)
    .run();
  return fp;
}

const OTHER_EMAIL = "unrelated@x.com";
const OTHER_USER = "user_unrelated_1";

async function seedOther() {
  const fp = await fingerprintEmail(OTHER_EMAIL, SALT);
  const now = new Date(0).toISOString();
  await coreDb
    .prepare(
      "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(OTHER_USER, OTHER_EMAIL, "Other Name", fp, now)
    .run();
  await auditDb
    .prepare(
      "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
    )
    .bind(now, OTHER_USER)
    .run();
  await auditDb
    .prepare(
      "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'failed_login', 'low', ?)",
    )
    .bind(now, OTHER_USER)
    .run();
  await coreDb
    .prepare(
      "INSERT INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'user', ?, ?, 'cookie_analytics', 1, 'v1', 'website', ?)",
    )
    .bind(now, OTHER_USER, fp, `${OTHER_USER}:k`)
    .run();
}

describe("D1 erasure adapters (core + audit split)", () => {
  beforeEach(async () => {
    // isolatedStorage gives each test a clean DB; seed fresh.
    await seed();
  });

  describe("core adapter (user_profiles, consent_events)", () => {
    it("findByEmail resolves the subject by fingerprint", async () => {
      const core = createCoreErasureAdapter(coreDb, SALT);
      const m = await core.findByEmail(EMAIL);
      expect(m.found).toBe(true);
    });

    // Core adapter pseudonymises identity, leaves audit alone.
    it("core adapter pseudonymises user_profiles + consent_events", async () => {
      const core = createCoreErasureAdapter(coreDb, SALT);
      const res = await core.anonymize(EMAIL);
      expect(res.store).toBe("d1-core");
      expect(res.anonymized.user_profiles).toBe(1);
      expect(res.anonymized.consent_events).toBeGreaterThanOrEqual(1);
      const prof = await coreDb
        .prepare("SELECT email, anonymized FROM user_profiles WHERE user_id = ?")
        .bind(USER)
        .first<{ email: string; anonymized: number }>();
      expect(prof?.email).toMatch(/@anonymized\.local$/);
      expect(prof?.anonymized).toBe(1);
    });

    it("anonymize retains the fingerprint and pseudonymises consent_events", async () => {
      const fp = await fingerprintEmail(EMAIL, SALT);
      const core = createCoreErasureAdapter(coreDb, SALT);
      await core.anonymize(EMAIL);

      const prof = await coreDb
        .prepare("SELECT * FROM user_profiles WHERE user_id=?")
        .bind(USER)
        .first<Record<string, unknown>>();
      expect(prof?.full_name).toBe("Deleted User");
      expect(prof?.email_fingerprint).toBe(fp); // retained

      const consent = await coreDb
        .prepare("SELECT subject_id, subject_type FROM consent_events")
        .first<Record<string, unknown>>();
      expect(consent?.subject_id).toBe(fp);
      expect(consent?.subject_type).toBe("visitor");
    });

    it("delete is a no-op — core pseudonymises, nothing is hard-deleted", async () => {
      const core = createCoreErasureAdapter(coreDb, SALT);
      const res = await core.delete(EMAIL);
      expect(res.store).toBe("d1-core");
      expect(res.deleted).toEqual({});
      const prof = await coreDb
        .prepare("SELECT email FROM user_profiles WHERE user_id=?")
        .bind(USER)
        .first<{ email: string }>();
      expect(prof?.email).toBe(EMAIL); // untouched by delete()
    });

    it("resolveSubject falls back to plaintext email when email_fingerprint is null", async () => {
      const nullFpEmail = "nullfp@x.com";
      const nullFpUser = "user_null_fp";
      const now = new Date(0).toISOString();
      await coreDb
        .prepare(
          "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, NULL, ?)",
        )
        .bind(nullFpUser, nullFpEmail, "No Fingerprint", now)
        .run();

      const core = createCoreErasureAdapter(coreDb, SALT);
      await core.anonymize(nullFpEmail);

      const prof = await coreDb
        .prepare(
          "SELECT email, full_name, anonymized FROM user_profiles WHERE user_id=?",
        )
        .bind(nullFpUser)
        .first<Record<string, unknown>>();
      expect(prof?.email).toBe(`deleted_${nullFpUser}@anonymized.local`);
      expect(prof?.full_name).toBe("Deleted User");
      expect(prof?.anonymized).toBe(1);
    });

    it("preview reports counts without mutating", async () => {
      const core = createCoreErasureAdapter(coreDb, SALT);
      const p = await core.preview(EMAIL);
      expect(p.store).toBe("d1-core");
      expect(p.wouldAnonymize.user_profiles).toBe(1);
      expect(p.wouldAnonymize.consent_events).toBe(1);
      expect(p.wouldDelete).toEqual({});
      const prof = await coreDb
        .prepare("SELECT email FROM user_profiles WHERE user_id=?")
        .bind(USER)
        .first<{ email: string }>();
      expect(prof?.email).toBe(EMAIL);
    });

    it("export gathers the subject's user_profiles + consent_events rows", async () => {
      const core = createCoreErasureAdapter(coreDb, SALT);
      const data = (await core.export(EMAIL)) as Record<string, unknown[]>;
      expect(data.user_profiles.length).toBe(1);
      expect(data.consent_events.length).toBe(1);
    });

    it("erasing one subject leaves an unrelated subject's rows untouched", async () => {
      await seedOther();
      const core = createCoreErasureAdapter(coreDb, SALT);
      await core.anonymize(EMAIL);

      const otherProf = await coreDb
        .prepare(
          "SELECT email, full_name, anonymized FROM user_profiles WHERE user_id=?",
        )
        .bind(OTHER_USER)
        .first<Record<string, unknown>>();
      expect(otherProf?.email).toBe(OTHER_EMAIL);
      expect(otherProf?.full_name).toBe("Other Name");
      expect(otherProf?.anonymized).toBe(0);

      const otherConsent = await coreDb
        .prepare("SELECT subject_type FROM consent_events WHERE subject_id=?")
        .bind(OTHER_USER)
        .first<{ subject_type: string }>();
      expect(otherConsent?.subject_type).toBe("user");
    });

    it("erasing an unknown email is a clean no-op", async () => {
      const core = createCoreErasureAdapter(coreDb, SALT);
      const anon = await core.anonymize("nobody@nowhere.com");
      expect(anon.anonymized).toEqual({});
      const preview = await core.preview("nobody@nowhere.com");
      expect(preview.wouldAnonymize).toEqual({});
      expect(preview.wouldDelete).toEqual({});

      const prof = await coreDb
        .prepare("SELECT email FROM user_profiles WHERE user_id=?")
        .bind(USER)
        .first<{ email: string }>();
      expect(prof?.email).toBe(EMAIL);
    });
  });

  describe("audit adapter (session_events, security_events; resolves via core)", () => {
    it("findByEmail resolves via core and counts session_events", async () => {
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      const m = await audit.findByEmail(EMAIL);
      expect(m.found).toBe(true);
      expect(m.detail?.session_events).toBe(1);
    });

    // Audit adapter resolves user_id FROM core, then scrubs audit.
    it("audit adapter resolves via core and scrubs session/security", async () => {
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      await audit.anonymize(EMAIL); // security_events high/critical → fingerprint
      const del = await audit.delete(EMAIL); // session_events + low/med security deleted
      expect(del.store).toBe("d1-audit");
      expect(del.deleted.session_events).toBeGreaterThanOrEqual(1);
      const sess = await auditDb
        .prepare("SELECT COUNT(*) c FROM session_events WHERE user_id = ?")
        .bind(USER)
        .first<{ c: number }>();
      expect(sess?.c).toBe(0);
    });

    it("anonymize pseudonymises high/critical security_events to the fingerprint", async () => {
      const fp = await fingerprintEmail(EMAIL, SALT);
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      await audit.anonymize(EMAIL);
      const high = await auditDb
        .prepare("SELECT user_id FROM security_events WHERE severity='high'")
        .first<{ user_id: string }>();
      expect(high?.user_id).toBe(fp);
    });

    it("delete removes all session events + low/medium security events; retains high/critical", async () => {
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      await audit.delete(EMAIL);
      const sessions = await auditDb
        .prepare("SELECT COUNT(*) c FROM session_events WHERE user_id=?")
        .bind(USER)
        .first<{ c: number }>();
      expect(sessions?.c).toBe(0);
      const low = await auditDb
        .prepare("SELECT COUNT(*) c FROM security_events WHERE severity='low'")
        .first<{ c: number }>();
      expect(low?.c).toBe(0);
      const high = await auditDb
        .prepare("SELECT COUNT(*) c FROM security_events WHERE severity='high'")
        .first<{ c: number }>();
      expect(high?.c).toBe(1); // retained (pseudonymised by anonymize, not deleted)
    });

    it("delete removes a security event with an off-list severity (exhaustive complement)", async () => {
      // Bypass the type: a raw SQL insert can carry any TEXT value, not just the
      // known low/medium/high/critical set. NOT IN ('high','critical') must still
      // catch it, or the raw user_id would silently survive erasure.
      const now = new Date(0).toISOString();
      await auditDb
        .prepare(
          "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'suspicious_pattern', 'unknown', ?)",
        )
        .bind(now, USER)
        .run();

      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      await audit.delete(EMAIL);

      const unknown = await auditDb
        .prepare(
          "SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity = 'unknown'",
        )
        .bind(USER)
        .first<{ c: number }>();
      expect(unknown?.c).toBe(0);
    });

    it("preview reports counts without mutating", async () => {
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      const p = await audit.preview(EMAIL);
      expect(p.store).toBe("d1-audit");
      expect(p.wouldAnonymize.security_events_high).toBe(1);
      expect(p.wouldDelete.session_events).toBe(1);
      expect(p.wouldDelete.security_events_deleted).toBe(1);
      // nothing changed
      const sessions = await auditDb
        .prepare("SELECT COUNT(*) c FROM session_events WHERE user_id=?")
        .bind(USER)
        .first<{ c: number }>();
      expect(sessions?.c).toBe(1);
    });

    it("export gathers the subject's session_events + security_events rows", async () => {
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      const data = (await audit.export(EMAIL)) as Record<string, unknown[]>;
      expect(data.session_events.length).toBe(1);
      expect(data.security_events.length).toBe(2);
    });

    it("erasing one subject leaves an unrelated subject's rows untouched", async () => {
      await seedOther();
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      await audit.anonymize(EMAIL);
      await audit.delete(EMAIL);

      const otherSessions = await auditDb
        .prepare("SELECT COUNT(*) c FROM session_events WHERE user_id=?")
        .bind(OTHER_USER)
        .first<{ c: number }>();
      expect(otherSessions?.c).toBe(1);

      const otherSecurity = await auditDb
        .prepare("SELECT COUNT(*) c FROM security_events WHERE user_id=?")
        .bind(OTHER_USER)
        .first<{ c: number }>();
      expect(otherSecurity?.c).toBe(1);
    });

    it("erasing an unknown email is a clean no-op", async () => {
      const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
      const anon = await audit.anonymize("nobody@nowhere.com");
      expect(anon.anonymized).toEqual({});
      const del = await audit.delete("nobody@nowhere.com");
      expect(del.deleted).toEqual({});
      const preview = await audit.preview("nobody@nowhere.com");
      expect(preview.wouldAnonymize).toEqual({});
      expect(preview.wouldDelete).toEqual({});

      // Seeded subject A's rows are untouched.
      const sessions = await auditDb
        .prepare("SELECT COUNT(*) c FROM session_events WHERE user_id=?")
        .bind(USER)
        .first<{ c: number }>();
      expect(sessions?.c).toBe(1);
    });
  });
});
