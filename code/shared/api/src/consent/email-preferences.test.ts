import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import { handleEmailPreferences } from "./email-preferences";
import type { PrefCategory, PrefNotice } from "./email-preferences-sanity";

const ENV = { ...env, CLERK_SECRET_KEY: "sk_test" } as typeof env;
const authOK = async () => "user_ep_http";
const authFail = async () => null;

const CATEGORIES: PrefCategory[] = [
  {
    key: "news",
    name: "News",
    description: "Product updates.",
    includeAtSignup: true,
    resendTopicId: "topic_news",
  },
  {
    key: "offers",
    name: "Offers",
    description: "Discounts.",
    includeAtSignup: false,
    resendTopicId: "topic_offers",
  },
];
const NOTICES: PrefNotice[] = [{ name: "Orders", description: "Order mail." }];
const fetchCategories = async () => ({
  categories: CATEGORIES,
  notices: NOTICES,
});

async function seed(userId: string) {
  await ENV.MAIN_DB!.prepare(
    "INSERT OR IGNORE INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(userId, `${userId}@x.com`, `fp_${userId}`, new Date().toISOString())
    .run();
}

const get = () =>
  new Request("https://x/v1/consent/email-preferences", { method: "GET" });
const post = (updates: { key: string; granted: boolean }[]) =>
  new Request("https://x/v1/consent/email-preferences", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ updates, surface: "app" }),
  });

describe("GET/POST /v1/consent/email-preferences", () => {
  it("401s when the JWT does not verify", async () => {
    const res = await handleEmailPreferences(get(), ENV, undefined, {
      authenticate: authFail,
      fetchCategories,
    });
    expect(res.status).toBe(401);
  });

  it("GET merges the Sanity categories with the stored granted state", async () => {
    await seed("user_ep_http");
    await ENV.MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, 'news', 1, ?)",
    )
      .bind("user_ep_http", new Date().toISOString())
      .run();

    const res = await handleEmailPreferences(get(), ENV, undefined, {
      authenticate: authOK,
      fetchCategories,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      categories: [
        {
          key: "news",
          name: "News",
          description: "Product updates.",
          includeAtSignup: true,
          granted: true,
        },
        {
          key: "offers",
          name: "Offers",
          description: "Discounts.",
          includeAtSignup: false,
          granted: false,
        },
      ],
      notices: NOTICES,
      marketing_email: null,
    });
  });

  it("POST an unknown key returns 400 invalid_category", async () => {
    await seed("user_ep_http");
    const res = await handleEmailPreferences(
      post([{ key: "bogus", granted: true }]),
      ENV,
      undefined,
      { authenticate: authOK, fetchCategories },
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_category" });
  });

  it("POST valid updates writes the store, returns {ok:true}, and mirrors the changed topics", async () => {
    await seed("user_ep_http");
    const sync = vi.fn(async () => {});
    const res = await handleEmailPreferences(
      post([
        { key: "news", granted: true },
        { key: "offers", granted: false },
      ]),
      ENV,
      undefined,
      { authenticate: authOK, fetchCategories, sync },
    );
    expect(await res.json()).toEqual({ ok: true });

    const rows = await ENV.MAIN_DB!.prepare(
      "SELECT category_key, granted FROM email_preferences WHERE user_id = ? ORDER BY category_key",
    )
      .bind("user_ep_http")
      .all<{ category_key: string; granted: number }>();
    expect(rows.results).toEqual([
      { category_key: "news", granted: 1 },
      { category_key: "offers", granted: 0 },
    ]);

    expect(sync).toHaveBeenCalledWith(ENV, {
      email: "user_ep_http@x.com",
      topics: [
        { topicId: "topic_news", granted: true },
        { topicId: "topic_offers", granted: false },
      ],
    });
  });
});
