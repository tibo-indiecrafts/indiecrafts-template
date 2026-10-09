import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import {
  handleEmailPreferences,
  handleTokenPreferences,
  handleOneClickUnsubscribe,
  emailPreferenceLinks,
} from "./email-preferences";
import type { PrefCategory, PrefNotice } from "./email-preferences-sanity";
import { signPrefToken, verifyPrefToken } from "./pref-token";

const ENV = { ...env, CLERK_SECRET_KEY: "sk_test" } as typeof env;
const authOK = async () => "user_ep_http";
const authFail = async () => null;
const PREF_SECRET = "test-pref-secret";
const prefEnv = (overrides: Partial<Env> = {}): Env =>
  ({ ...ENV, EMAIL_PREF_SECRET: PREF_SECRET, ...overrides }) as Env;

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

const tokenGet = (token: string) =>
  new Request(
    `https://x/v1/email-preferences?token=${encodeURIComponent(token)}`,
    { method: "GET" },
  );
const tokenPost = (
  token: string,
  updates: { key: string; granted: boolean }[],
) =>
  new Request("https://x/v1/email-preferences", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token, updates }),
  });
const unsubPost = (token: string) =>
  new Request(
    `https://x/v1/email-preferences/unsubscribe?token=${encodeURIComponent(token)}`,
    { method: "POST" },
  );

describe("GET/POST /v1/consent/email-preferences", () => {
  it("GET resolves the copy in the page's ?locale=, else the profile's", async () => {
    await seed("user_ep_locale");
    const seen: string[] = [];
    const spy = async (_env: unknown, locale: string) => {
      seen.push(locale);
      return { categories: CATEGORIES, notices: NOTICES };
    };
    const at = (q: string) =>
      handleEmailPreferences(
        new Request(`https://x/v1/consent/email-preferences${q}`),
        ENV,
        undefined,
        { authenticate: async () => "user_ep_locale", fetchCategories: spy },
      );
    await at("?locale=fr");
    await at("?locale=xx"); // not a site locale → ignored
    await at("");
    expect(seen).toEqual(["fr", "en", "en"]);
  });

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

  it("GET shows General on for an address that joined the waitlist, until the user decides", async () => {
    const userId = "user_ep_waitlist";
    await seed(userId);
    await ENV.MAIN_DB!.prepare(
      "INSERT INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, idempotency_key) VALUES (?, 'visitor', ?, ?, 'waitlist', 1, 'v1', 'website', 'waitlist', ?)",
    )
      .bind(
        new Date().toISOString(),
        `fp_${userId}`,
        `fp_${userId}`,
        `waitlist:fp_${userId}:1`,
      )
      .run();
    const withGeneral = async () => ({
      categories: [
        ...CATEGORIES,
        {
          key: "general",
          name: "General",
          description: "Launch news.",
          includeAtSignup: false,
          resendTopicId: "topic_general",
        },
      ],
      notices: NOTICES,
    });
    const general = async () => {
      const res = await handleEmailPreferences(get(), ENV, undefined, {
        authenticate: async () => userId,
        fetchCategories: withGeneral,
      });
      const body = (await res.json()) as {
        categories: { key: string; granted: boolean }[];
      };
      return body.categories.find((c) => c.key === "general")?.granted;
    };
    expect(await general()).toBe(true);
    // Their own choice wins.
    await ENV.MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, 'general', 0, ?)",
    )
      .bind(userId, new Date().toISOString())
      .run();
    expect(await general()).toBe(false);
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

    const proof = await ENV.MAIN_DB!.prepare(
      "SELECT subject_id, email_fingerprint, granted FROM consent_events WHERE consent_type = 'email_pref:news'",
    )
      .bind()
      .first<{
        subject_id: string;
        email_fingerprint: string;
        granted: number;
      }>();
    expect(proof).toEqual({
      subject_id: "user_ep_http",
      email_fingerprint: "fp_user_ep_http",
      granted: 1,
    });

    expect(sync).toHaveBeenCalledWith(ENV, {
      email: "user_ep_http@x.com",
      topics: [
        { topicId: "topic_news", granted: true },
        { topicId: "topic_offers", granted: false },
      ],
      newsletterLocale: "en",
    });
  });

  it("POST moves the newsletter language segment only when `news` changes", async () => {
    await seed("user_ep_seg");
    const sync = vi.fn(async () => {});
    const deps = {
      authenticate: async () => "user_ep_seg",
      fetchCategories,
      sync,
    };
    await handleEmailPreferences(
      post([{ key: "news", granted: false }]),
      ENV,
      undefined,
      deps,
    );
    expect(sync).toHaveBeenLastCalledWith(ENV, {
      email: "user_ep_seg@x.com",
      topics: [{ topicId: "topic_news", granted: false }],
      newsletterLocale: null,
    });
    await handleEmailPreferences(
      post([{ key: "offers", granted: true }]),
      ENV,
      undefined,
      deps,
    );
    expect(sync).toHaveBeenLastCalledWith(ENV, {
      email: "user_ep_seg@x.com",
      topics: [{ topicId: "topic_offers", granted: true }],
    });
  });
});

