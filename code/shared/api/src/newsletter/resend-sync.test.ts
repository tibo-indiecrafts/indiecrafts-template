import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../index";

const SECRET = "whsec_dGVzdHNlY3JldA=="; // base64("testsecret")
const TOPIC = "topic-news";
const EMAIL = "reader@example.com";

afterEach(() => vi.unstubAllGlobals());

type Call = { url: string; method: string; body: unknown };

/** One stubbed `fetch` for Sanity + Resend, routed by URL. Records every call. */
function stubFetch(
  opts: {
    topicId?: string;
    subscription?: "opt_in" | "opt_out";
    topicsStatus?: number;
    subscribers?: { _id: string }[];
    mutateStatus?: number;
    resendStatus?: number;
  } = {},
) {
  const calls: Call[] = [];
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = String(input);
      calls.push({
        url,
        method: init.method ?? "GET",
        body: init.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (url.includes("/data/mutate/"))
        return reply({}, opts.mutateStatus ?? 200);
      if (url.includes("sanity.io") && url.includes("emailPreferences"))
        return reply({
          result: {
            categories: [
              {
                key: "news",
                name: "News",
                description: "",
                includeAtSignup: true,
                ...(opts.topicId === undefined
                  ? { resendTopicId: TOPIC }
                  : opts.topicId
                    ? { resendTopicId: opts.topicId }
                    : {}),
              },
            ],
          },
        });
      if (url.includes("sanity.io"))
        return reply({ result: opts.subscribers ?? [{ _id: "sub1" }] });
      if (url.includes("/topics") && (init.method ?? "GET") === "GET")
        return reply(
          {
            object: "list",
            has_more: false,
            data: [{ id: TOPIC, subscription: opts.subscription ?? "opt_in" }],
          },
          opts.topicsStatus ?? 200,
        );
      return reply({}, opts.resendStatus ?? 200);
    }),
  );
  return calls;
}

const testEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    ...env,
    RESEND_API_KEY: "re_test",
    SANITY_PROJECT_ID: "proj",
    SANITY_DATASET: "production",
    SANITY_API_WRITE_TOKEN: "write",
    RESEND_WEBHOOK_SECRET: SECRET,
    ...overrides,
  }) as Env;

