import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../index";

const TOPIC = "topic-general";
const EMAIL = "early@example.com";
const SALT = "test-general-salt";
const CONSENT_AT = "2026-10-09T09:30:00.000Z";

afterEach(() => vi.unstubAllGlobals());

type Call = { url: string; method: string; body: unknown };

/** One stubbed `fetch` for Sanity + Resend, routed by URL. Records every call. */
function stubFetch(opts: { exists?: boolean; resendStatus?: number } = {}) {
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
      if (url.includes("sanity.io"))
        return reply({
          result: {
            categories: [
              { key: "news", name: "News", resendTopicId: "topic-news" },
              { key: "general", name: "General", resendTopicId: TOPIC },
            ],
          },
        });
      if (url === "https://api.resend.com/contacts" && opts.exists)
        return reply({}, 409);
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

const resendCalls = (calls: Call[]) =>
  calls
    .filter((c) => c.url.startsWith("https://api.resend.com"))
    .map((c) => ({ ...c, url: c.url.replace("https://api.resend.com", "") }));

const consentRows = async (email = EMAIL) =>
  (
    await env
      .MAIN_DB!.prepare(
        "SELECT consent_type, granted, policy_version, source, idempotency_key FROM consent_events WHERE email_fingerprint = ?",
      )
      .bind(await fingerprintEmail(email, SALT))
      .all()
  ).results;

const WAITLIST = {
  email: EMAIL,
  locale: "fr",
  source: "waitlist",
  policyVersion: "2026-10",
  consentAt: CONSENT_AT,
};
const CONTACT = { email: EMAIL, locale: "en", source: "contact" };

async function post(
  body: unknown,
  e = testEnv(),
  headers: Record<string, string> = { authorization: "Bearer test-token" },
) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request("https://api.test/v1/contacts/general", {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    e,
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}

describe("POST /v1/contacts/general", () => {
  it("401s without the bearer", async () => {
    stubFetch();
    expect((await post(WAITLIST, testEnv(), {})).status).toBe(401);
  });

  it("400s a bad body and writes nothing", async () => {
    const calls = stubFetch();
    for (const body of [
      "not json",
      { ...WAITLIST, email: "a/b@example.com" },
      { ...WAITLIST, locale: "EN" },
      { ...WAITLIST, source: "newsletter" },
      { ...WAITLIST, consentAt: undefined }, // a waitlist join carries its proof
      { ...WAITLIST, policyVersion: 1 },
      { ...CONTACT, source: undefined },
    ])
      expect((await post(body)).status).toBe(400);
    expect(calls).toHaveLength(0);
    expect(await consentRows()).toHaveLength(0);
  });

  it("503s without Resend", async () => {
    stubFetch();
    expect(
      (await post(WAITLIST, testEnv({ RESEND_API_KEY: undefined }))).status,
    ).toBe(503);
  });

  it("a waitlist join: one consent row, a new contact opted into General", async () => {
    const calls = stubFetch();
    expect(
      (await post({ ...WAITLIST, email: " Early@Example.com " })).status,
    ).toBe(204);
    const fp = await fingerprintEmail(EMAIL, SALT);
    expect(await consentRows()).toEqual([
      {
        consent_type: "waitlist",
        granted: 1,
        policy_version: "2026-10",
        source: "waitlist",
        idempotency_key: `waitlist:${fp}:${CONSENT_AT}`,
      },
    ]);
    expect(resendCalls(calls)).toEqual([
      {
        url: "/contacts",
        method: "POST",
        body: {
          email: EMAIL,
          properties: { locale: "fr" },
          topics: [{ id: TOPIC, subscription: "opt_in" }],
        },
      },
    ]);
  });

  it("an existing contact keeps its fields and global unsubscribe; only the topic changes", async () => {
    const calls = stubFetch({ exists: true });
    expect((await post(WAITLIST)).status).toBe(204);
    expect(resendCalls(calls).map((c) => `${c.method} ${c.url}`)).toEqual([
      "POST /contacts",
      `PATCH /contacts/${EMAIL}/topics`,
    ]);
  });

  it("a contact message: stored without a topic or a consent row", async () => {
    const calls = stubFetch();
    expect((await post(CONTACT)).status).toBe(204);
    expect(await consentRows()).toHaveLength(0);
    expect(resendCalls(calls)).toEqual([
      {
        url: "/contacts",
        method: "POST",
        body: { email: EMAIL, properties: { locale: "en" } },
      },
    ]);
    // Never reads the topic ids: a contact message never joins a topic.
    expect(calls.some((c) => c.url.includes("sanity.io"))).toBe(false);
  });

  it("an existing contact sending a message is left untouched", async () => {
    const calls = stubFetch({ exists: true });
    expect((await post(CONTACT)).status).toBe(204);
    expect(resendCalls(calls).map((c) => c.method)).toEqual(["POST"]);
  });

  it("a Resend failure answers 502 and keeps the consent row", async () => {
    stubFetch({ resendStatus: 500 });
    const res = await post(WAITLIST);
    expect(res.status).toBe(502);
    expect(await consentRows()).toHaveLength(1);
  });
});
