import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { createD1ErasureAdapter } from "./d1";

const SALT = "test-erasure-salt";
const EMAIL = "erase-me@x.com";
const USER = "user_erase_1";

async function seed() {
  const fp = await fingerprintEmail(EMAIL, SALT);
  const now = new Date(0).toISOString();
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(USER, EMAIL, "Real Name", fp, now)
    .run();
  await env.DB.prepare(
    "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
  )
    .bind(now, USER)
    .run();
  await env.DB.prepare(
    "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'failed_login', 'low', ?)",
  )
    .bind(now, USER)
    .run();
  await env.DB.prepare(
    "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'credential_stuffing', 'high', ?)",
  )
    .bind(now, USER)
    .run();
  await env.DB.prepare(
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
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(OTHER_USER, OTHER_EMAIL, "Other Name", fp, now)
    .run();
  await env.DB.prepare(
    "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
  )
    .bind(now, OTHER_USER)
    .run();
  await env.DB.prepare(
    "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'failed_login', 'low', ?)",
  )
    .bind(now, OTHER_USER)
    .run();
  await env.DB.prepare(
    "INSERT INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'user', ?, ?, 'cookie_analytics', 1, 'v1', 'website', ?)",
  )
    .bind(now, OTHER_USER, fp, `${OTHER_USER}:k`)
    .run();
}

describe("D1 erasure adapter", () => {
  beforeEach(async () => {
    // isolatedStorage gives each test a clean DB; seed fresh.
    await seed();
  });

  it("findByEmail resolves the subject by fingerprint", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const m = await a.findByEmail(EMAIL);
    expect(m.found).toBe(true);
  });

  it("anonymize pseudonymises the profile, keeps the fingerprint, pseudonymises high/critical + consent", async () => {
    const fp = await fingerprintEmail(EMAIL, SALT);
    const a = createD1ErasureAdapter(env.DB, SALT);
    await a.anonymize(EMAIL);

    const prof = await env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id=?",
    )
      .bind(USER)
      .first<Record<string, unknown>>();
    expect(prof?.email).toBe(`deleted_${USER}@anonymized.local`);
    expect(prof?.full_name).toBe("Deleted User");
    expect(prof?.anonymized).toBe(1);
    expect(prof?.email_fingerprint).toBe(fp); // retained

    const high = await env.DB.prepare(
      "SELECT user_id FROM security_events WHERE severity='high'",
    ).first<{ user_id: string }>();
    expect(high?.user_id).toBe(fp); // pseudonymised to the fingerprint

    const consent = await env.DB.prepare(
      "SELECT subject_id, subject_type FROM consent_events",
    ).first<Record<string, unknown>>();
    expect(consent?.subject_id).toBe(fp);
    expect(consent?.subject_type).toBe("visitor");
  });

  it("delete removes all session events + low/medium security events; retains high/critical", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    await a.delete(EMAIL);
    const sessions = await env.DB.prepare(
      "SELECT COUNT(*) c FROM session_events WHERE user_id=?",
    )
      .bind(USER)
      .first<{ c: number }>();
    expect(sessions?.c).toBe(0);
    const low = await env.DB.prepare(
      "SELECT COUNT(*) c FROM security_events WHERE severity='low'",
    ).first<{ c: number }>();
    expect(low?.c).toBe(0);
    const high = await env.DB.prepare(
      "SELECT COUNT(*) c FROM security_events WHERE severity='high'",
    ).first<{ c: number }>();
    expect(high?.c).toBe(1); // retained (pseudonymised by anonymize, not deleted)
  });

  it("preview reports counts without mutating", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const p = await a.preview(EMAIL);
    expect(p.store).toBe("d1");
    expect(p.wouldAnonymize.security_events_high).toBe(1);
    expect(p.wouldAnonymize.consent_events).toBe(1);
    expect(p.wouldDelete.session_events).toBe(1);
    expect(p.wouldDelete.security_events_low).toBe(1);
    // nothing changed
    const prof = await env.DB.prepare(
      "SELECT email FROM user_profiles WHERE user_id=?",
    )
      .bind(USER)
      .first<{ email: string }>();
    expect(prof?.email).toBe(EMAIL);
  });

  it("export gathers the subject's rows across tables", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const data = (await a.export(EMAIL)) as Record<string, unknown[]>;
    expect((data.user_profiles as unknown[]).length).toBe(1);
    expect((data.session_events as unknown[]).length).toBe(1);
    expect((data.consent_events as unknown[]).length).toBe(1);
  });

  it("erasing one subject leaves an unrelated subject's rows untouched", async () => {
    await seedOther();
    const a = createD1ErasureAdapter(env.DB, SALT);
    await a.anonymize(EMAIL);
    await a.delete(EMAIL);

    const otherProf = await env.DB.prepare(
      "SELECT email, full_name, anonymized FROM user_profiles WHERE user_id=?",
    )
      .bind(OTHER_USER)
      .first<Record<string, unknown>>();
    expect(otherProf?.email).toBe(OTHER_EMAIL);
    expect(otherProf?.full_name).toBe("Other Name");
    expect(otherProf?.anonymized).toBe(0);

    const otherSessions = await env.DB.prepare(
      "SELECT COUNT(*) c FROM session_events WHERE user_id=?",
    )
      .bind(OTHER_USER)
      .first<{ c: number }>();
    expect(otherSessions?.c).toBe(1);

    const otherSecurity = await env.DB.prepare(
      "SELECT COUNT(*) c FROM security_events WHERE user_id=?",
    )
      .bind(OTHER_USER)
      .first<{ c: number }>();
    expect(otherSecurity?.c).toBe(1);

    const otherConsent = await env.DB.prepare(
      "SELECT subject_type FROM consent_events WHERE subject_id=?",
    )
      .bind(OTHER_USER)
      .first<{ subject_type: string }>();
    expect(otherConsent?.subject_type).toBe("user");
  });

  it("erasing an unknown email is a clean no-op", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const anon = await a.anonymize("nobody@nowhere.com");
    expect(anon.anonymized).toEqual({});
    const del = await a.delete("nobody@nowhere.com");
    expect(del.deleted).toEqual({});
    const preview = await a.preview("nobody@nowhere.com");
    expect(preview.wouldAnonymize).toEqual({});
    expect(preview.wouldDelete).toEqual({});

    // Seeded subject A's rows are untouched.
    const prof = await env.DB.prepare(
      "SELECT email FROM user_profiles WHERE user_id=?",
    )
      .bind(USER)
      .first<{ email: string }>();
    expect(prof?.email).toBe(EMAIL);
    const sessions = await env.DB.prepare(
      "SELECT COUNT(*) c FROM session_events WHERE user_id=?",
    )
      .bind(USER)
      .first<{ c: number }>();
    expect(sessions?.c).toBe(1);
  });
});
