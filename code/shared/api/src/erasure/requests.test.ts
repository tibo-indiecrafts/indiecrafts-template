import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("migration 0004 — erasure_requests", () => {
  it("creates the table with the expected columns", async () => {
    const { results } = await env.AUDIT_DB.prepare(
      "PRAGMA table_info(erasure_requests)",
    ).all<{ name: string }>();
    const cols = results.map((r) => r.name);
    expect(cols).toEqual(
      expect.arrayContaining([
        "id",
        "status",
        "token_hash",
        "token_expires_at",
        "attempts",
        "user_id",
        "email_fingerprint",
        "requested_at",
        "confirmed_at",
        "completed_at",
        "due_at",
        "result",
      ]),
    );
  });
});
