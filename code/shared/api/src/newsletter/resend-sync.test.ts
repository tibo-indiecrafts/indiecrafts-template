import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../index";

const TOPIC = "topic-news";
const EMAIL = "reader@example.com";
const SALT = "test-newsletter-salt";
const CONSENT_AT = "2026-10-08T09:30:00.000Z";
const SEGMENTS = [
  { id: "seg-en", name: "newsletter-en" },
  { id: "seg-fr", name: "newsletter-fr" },
  { id: "seg-other", name: "vip" },
];

afterEach(() => vi.unstubAllGlobals());

type Call = { url: string; method: string; body: unknown };

/** One stubbed `fetch` for Sanity + Resend, routed by URL. Records every call. */
function stubFetch(
  opts: {
    topicId?: string;
    resendStatus?: number;
    segments?: { id: string; name: string }[];
    contactSegments?: { id: string; name: string }[];
  } = {},
) {
  const calls: Call[] = [];
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = String(input);
      const method = init.method ?? "GET";
      calls.push({
        url,
        method,
        body: init.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (url.includes("sanity.io"))
        return reply({
          result: {
            categories: [
              {
                key: "news",
                name: "News",
                description: "",
                includeAtSignup: true,
                ...(opts.topicId === ""
                  ? {}
                  : { resendTopicId: opts.topicId ?? TOPIC }),
              },
            ],
          },
        });
      if (url === "https://api.resend.com/segments?limit=100")
        return reply({ data: opts.segments ?? SEGMENTS, has_more: false });
      if (url.endsWith("/segments?limit=100"))
        return reply({ data: opts.contactSegments ?? [], has_more: false });
      return reply({}, opts.resendStatus ?? 200);
    }),
  );
  return calls;
}

const testEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    ...env,
    RESEND_API_KEY: "re_test",
    GDPR_FINGERPRINT_SALT: SALT,
    SANITY_PROJECT_ID: "proj",
    SANITY_DATASET: "production",
    ...overrides,
  }) as Env;

