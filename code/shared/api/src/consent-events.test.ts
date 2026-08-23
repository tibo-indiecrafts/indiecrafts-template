import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

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
