import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import { handleProfileLocale, getProfileLocale } from "./locale";

const USER = "user_locale_1";

function testEnv(overrides: Partial<Env> = {}): Env {
  return { ...(env as unknown as Env), CLERK_SECRET_KEY: "sk_test", ...overrides };
}

function postJson(body: Record<string, unknown>): Request {
  return new Request("https://example.com/v1/profile/locale", {
    method: "POST",
    headers: { authorization: "Bearer tkn", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const authOk = vi.fn(async () => USER);
const authNone = vi.fn(async () => null);

describe("POST /v1/profile/locale", () => {
  it("upserts the profile locale for the authenticated user", async () => {
    const res = await handleProfileLocale(postJson({ locale: "fr" }), testEnv(), undefined, authOk);
    expect(res.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind(USER).first<{ locale: string }>();
    expect(row?.locale).toBe("fr");
  });

  it("rejects an unsupported locale with 400", async () => {
    const res = await handleProfileLocale(postJson({ locale: "zz" }), testEnv(), undefined, authOk);
    expect(res.status).toBe(400);
  });

  it("returns 401 when the JWT does not resolve a user", async () => {
    const res = await handleProfileLocale(postJson({ locale: "fr" }), testEnv(), undefined, authNone);
    expect(res.status).toBe(401);
  });

  it("returns 503 when CORE_DB is unbound", async () => {
    const res = await handleProfileLocale(
      postJson({ locale: "fr" }),
      testEnv({ CORE_DB: undefined }),
      undefined,
      authOk,
    );
    expect(res.status).toBe(503);
  });
});

describe("getProfileLocale", () => {
  it("reads back a stored locale and returns null when absent", async () => {
    await handleProfileLocale(postJson({ locale: "en" }), testEnv(), undefined, async () => "user_read_1");
    expect(await getProfileLocale(testEnv(), "user_read_1")).toBe("en");
    expect(await getProfileLocale(testEnv(), "user_absent")).toBeNull();
  });
});
