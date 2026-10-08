import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import { handleMarketingConsent } from "./marketing";

const ENV = { ...env, CLERK_SECRET_KEY: "sk_test" } as typeof env;
const authOK = async () => "user_mc";
const authFail = async () => null;

async function seed() {
  await ENV.MAIN_DB!.prepare(
    "INSERT OR IGNORE INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind("user_mc", "mc@x.com", "fp_mc", new Date().toISOString())
    .run();
}

const get = () =>
  new Request("https://x/v1/consent/marketing-email", { method: "GET" });
const post = (granted: boolean) =>
  new Request("https://x/v1/consent/marketing-email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ granted, surface: "app" }),
  });

describe("GET/POST /v1/consent/marketing-email", () => {
  it("401s when the JWT does not verify", async () => {
    const res = await handleMarketingConsent(get(), ENV, undefined, authFail);
    expect(res.status).toBe(401);
  });

  it("GET returns null before any decision", async () => {
    await seed();
    const res = await handleMarketingConsent(get(), ENV, undefined, authOK);
    expect(await res.json()).toEqual({ marketing_email: null });
  });

  const pref = (key: string) =>
    ENV.MAIN_DB!.prepare(
      "SELECT granted FROM email_preferences WHERE user_id = ? AND category_key = ?",
    )
      .bind("user_mc", key)
      .first<{ granted: number }>();
  const column = async () =>
    (
      await ENV.MAIN_DB!.prepare(
        "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
      )
        .bind("user_mc")
        .first<{ marketing_email: number | null }>()
    )?.marketing_email;
  // Two Studio categories: `news` is granted at sign-up, `offers` is not.
  const fetchCategories = async () => ({
    categories: [
      {
        key: "news",
        name: "",
        description: "",
        includeAtSignup: true,
        resendTopicId: "t_news",
      },
      {
        key: "offers",
        name: "",
        description: "",
        includeAtSignup: false,
        resendTopicId: "t_offers",
      },
    ],
    notices: [],
  });

  it("POST(granted) writes the proof and grants the sign-up categories", async () => {
    await seed();
    const sync = vi.fn(async () => {});
    const res = await handleMarketingConsent(
      post(true),
      ENV,
      undefined,
      authOK,
      {
        fetchCategories,
        sync,
      },
    );
    expect(await res.json()).toEqual({ ok: true });

    const proof = await ENV.MAIN_DB!.prepare(
      "SELECT granted, source, surface FROM consent_events WHERE subject_id = ? AND consent_type = 'marketing_email' ORDER BY id DESC",
    )
      .bind("user_mc")
      .first<{ granted: number; source: string; surface: string }>();
    expect(proof).toEqual({ granted: 1, source: "account", surface: "app" });

    expect((await pref("news"))?.granted).toBe(1);
    expect(await pref("offers")).toBeNull();
    expect(await column()).toBe(1);
    expect(sync).toHaveBeenCalledWith(ENV, {
      email: "mc@x.com",
      topics: [{ topicId: "t_news", granted: true }],
      newsletterLocale: "en",
    });

    // GET now reflects the stored decision.
    const after = await handleMarketingConsent(get(), ENV, undefined, authOK);
    expect(await after.json()).toEqual({ marketing_email: true });
  });

  // The switch and the Emails page must agree: a "no" turns every category off.
  it("POST(!granted) turns every category off, so the column and the Emails page agree", async () => {
    await seed();
    const sync = vi.fn(async () => {});
    const deps = { fetchCategories, sync };
    await handleMarketingConsent(post(true), ENV, undefined, authOK, deps);
    await handleMarketingConsent(post(false), ENV, undefined, authOK, deps);

    expect((await pref("news"))?.granted).toBe(0);
    expect((await pref("offers"))?.granted).toBe(0);
    expect(await column()).toBe(0);
    expect(sync).toHaveBeenLastCalledWith(ENV, {
      email: "mc@x.com",
      topics: [
        { topicId: "t_news", granted: false },
        { topicId: "t_offers", granted: false },
      ],
      newsletterLocale: null,
    });
  });
});
