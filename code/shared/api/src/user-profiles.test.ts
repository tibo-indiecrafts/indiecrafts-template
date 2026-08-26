import { SELF, env } from "cloudflare:test";
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

async function postSession(userId: string, locale?: string) {
  return SELF.fetch("https://example.com/v1/events", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "session", surface: "website", userId, locale }),
  });
}

describe("login upsert", () => {
  it("creates a profile row on first sign-in and refreshes it on the next", async () => {
    const first = await postSession("user_login_1");
    expect(first.status).toBe(201);

    const a = await env.DB.prepare(
      "SELECT created_at, last_login_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_login_1")
      .first<{ created_at: string; last_login_at: string }>();
    expect(a?.created_at).toBeTruthy();
    expect(a?.last_login_at).toBeTruthy();

    const second = await postSession("user_login_1");
    expect(second.status).toBe(201);

    const { results } = await env.DB.prepare(
      "SELECT created_at, last_login_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_login_1")
      .all<{ created_at: string; last_login_at: string }>();
    // exactly one row — upsert, not insert
    expect(results.length).toBe(1);
    // created_at is stable; last_login_at never goes backwards
    expect(results[0].created_at).toBe(a?.created_at);
    expect(results[0].last_login_at >= a!.last_login_at).toBe(true);
  });
});

describe("login stamps locale (COALESCE, first-login wins)", () => {
  it("sets locale on first login and never overwrites it on a later login", async () => {
    await postSession("user_loc_1", "fr");
    const a = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind("user_loc_1").first<{ locale: string }>();
    expect(a?.locale).toBe("fr");

    // A later login from a different locale must NOT overwrite the stored value.
    await postSession("user_loc_1", "en");
    const b = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind("user_loc_1").first<{ locale: string }>();
    expect(b?.locale).toBe("fr");
  });

  it("ignores an unsupported locale (stores null)", async () => {
    await postSession("user_loc_2", "zz");
    const row = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind("user_loc_2").first<{ locale: string | null }>();
    expect(row?.locale ?? null).toBeNull();
  });
});
