import { env, SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

async function postConsent(body: Record<string, unknown>) {
  return SELF.fetch("https://example.com/v1/events", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "consent", ...body }),
  });
}

describe("migration 0003 — consent_events", () => {
  it("creates the table with the expected columns", async () => {
    const { results } = await env.DB.prepare(
      "PRAGMA table_info(consent_events)",
    ).all<{ name: string }>();
    const cols = results.map((r) => r.name);
    expect(cols).toEqual(
      expect.arrayContaining([
        "id",
        "ts",
        "subject_type",
        "subject_id",
        "email_fingerprint",
        "consent_type",
        "granted",
        "policy_version",
        "surface",
        "source",
        "country",
        "ip_hash",
        "idempotency_key",
      ]),
    );
  });

  it("enforces UNIQUE(idempotency_key)", async () => {
    const row = (k: string) =>
      env.DB.prepare(
        "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'visitor', 's', 'cookie_analytics', 1, 'v1', 'website', ?)",
      )
        .bind(new Date(0).toISOString(), k)
        .run();
    await row("dup:cookie_analytics");
    await row("dup:cookie_analytics");
    const { results } = await env.DB.prepare(
      "SELECT id FROM consent_events WHERE idempotency_key = ?",
    )
      .bind("dup:cookie_analytics")
      .all();
    expect(results.length).toBe(1);
  });
});

describe("kind:consent → consent_events", () => {
  it("writes one row per event, linking a user row to the erasure key", async () => {
    // Seed a fingerprinted profile so the user row can copy the erasure key.
    await env.DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind("user_c1", "c1@x.com", "fp_c1", new Date(0).toISOString())
      .run();

    const res = await postConsent({
      userId: "user_c1",
      decisionId: "d1",
      policyVersion: "2026-01",
      surface: "website",
      source: "banner",
      events: [
        { type: "cookie_analytics", granted: true },
        { type: "cookie_marketing", granted: false },
      ],
    });
    expect(res.status).toBe(201);

    const { results } = await env.DB.prepare(
      "SELECT consent_type, granted, subject_type, subject_id, email_fingerprint FROM consent_events WHERE subject_id = ? ORDER BY consent_type",
    )
      .bind("user_c1")
      .all<Record<string, unknown>>();
    expect(results.length).toBe(2);
    expect(results[0]).toMatchObject({
      consent_type: "cookie_analytics",
      granted: 1,
      subject_type: "user",
      email_fingerprint: "fp_c1",
    });
    expect(results[1]).toMatchObject({
      consent_type: "cookie_marketing",
      granted: 0,
    });
  });

  it("is idempotent — replaying the same decisionId keeps one row per type", async () => {
    const body = {
      consentId: "anon_1",
      decisionId: "d2",
      policyVersion: "2026-01",
      surface: "website",
      events: [{ type: "cookie_analytics", granted: true }],
    };
    await postConsent(body);
    await postConsent(body);
    const { results } = await env.DB.prepare(
      "SELECT id FROM consent_events WHERE idempotency_key = ?",
    )
      .bind("d2:cookie_analytics")
      .all();
    expect(results.length).toBe(1);
  });

  it("logs an anonymous visitor row (no fingerprint) and drops unknown types", async () => {
    const res = await postConsent({
      consentId: "anon_2",
      decisionId: "d3",
      policyVersion: "2026-01",
      surface: "website",
      events: [
        { type: "cookie_marketing", granted: true },
        { type: "bogus_type", granted: true },
      ],
    });
    expect(res.status).toBe(201);
    const { results } = await env.DB.prepare(
      "SELECT consent_type, subject_type, email_fingerprint FROM consent_events WHERE subject_id = ?",
    )
      .bind("anon_2")
      .all<Record<string, unknown>>();
    expect(results.length).toBe(1); // bogus_type filtered out
    expect(results[0]).toMatchObject({
      consent_type: "cookie_marketing",
      subject_type: "visitor",
      email_fingerprint: null,
    });
  });

  it("400s when neither userId nor consentId is present", async () => {
    const res = await postConsent({
      decisionId: "d4",
      policyVersion: "2026-01",
      surface: "website",
      events: [{ type: "cookie_analytics", granted: true }],
    });
    expect(res.status).toBe(400);
  });
});