async function call(req: Request, e: Env) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(req, e, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

const resendCalls = (calls: Call[]) =>
  calls
    .filter((c) => c.url.startsWith("https://api.resend.com"))
    .map((c) => ({ ...c, url: c.url.replace("https://api.resend.com", "") }));

const consentRows = async (email = EMAIL) =>
  (
    await env
      .MAIN_DB!.prepare(
        "SELECT ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key FROM consent_events WHERE email_fingerprint = ?",
      )
      .bind(await fingerprintEmail(email, SALT))
      .all()
  ).results;

const VALID = {
  email: EMAIL,
  locale: "fr",
  policyVersion: "2026-10",
  consentAt: CONSENT_AT,
};

describe("POST /v1/newsletter/subscribers", () => {
  const post = (
    body: unknown,
    e = testEnv(),
    headers: Record<string, string> = { authorization: "Bearer test-token" },
  ) =>
    call(
      new Request("https://api.test/v1/newsletter/subscribers", {
        method: "POST",
        headers: { ...headers, "content-type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      e,
    );

  it("401s without the bearer", async () => {
    stubFetch();
    expect((await post(VALID, testEnv(), {})).status).toBe(401);
  });

  it("400s a bad body and writes nothing", async () => {
    const calls = stubFetch();
    for (const body of [
      "not json",
      { ...VALID, email: "nope" },
      { ...VALID, email: "a/b@example.com" },
      { ...VALID, email: `${"a".repeat(250)}@example.com` },
      { ...VALID, locale: "EN" },
      { ...VALID, policyVersion: 1 },
      { ...VALID, policyVersion: "v".repeat(121) },
      { ...VALID, consentAt: undefined },
      { ...VALID, consentAt: "yesterday" },
      { ...VALID, consentAt: "2026-13-45T00:00:00Z" },
      { email: EMAIL, locale: "en", granted: true },
    ])
      expect((await post(body)).status).toBe(400);
    expect(calls).toHaveLength(0);
    expect(await consentRows()).toHaveLength(0);
  });

  it("413s an oversized body", async () => {
    stubFetch();
    const res = await post({ ...VALID, policyVersion: "v".repeat(5000) });
    expect(res.status).toBe(413);
  });

  it.each(["RESEND_API_KEY", "MAIN_DB", "GDPR_FINGERPRINT_SALT"] as const)(
    "503s without %s",
    async (key) => {
      const calls = stubFetch();
      const res = await post(VALID, testEnv({ [key]: undefined }));
      expect(res.status).toBe(503);
      expect(await res.json()).toMatchObject({ error: "unavailable" });
      expect(calls).toHaveLength(0);
    },
  );

  it("204: one consent row, a Resend subscriber, the language segment", async () => {
    const calls = stubFetch({ contactSegments: [SEGMENTS[0], SEGMENTS[2]] });
    const res = await post(
      { ...VALID, email: " Reader@Example.com " },
      testEnv(),
      { authorization: "Bearer test-token", "cf-ipcountry": "FR" },
    );
    expect(res.status).toBe(204);

    const fp = await fingerprintEmail(EMAIL, SALT);
    expect(await consentRows()).toEqual([
      {
        ts: CONSENT_AT,
        subject_type: "visitor",
        subject_id: fp,
        email_fingerprint: fp,
        consent_type: "newsletter",
        granted: 1,
        policy_version: "2026-10",
        surface: "website",
        source: "double_opt_in",
        country: null, // the caller is the website server, not the visitor
        ip_hash: null,
        idempotency_key: `newsletter:${fp}:${CONSENT_AT}`,
      },
    ]);

    expect(resendCalls(calls)).toEqual([
      {
        url: "/contacts",
        method: "POST",
        body: {
          email: EMAIL,
          unsubscribed: false,
          properties: { locale: "fr" },
          topics: [{ id: TOPIC, subscription: "opt_in" }],
        },
      },
      { url: "/segments?limit=100", method: "GET", body: undefined },
      {
        url: `/contacts/${EMAIL}/segments?limit=100`,
        method: "GET",
        body: undefined,
      },
      {
        url: `/contacts/${EMAIL}/segments/seg-fr`,
        method: "POST",
        body: undefined,
      },
      {
        url: `/contacts/${EMAIL}/segments/seg-en`,
        method: "DELETE",
        body: undefined,
      },
    ]);
  });

  it("a repeat click with the same consentAt keeps one row and changes no segment", async () => {
    stubFetch();
    expect((await post(VALID)).status).toBe(204);
    const calls = stubFetch({ contactSegments: [SEGMENTS[1]] });
    expect((await post(VALID)).status).toBe(204);
    expect(await consentRows()).toHaveLength(1);
    expect(
      resendCalls(calls).filter((c) => c.url.includes("/segments/")),
    ).toHaveLength(0);
  });

  it("an empty policyVersion is stored as 'unknown'", async () => {
    stubFetch();
    expect((await post({ ...VALID, policyVersion: "" })).status).toBe(204);
    expect(await consentRows()).toEqual([
      expect.objectContaining({ policy_version: "unknown" }),
    ]);
  });

  it("no news topic configured: the contact is created without topics", async () => {
    const calls = stubFetch({ topicId: "" });
    expect((await post(VALID)).status).toBe(204);
    expect(resendCalls(calls)[0].body).toEqual({
      email: EMAIL,
      unsubscribed: false,
      properties: { locale: "fr" },
    });
  });

  it("no newsletter-<locale> segment (setup not run): still 204, segments untouched", async () => {
    const calls = stubFetch({ segments: [SEGMENTS[0]] });
    expect((await post(VALID)).status).toBe(204);
    expect(resendCalls(calls).map((c) => `${c.method} ${c.url}`)).toEqual([
      "POST /contacts",
      "GET /segments?limit=100",
    ]);
  });

  it("a Resend failure answers 502 and keeps the consent row", async () => {
    stubFetch({ resendStatus: 500 });
    const res = await post(VALID);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ error: "resend" });
    expect(await consentRows()).toHaveLength(1);
  });
});
