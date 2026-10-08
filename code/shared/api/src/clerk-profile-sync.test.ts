import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "./index";

const SECRET = "whsec_dGVzdHNlY3JldA=="; // base64("testsecret")
const SALT = "test-fingerprint-salt";

afterEach(() => vi.unstubAllGlobals());

// Sign a body the same way verifySvix() verifies it (Web Crypto, workerd).
async function svixHeaders(id: string, ts: string, body: string) {
  const secretBytes = Uint8Array.from(
    atob(SECRET.replace(/^whsec_/, "")),
    (c) => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${ts}.${body}`),
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return {
    "svix-id": id,
    "svix-timestamp": ts,
    "svix-signature": `v1,${sig}`,
    "content-type": "application/json",
  };
}

async function postWebhook(payload: unknown, envOverrides: Partial<Env> = {}) {
  const body = JSON.stringify(payload);
  const ts = String(Math.floor(Date.now() / 1000));
  const req = new Request("https://example.com/v1/clerk-webhook", {
    method: "POST",
    body,
    headers: await svixHeaders("msg_1", ts, body),
  });
  const ctx = createExecutionContext();
  // Override env per-test so the global 503-no-secret test stays valid.
  const res = await worker.fetch(
    req,
    {
      ...env,
      CLERK_WEBHOOK_SECRET: SECRET,
      GDPR_FINGERPRINT_SALT: SALT,
      ...envOverrides,
    },
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}

const created = (id: string, email: string, first = "", last = "") => ({
  type: "user.created",
  data: {
    id,
    primary_email_address_id: "e1",
    email_addresses: [{ id: "e1", email_address: email }],
    first_name: first,
    last_name: last,
  },
});

describe("clerk webhook → user_profiles", () => {
  it("user.created upserts a fingerprinted profile", async () => {
    const res = await postWebhook(
      created("user_c", "Jane@Example.com", "Jane", "Doe"),
    );
    expect(res.status).toBe(200);
    const row = await env.AUDIT_DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_c")
      .first<Record<string, unknown>>();
    expect(row?.email).toBe("Jane@Example.com");
    expect(row?.full_name).toBe("Jane Doe");
    expect(row?.email_fingerprint).toBe(
      await fingerprintEmail("Jane@Example.com", SALT),
    );
    expect(row?.anonymized).toBe(0);
  });

  it("is idempotent — replaying user.created keeps one row", async () => {
    await postWebhook(created("user_dup", "dup@x.com"));
    await postWebhook(created("user_dup", "dup@x.com"));
    const { results } = await env.AUDIT_DB.prepare(
      "SELECT user_id FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_dup")
      .all();
    expect(results.length).toBe(1);
  });

  it("user.updated re-fingerprints on email change, keeps created_at", async () => {
    await postWebhook(created("user_u", "old@x.com"));
    const before = await env.AUDIT_DB.prepare(
      "SELECT created_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_u")
      .first<{ created_at: string }>();
    await postWebhook({
      type: "user.updated",
      data: {
        id: "user_u",
        primary_email_address_id: "e2",
        email_addresses: [{ id: "e2", email_address: "new@x.com" }],
      },
    });
    const after = await env.AUDIT_DB.prepare(
      "SELECT email, email_fingerprint, created_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_u")
      .first<Record<string, unknown>>();
    expect(after?.email).toBe("new@x.com");
    expect(after?.email_fingerprint).toBe(
      await fingerprintEmail("new@x.com", SALT),
    );
    expect(after?.created_at).toBe(before?.created_at);
  });

  it("user.updated with no resolvable email keeps the stored email + fingerprint", async () => {
    await postWebhook(created("user_ne", "keep@x.com", "Keep"));
    const before = await env.AUDIT_DB.prepare(
      "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_ne")
      .first<Record<string, unknown>>();
    await postWebhook({
      type: "user.updated",
      data: { id: "user_ne", first_name: "Keep", last_name: "Updated" },
    });
    const after = await env.AUDIT_DB.prepare(
      "SELECT email, email_fingerprint, full_name FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_ne")
      .first<Record<string, unknown>>();
    expect(after?.email).toBe(before?.email);
    expect(after?.email_fingerprint).toBe(before?.email_fingerprint);
    expect(after?.full_name).toBe("Keep Updated"); // full_name still propagates
  });

  it("user.deleted pseudonymises but keeps the row + fingerprint", async () => {
    await postWebhook(created("user_d", "d@x.com", "Dee"));
    const fpBefore = (
      await env.AUDIT_DB.prepare(
        "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
      )
        .bind("user_d")
        .first<{ email_fingerprint: string }>()
    )?.email_fingerprint;
    await postWebhook({
      type: "user.deleted",
      data: { id: "user_d", deleted: true },
    });
    const row = await env.AUDIT_DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_d")
      .first<Record<string, unknown>>();
    expect(row?.email).toBe("deleted_user_d@anonymized.local");
    expect(row?.full_name).toBe("Deleted User");
    expect(row?.anonymized).toBe(1);
    expect(row?.deleted_at).toBeTruthy();
    expect(row?.email_fingerprint).toBe(fpBefore); // retained for retention matching
  });

  it("stores a valid unsafe_metadata.locale, rejects an invalid one", async () => {
    await postWebhook({
      type: "user.created",
      data: {
        id: "user_loc",
        primary_email_address_id: "e1",
        email_addresses: [{ id: "e1", email_address: "loc@x.com" }],
        unsafe_metadata: { locale: "fr" },
      },
    });
    const ok = await env.AUDIT_DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_loc")
      .first<{ locale: string | null }>();
    expect(ok?.locale).toBe("fr");

    // UNSAFE (client-set) metadata: a garbage/unknown locale must never reach the DB.
    await postWebhook({
      type: "user.created",
      data: {
        id: "user_badloc",
        primary_email_address_id: "e1",
        email_addresses: [{ id: "e1", email_address: "bad@x.com" }],
        unsafe_metadata: { locale: "zz-DROP" },
      },
    });
    const bad = await env.AUDIT_DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_badloc")
      .first<{ locale: string | null }>();
    expect(bad?.locale).toBeNull();
  });

  it("stores a sign-up marketing_email opt-in + writes a consent proof row", async () => {
    await postWebhook({
      type: "user.created",
      data: {
        id: "user_mkt",
        primary_email_address_id: "e1",
        email_addresses: [{ id: "e1", email_address: "mkt@x.com" }],
        unsafe_metadata: { marketing_email: true },
      },
    });
    const row = await env.AUDIT_DB.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_mkt")
      .first<{ marketing_email: number | null }>();
    expect(row?.marketing_email).toBe(1);
    const proof = await env.AUDIT_DB.prepare(
      "SELECT granted, source FROM consent_events WHERE subject_id = ? AND consent_type = 'marketing_email'",
    )
      .bind("user_mkt")
      .first<{ granted: number; source: string }>();
    expect(proof?.granted).toBe(1);
    expect(proof?.source).toBe("signup");
  });

  it("never clobbers marketing_email from stale metadata on user.updated", async () => {
    await postWebhook({
      type: "user.created",
      data: {
        id: "user_mkt2",
        primary_email_address_id: "e1",
        email_addresses: [{ id: "e1", email_address: "mkt2@x.com" }],
        unsafe_metadata: { marketing_email: true },
      },
    });
    // A later profile update carries the STALE sign-up value; the column must not move
    // (the settings toggle owns changes, not the webhook).
    await postWebhook({
      type: "user.updated",
      data: {
        id: "user_mkt2",
        primary_email_address_id: "e1",
        email_addresses: [{ id: "e1", email_address: "mkt2@x.com" }],
        unsafe_metadata: { marketing_email: false },
      },
    });
    const row = await env.AUDIT_DB.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_mkt2")
      .first<{ marketing_email: number | null }>();
    expect(row?.marketing_email).toBe(1);
  });

  // Stubs the Studio `emailPreferences` read fetchEmailPreferences() makes — same
  // vi.stubGlobal("fetch", …) idiom as erasure/email.test.ts and security/alert.test.ts.
  function stubSanityCategories(
    categories: { key: string; includeAtSignup: boolean }[],
  ) {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              result: {
                categories: categories.map((c) => ({
                  key: c.key,
                  name: { en: c.key },
                  description: { en: c.key },
                  includeAtSignup: c.includeAtSignup,
                })),
                notices: [],
              },
            }),
            { status: 200 },
          ),
      ),
    );
  }

  it("user.created with marketing opt-in grants the includeAtSignup categories", async () => {
    stubSanityCategories([
      { key: "news", includeAtSignup: true },
      { key: "offers", includeAtSignup: false },
      { key: "tips", includeAtSignup: true },
    ]);
    await postWebhook(
      {
        type: "user.created",
        data: {
          id: "user_signup_grant",
          primary_email_address_id: "e1",
          email_addresses: [{ id: "e1", email_address: "grant@x.com" }],
          unsafe_metadata: { marketing_email: true },
        },
      },
      { SANITY_PROJECT_ID: "proj", SANITY_DATASET: "production" },
    );

    const news = await env.AUDIT_DB.prepare(
      "SELECT granted FROM email_preferences WHERE user_id = ? AND category_key = ?",
    )
      .bind("user_signup_grant", "news")
      .first<{ granted: number }>();
    expect(news?.granted).toBe(1);
    const tips = await env.AUDIT_DB.prepare(
      "SELECT granted FROM email_preferences WHERE user_id = ? AND category_key = ?",
    )
      .bind("user_signup_grant", "tips")
      .first<{ granted: number }>();
    expect(tips?.granted).toBe(1);

    // Not includeAtSignup → no row written for it.
    const offers = await env.AUDIT_DB.prepare(
      "SELECT * FROM email_preferences WHERE user_id = ? AND category_key = ?",
    )
      .bind("user_signup_grant", "offers")
      .first();
    expect(offers).toBeNull();

    const proof = await env.AUDIT_DB.prepare(
      "SELECT granted, surface FROM consent_events WHERE subject_id = ? AND consent_type = 'email_pref:news'",
    )
      .bind("user_signup_grant")
      .first<{ granted: number; surface: string }>();
    expect(proof?.granted).toBe(1);
    expect(proof?.surface).toBe("signup");

    const profile = await env.AUDIT_DB.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_signup_grant")
      .first<{ marketing_email: number | null }>();
    expect(profile?.marketing_email).toBe(1);
  });

  // Clerk's real event is `email.created`, and its payload carries the rendered HTML
  // (~12 KB for a verification code) — far over the 4 KB route cap the webhook once shared.
  it("email.created (real size) is sent via Resend", async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        calls.push(String(input));
        return new Response(JSON.stringify({ id: "re_1" }), { status: 200 });
      }),
    );
    const res = await postWebhook(
      {
        type: "email.created",
        data: {
          to_email_address: "otp@x.com",
          slug: "verification_code",
          subject: "123456 is your verification code",
          body: "<p>x</p>".repeat(1500),
          data: { otp_code: "123456" },
        },
      },
      { RESEND_API_KEY: "re_test", EMAIL_FROM: "no-reply@x.com" },
    );
    expect(res.status).toBe(200);
    expect(calls.some((u) => u.includes("api.resend.com"))).toBe(true);
  });

  it("rejects a webhook body over the webhook cap (413)", async () => {
    const res = await postWebhook({
      type: "user.updated",
      data: { id: "u", pad: "x".repeat(70_000) },
    });
    expect(res.status).toBe(413);
  });

  // A yes reaches Resend as the `news` topic + the language segment (what a newsletter issue
  // targets), not just a global flag. A no never touches Resend: the same email may already
  // be a confirmed newsletter subscriber.
  it("sign-up yes mirrors the news topic + segment to Resend; a no makes no Resend call", async () => {
    const calls: { at: string; body?: unknown }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("sanity.io"))
          return new Response(
            JSON.stringify({
              result: {
                categories: [
                  {
                    key: "news",
                    name: { en: "News" },
                    description: { en: "News" },
                    includeAtSignup: true,
                    resendTopicId: "t_news",
                  },
                ],
                notices: [],
              },
            }),
          );
        const at = `${init?.method ?? "GET"} ${url.replace("https://api.resend.com", "")}`;
        calls.push({
          at,
          body: init?.body ? JSON.parse(String(init.body)) : undefined,
        });
        if (at === "GET /segments?limit=100")
          return new Response(
            JSON.stringify({ data: [{ id: "seg_en", name: "newsletter-en" }] }),
          );
        if (at.startsWith("GET /contacts/"))
          return new Response(JSON.stringify({ data: [] }));
        return new Response("{}");
      }),
    );
    const overrides = {
      SANITY_PROJECT_ID: "proj",
      SANITY_DATASET: "production",
      RESEND_API_KEY: "re_test",
    };
    const signUp = (id: string, email: string, yes: boolean) =>
      postWebhook(
        {
          type: "user.created",
          data: {
            id,
            primary_email_address_id: "e1",
            email_addresses: [{ id: "e1", email_address: email }],
            unsafe_metadata: { marketing_email: yes, locale: "en" },
          },
        },
        overrides,
      );

    await signUp("user_su_yes", "yes@x.com", true);
    const contacts = calls.filter((c) => c.at.includes("/contacts"));
    expect(contacts[0]).toEqual({
      at: "POST /contacts",
      body: {
        email: "yes@x.com",
        properties: { locale: "en" },
        topics: [{ id: "t_news", subscription: "opt_in" }],
      },
    });
    expect(contacts.map((c) => c.at)).toContain(
      "POST /contacts/yes@x.com/segments/seg_en",
    );

    calls.length = 0;
    await signUp("user_su_no", "no@x.com", false);
    expect(calls.filter((c) => c.at.includes("/contacts"))).toEqual([]);
  });

  it("no marketing opt-in at sign-up → no granted email_preferences rows", async () => {
    await postWebhook({
      type: "user.created",
      data: {
        id: "user_no_grant",
        primary_email_address_id: "e1",
        email_addresses: [{ id: "e1", email_address: "nogrant@x.com" }],
        unsafe_metadata: { marketing_email: false },
      },
    });
    const { results } = await env.AUDIT_DB.prepare(
      "SELECT * FROM email_preferences WHERE user_id = ?",
    )
      .bind("user_no_grant")
      .all();
    expect(results.length).toBe(0);
  });
});