async function call(req: Request, e: Env) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(req, e, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

const resendCalls = (calls: Call[]) =>
  calls.filter((c) => c.url.startsWith("https://api.resend.com"));

describe("POST /v1/newsletter/subscribers", () => {
  const post = (
    body: unknown,
    e = testEnv(),
    auth: Record<string, string> = { authorization: "Bearer test-token" },
  ) =>
    call(
      new Request("https://api.test/v1/newsletter/subscribers", {
        method: "POST",
        headers: { ...auth, "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      e,
    );

  it("401s without the bearer", async () => {
    stubFetch();
    const res = await post(
      { email: EMAIL, locale: "en", granted: true },
      testEnv(),
      {},
    );
    expect(res.status).toBe(401);
  });

  it("400s an invalid email, locale or granted", async () => {
    const calls = stubFetch();
    for (const body of [
      { email: "nope", locale: "en", granted: true },
      { email: "a/b@example.com", locale: "en", granted: true },
      { email: `${"a".repeat(250)}@example.com`, locale: "en", granted: true },
      { email: EMAIL, locale: "EN", granted: true },
      { email: EMAIL, locale: "en", granted: "true" },
      { email: EMAIL, locale: "en" },
    ])
      expect((await post(body)).status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it("opt-in: clears the global flag and opts into news (204)", async () => {
    const calls = stubFetch();
    const res = await post({
      email: " Reader@Example.com ",
      locale: "en",
      granted: true,
    });
    expect(res.status).toBe(204);
    const [create] = resendCalls(calls);
    expect(create.method).toBe("POST");
    expect(create.url).toBe("https://api.resend.com/contacts");
    expect(create.body).toEqual({
      email: EMAIL,
      unsubscribed: false,
      topics: [{ id: TOPIC, subscription: "opt_in" }],
    });
  });

  it("opt-out: only the news topic opt_out, never the global flag (204)", async () => {
    const calls = stubFetch();
    const res = await post({ email: EMAIL, locale: "fr", granted: false });
    expect(res.status).toBe(204);
    const sent = resendCalls(calls);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toEqual({
      url: `https://api.resend.com/contacts/${EMAIL}/topics`,
      method: "PATCH",
      body: [{ id: TOPIC, subscription: "opt_out" }],
    });
  });

  it("no news topic configured: opt-in sets only the global flag, opt-out no-ops", async () => {
    const calls = stubFetch({ topicId: "" });
    expect(
      (await post({ email: EMAIL, locale: "en", granted: true })).status,
    ).toBe(204);
    expect(resendCalls(calls).map((c) => c.body)).toEqual([
      { email: EMAIL, unsubscribed: false },
    ]);
    calls.length = 0;
    expect(
      (await post({ email: EMAIL, locale: "en", granted: false })).status,
    ).toBe(204);
    expect(resendCalls(calls)).toHaveLength(0);
  });

  it("no RESEND_API_KEY: no outbound call (204)", async () => {
    const calls = stubFetch();
    const res = await post(
      { email: EMAIL, locale: "en", granted: true },
      testEnv({ RESEND_API_KEY: "" }),
    );
    expect(res.status).toBe(204);
    expect(calls).toHaveLength(0);
  });

  it("a Resend error is logged and still answers 204", async () => {
    stubFetch({ resendStatus: 500 });
    const res = await post({ email: EMAIL, locale: "en", granted: true });
    expect(res.status).toBe(204);
  });
});

// Sign a body the same way verifySvix() verifies it (Web Crypto, workerd).
async function svixHeaders(body: string, secret = SECRET) {
  const id = "msg_1";
  const ts = String(Math.floor(Date.now() / 1000));
  const key = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (c) =>
      c.charCodeAt(0),
    ),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${ts}.${body}`),
  );
  return {
    "svix-id": id,
    "svix-timestamp": ts,
    "svix-signature": `v1,${btoa(String.fromCharCode(...new Uint8Array(mac)))}`,
    "content-type": "application/json",
  };
}

describe("POST /v1/resend/webhook", () => {
  const hook = async (payload: unknown, e = testEnv(), secret = SECRET) => {
    const body = JSON.stringify(payload);
    return call(
      new Request("https://api.test/v1/resend/webhook", {
        method: "POST",
        body,
        headers: await svixHeaders(body, secret),
      }),
      e,
    );
  };
  const updated = (unsubscribed: boolean) => ({
    type: "contact.updated",
    created_at: "2026-10-08T00:00:00.000Z",
    data: { id: "c1", email: "Reader@Example.com", unsubscribed },
  });
  const mutations = (calls: Call[]) =>
    calls.filter((c) => c.url.includes("/data/mutate/")).map((c) => c.body);
  const UNSUB = {
    mutations: [{ patch: { id: "sub1", set: { status: "unsubscribed" } } }],
  };

  it("503s without RESEND_WEBHOOK_SECRET", async () => {
    stubFetch();
    const res = await hook(
      updated(true),
      testEnv({ RESEND_WEBHOOK_SECRET: "" }),
    );
    expect(res.status).toBe(503);
  });

  it("401s a bad or missing signature", async () => {
    const calls = stubFetch();
    expect(
      (await hook(updated(true), testEnv(), "whsec_d3Jvbmc=")).status,
    ).toBe(401);
    const res = await call(
      new Request("https://api.test/v1/resend/webhook", {
        method: "POST",
        body: JSON.stringify(updated(true)),
      }),
      testEnv(),
    );
    expect(res.status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it("ignores an unhandled event type (200)", async () => {
    const calls = stubFetch();
    const res = await hook({ type: "email.sent", data: { email: EMAIL } });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toHaveLength(0);
  });

  it("unsubscribed:true → sets the confirmed subscriber to unsubscribed", async () => {
    const calls = stubFetch();
    expect((await hook(updated(true))).status).toBe(200);
    const query = calls.find(
      (c) => c.url.includes("/data/query/") && c.url.includes("subscriber"),
    );
    expect(decodeURIComponent(query!.url)).toContain('status == "confirmed"');
    expect(decodeURIComponent(query!.url)).toContain(`$email="${EMAIL}"`);
    expect(mutations(calls)).toEqual([UNSUB]);
  });

  it("news topic opt_out → patch", async () => {
    const calls = stubFetch({ subscription: "opt_out" });
    expect((await hook(updated(false))).status).toBe(200);
    expect(
      calls.some(
        (c) =>
          c.url === `https://api.resend.com/contacts/${EMAIL}/topics?limit=100`,
      ),
    ).toBe(true);
    expect(mutations(calls)).toEqual([UNSUB]);
  });

  it("contact.topics.updated with news opt_out → patch (inline topics, no GET)", async () => {
    const calls = stubFetch();
    const res = await hook({
      type: "contact.topics.updated",
      data: { email: EMAIL, topics: [{ id: TOPIC, subscription: "opt_out" }] },
    });
    expect(res.status).toBe(200);
    expect(resendCalls(calls)).toHaveLength(0);
    expect(mutations(calls)).toEqual([UNSUB]);
  });

  it("news topic opt_in → no patch", async () => {
    const calls = stubFetch({ subscription: "opt_in" });
    expect((await hook(updated(false))).status).toBe(200);
    expect(mutations(calls)).toHaveLength(0);
  });

  it("a failed topics lookup → only the global flag counts (no patch)", async () => {
    const calls = stubFetch({ topicsStatus: 500 });
    expect((await hook(updated(false))).status).toBe(200);
    expect(mutations(calls)).toHaveLength(0);
  });

  it("contact.deleted → patch", async () => {
    const calls = stubFetch();
    const res = await hook({ type: "contact.deleted", data: { email: EMAIL } });
    expect(res.status).toBe(200);
    expect(mutations(calls)).toEqual([UNSUB]);
  });

  it("is idempotent: no confirmed doc left → no write", async () => {
    const calls = stubFetch({ subscribers: [] });
    expect((await hook(updated(true))).status).toBe(200);
    expect(mutations(calls)).toHaveLength(0);
  });

  it("a Sanity write failure → 500 so Resend retries", async () => {
    stubFetch({ mutateStatus: 500 });
    expect((await hook(updated(true))).status).toBe(500);
  });

  it("never writes confirmed", async () => {
    const calls = stubFetch();
    for (const payload of [
      updated(true),
      updated(false),
      { type: "contact.deleted", data: { email: EMAIL } },
      { type: "contact.created", data: { email: EMAIL, unsubscribed: false } },
    ])
      await hook(payload);
    for (const m of mutations(calls))
      expect(JSON.stringify(m)).not.toContain("confirmed");
  });
});
