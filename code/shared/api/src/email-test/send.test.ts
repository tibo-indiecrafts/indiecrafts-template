import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../index";
import { sendTestEmails, withoutCopies } from "./send";

afterEach(() => vi.unstubAllGlobals());

const TO = "editor@example.com";

/** Sanity answers with every copy setting on; Resend answers `resendStatus`. Records sends. */
function stubFetch(opts: { resendStatus?: (n: number) => number } = {}) {
  const sent: { to: string; subject: string; bcc?: string[] }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = String(input);
      if (url.includes("sanity.io"))
        return Response.json({
          result: {
            supportEmail: "help@example.com",
            bccAll: "qa@example.com",
            dataRequestReceipt: { copySupport: true },
            dataRequestClosed: { enabled: false },
            passwordChanged: { copySupport: true },
            welcome: { copySupport: true },
            clerk: {
              passwordChanged: { copySupport: true },
              welcome: { copySupport: true },
            },
          },
        });
      if (url === "https://api.resend.com/emails") {
        const body = JSON.parse(String(init.body)) as (typeof sent)[number];
        sent.push(body);
        return new Response("{}", {
          status: opts.resendStatus?.(sent.length) ?? 200,
        });
      }
      return new Response("{}", { status: 404 });
    }),
  );
  return sent;
}

const testEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    ...env,
    RESEND_API_KEY: "re_test",
    EMAIL_FROM: "no-reply@example.com",
    EMAIL_BCC_ALL_ENABLED: "true", // even with the QA gate open, a test never copies
    SANITY_PROJECT_ID: "proj",
    SANITY_DATASET: "production",
    ...overrides,
  }) as Env;

async function post(
  body: unknown,
  e = testEnv(),
  headers: Record<string, string> = { authorization: "Bearer test-token" },
) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request("https://api.test/v1/emails/test", {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    e,
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}

describe("POST /v1/emails/test", () => {
  it("401s without the bearer and sends nothing", async () => {
    const sent = stubFetch();
    expect(
      (await post({ to: TO, scope: "service", locales: ["en"] }, testEnv(), {}))
        .status,
    ).toBe(401);
    expect(sent).toHaveLength(0);
  });

  it("400s a bad address, scope or locale list", async () => {
    const sent = stubFetch();
    for (const body of [
      { to: "nope", scope: "service", locales: ["en"] },
      { to: TO, scope: "site", locales: ["en"] },
      { to: TO, scope: "service", locales: [] },
      { to: TO, scope: "service", locales: ["xx"] },
    ])
      expect((await post(body)).status).toBe(400);
    expect(sent).toHaveLength(0);
  });

  it("503s without a mailer", async () => {
    stubFetch();
    expect(
      (
        await post(
          { to: TO, scope: "service", locales: ["en"] },
          testEnv({ EMAIL_FROM: undefined }),
        )
      ).status,
    ).toBe(503);
  });

  it("service: the erasure and data-request samples, to the address only, a switched-off one left out", async () => {
    const sent = stubFetch();
    const res = await post({ to: TO, scope: "service", locales: ["fr"] });
    expect(res.status).toBe(200);
    expect(((await res.json()) as { results: unknown }).results).toEqual([
      { label: "erasureToken · fr", ok: true },
      { label: "erasureComplete · fr", ok: true },
      { label: "dataRequestReceipt · fr", ok: true },
    ]);
    expect(sent.map((m) => m.to)).toEqual([TO, TO, TO]);
    expect(sent.every((m) => !m.bcc)).toBe(true); // no support copy, no QA copy
  });
});

describe("sendTestEmails", () => {
  const noWait = async () => {};

  it("account: every Clerk template + welcome, per locale, never copied", async () => {
    const sent = stubFetch();
    const results = await sendTestEmails(
      testEnv(),
      { to: TO, scope: "account", locales: ["en", "fr"] },
      noWait,
    );
    expect(results).toHaveLength(26); // 12 Clerk templates + welcome, × 2
    expect(results.every((r) => r.ok)).toBe(true);
    expect(results.map((r) => r.label)).toContain("welcome · fr");
    expect(sent.every((m) => m.to === TO && !m.bcc)).toBe(true);
  });

  it("reports a failed send and still sends the rest — welcome included", async () => {
    stubFetch({ resendStatus: (n) => (n === 1 || n === 13 ? 500 : 200) });
    const results = await sendTestEmails(
      testEnv(),
      { to: TO, scope: "account", locales: ["en"] },
      noWait,
    );
    expect(results.filter((r) => !r.ok).map((r) => r.label)).toEqual([
      "verification_code · en",
      "welcome · en",
    ]);
    expect(results).toHaveLength(13);
  });

  it("withoutCopies turns every copy setting off", () => {
    expect(
      withoutCopies({
        bccAll: "qa@x.com",
        supportEmail: "help@x.com",
        welcome: { copySupport: true, subject: "Hi" },
      }),
    ).toEqual({
      bccAll: undefined,
      supportEmail: "help@x.com",
      welcome: { copySupport: false, subject: "Hi" },
    });
  });
});