describe("GET/POST /v1/email-preferences (no-login token)", () => {
  it("503s when EMAIL_PREF_SECRET is unset", async () => {
    const res = await handleTokenPreferences(
      tokenGet("whatever"),
      ENV,
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res.status).toBe(503);
  });

  it("401s on a bad token", async () => {
    const res = await handleTokenPreferences(
      tokenGet("garbage"),
      prefEnv(),
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res.status).toBe(401);
  });

  it("401s on an absent token", async () => {
    const res = await handleTokenPreferences(
      new Request("https://x/v1/email-preferences", { method: "GET" }),
      prefEnv(),
      undefined,
      { fetchCategories },
    );
    expect(res.status).toBe(401);
  });

  it("valid token GET returns the user's state", async () => {
    await seed("user_ep_token");
    await ENV.MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, 'news', 1, ?)",
    )
      .bind("user_ep_token", new Date().toISOString())
      .run();
    const token = await signPrefToken(PREF_SECRET, "user_ep_token");

    const res = await handleTokenPreferences(
      tokenGet(token),
      prefEnv(),
      undefined,
      {
        fetchCategories,
      },
    );
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

  it("valid token POST writes the store", async () => {
    await seed("user_ep_token2");
    const token = await signPrefToken(PREF_SECRET, "user_ep_token2");
    const sync = vi.fn(async () => {});
    const res = await handleTokenPreferences(
      tokenPost(token, [{ key: "news", granted: true }]),
      prefEnv(),
      undefined,
      { fetchCategories, sync },
    );
    expect(await res.json()).toEqual({ ok: true });

    const row = await ENV.MAIN_DB!.prepare(
      "SELECT granted FROM email_preferences WHERE user_id = ? AND category_key = 'news'",
    )
      .bind("user_ep_token2")
      .first<{ granted: number }>();
    expect(row?.granted).toBe(1);
    expect(sync).toHaveBeenCalledOnce();
  });
});

