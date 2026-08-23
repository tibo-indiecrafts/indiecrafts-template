import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("migration 0002 — user_profiles", () => {
  it("creates the table with the expected columns", async () => {
    const { results } = await env.DB.prepare(
      "PRAGMA table_info(user_profiles)",
    ).all<{ name: string }>();
    const cols = results.map((r) => r.name);
    expect(cols).toEqual(
      expect.arrayContaining([
        "user_id",
        "email",
        "full_name",
        "locale",
        "email_fingerprint",
        "created_at",
        "last_login_at",
        "deleted_at",
        "anonymized",
      ]),
    );
  });
});