describe("POST /v1/email-preferences/unsubscribe", () => {
  it("503s when EMAIL_PREF_SECRET is unset", async () => {
    const res = await handleOneClickUnsubscribe(
      unsubPost("whatever"),
      ENV,
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res.status).toBe(503);
  });

  it("401s on a bad token", async () => {
    const res = await handleOneClickUnsubscribe(
      unsubPost("garbage"),
      prefEnv(),
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res.status).toBe(401);
  });

  it("401s on an absent token", async () => {
    const res = await handleOneClickUnsubscribe(
      new Request("https://x/v1/email-preferences/unsubscribe", {
        method: "POST",
      }),
      prefEnv(),
      undefined,
      { fetchCategories },
    );
    expect(res.status).toBe(401);
  });

  it("a category-scoped token unsubscribes just that category, idempotently", async () => {
    await seed("user_unsub_1");
    const now = new Date().toISOString();
    await ENV.MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, 'news', 1, ?), (?, 'offers', 1, ?)",
    )
      .bind("user_unsub_1", now, "user_unsub_1", now)
      .run();
    const token = await signPrefToken(PREF_SECRET, "user_unsub_1", "news");

    const res1 = await handleOneClickUnsubscribe(
      unsubPost(token),
      prefEnv(),
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res1.status).toBe(200);
    expect(await res1.json()).toEqual({ ok: true });

    const rows = await ENV.MAIN_DB!.prepare(
      "SELECT category_key, granted FROM email_preferences WHERE user_id = ? ORDER BY category_key",
    )
      .bind("user_unsub_1")
      .all<{ category_key: string; granted: number }>();
    expect(rows.results).toEqual([
      { category_key: "news", granted: 0 },
      { category_key: "offers", granted: 1 },
    ]);

    // idempotent — clicking the same link twice stays a clean 200.
    const res2 = await handleOneClickUnsubscribe(
      unsubPost(token),
      prefEnv(),
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res2.status).toBe(200);
    expect(await res2.json()).toEqual({ ok: true });
  });

  it("an unscoped token unsubscribes every marketing category", async () => {
    await seed("user_unsub_2");
    const now = new Date().toISOString();
    await ENV.MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, 'news', 1, ?), (?, 'offers', 1, ?)",
    )
      .bind("user_unsub_2", now, "user_unsub_2", now)
      .run();
    const token = await signPrefToken(PREF_SECRET, "user_unsub_2");

    const res = await handleOneClickUnsubscribe(
      unsubPost(token),
      prefEnv(),
      undefined,
      {
        fetchCategories,
      },
    );
    expect(res.status).toBe(200);

    const rows = await ENV.MAIN_DB!.prepare(
      "SELECT category_key, granted FROM email_preferences WHERE user_id = ? ORDER BY category_key",
    )
      .bind("user_unsub_2")
      .all<{ category_key: string; granted: number }>();
    expect(rows.results).toEqual([
      { category_key: "news", granted: 0 },
      { category_key: "offers", granted: 0 },
    ]);
  });

  it("a stale/renamed category token still 200s (RFC 8058) but writes nothing", async () => {
    await seed("user_unsub_stale");
    // "retired" is not in `fetchCategories`'s current category set (CATEGORIES only has
    // news/offers) — simulates a Studio category renamed/removed after the email went out.
    const token = await signPrefToken(
      PREF_SECRET,
      "user_unsub_stale",
      "retired",
    );

    const res = await handleOneClickUnsubscribe(
      unsubPost(token),
      prefEnv(),
      undefined,
      { fetchCategories },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const prefRows = await ENV.MAIN_DB!.prepare(
      "SELECT category_key FROM email_preferences WHERE user_id = ?",
    )
      .bind("user_unsub_stale")
      .all<{ category_key: string }>();
    expect(prefRows.results).toEqual([]);

    const proofRows = await ENV.MAIN_DB!.prepare(
      "SELECT consent_type FROM consent_events WHERE subject_id = ?",
    )
      .bind("user_unsub_stale")
      .all<{ consent_type: string }>();
    expect(proofRows.results).toEqual([]);
  });
});

describe("emailPreferenceLinks", () => {
  it("builds the manage + unsubscribe urls and RFC 8058 headers", async () => {
    const links = await emailPreferenceLinks(
      prefEnv({ WEBSITE_URL: "https://site.example" }),
      "user_links",
      "news",
    );
    expect(
      links.manageUrl.startsWith(
        "https://site.example/email-preferences?token=",
      ),
    ).toBe(true);
    expect(
      links.unsubscribeUrl.startsWith(
        "https://site.example/v1/email-preferences/unsubscribe?token=",
      ),
    ).toBe(true);
    expect(links.headers["List-Unsubscribe"]).toBe(`<${links.unsubscribeUrl}>`);
    expect(links.headers["List-Unsubscribe-Post"]).toBe(
      "List-Unsubscribe=One-Click",
    );

    const token = new URL(links.unsubscribeUrl).searchParams.get("token")!;
    expect(await verifyPrefToken(PREF_SECRET, token)).toEqual({
      uid: "user_links",
      cat: "news",
    });
  });

  it("throws when EMAIL_PREF_SECRET is unset", async () => {
    await expect(emailPreferenceLinks(ENV, "user_links")).rejects.toThrow();
  });
});
