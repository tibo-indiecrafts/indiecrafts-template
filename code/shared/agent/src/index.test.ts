/// <reference types="@cloudflare/vitest-pool-workers" />
import {
  createExecutionContext,
  env,
  fetchMock,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import worker, { type Env } from "./index";

const AGENT = "https://example.com/v1/agent/content-research";
const post = (init: RequestInit) =>
  SELF.fetch(AGENT, { method: "POST", ...init });

const ANTHROPIC_ORIGIN = "https://api.anthropic.com";
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

/** Register one successful Anthropic `tool_use` reply — consumed by the next outbound call. */
function mockAnthropic(input: unknown = {}) {
  fetchMock
    .get(ANTHROPIC_ORIGIN)
    .intercept({ method: "POST", path: "/v1/messages" })
    .reply(200, { content: [{ type: "tool_use", name: "output", input }] });
}

/** Register one Turnstile siteverify reply — consumed by the next outbound call. */
function mockTurnstile(success: boolean) {
  fetchMock
    .get(TURNSTILE_ORIGIN)
    .intercept({ method: "POST", path: "/turnstile/v0/siteverify" })
    .reply(200, { success });
}

beforeAll(() => {
  fetchMock.activate();
  fetchMock.disableNetConnect(); // any unmocked outbound call throws — no real network in tests
});
// Every mocked interceptor must be consumed — a leftover means a test's flow didn't reach
// the outbound call it expected to.
afterEach(() => fetchMock.assertNoPendingInterceptors());

// `SELF` runs the real worker (wrangler.toml `main`, `env.dev` — see vitest.config.ts) in
// workerd. These cover the guard — they fail auth BEFORE `runAgent`, so no Anthropic call.
// The agent core is unit-tested in its brick.
describe("agent worker (workerd)", () => {
  it("serves /health as 200 JSON", async () => {
    const res = await SELF.fetch("https://example.com/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("404s an unknown path", async () => {
    const res = await SELF.fetch("https://example.com/nope");
    expect(res.status).toBe(404);
  });

  it("native path: no Origin + no bearer → 401", async () => {
    const res = await post({
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ context: "hi" }),
    });
    expect(res.status).toBe(401);
  });

  it("native path: a bad bearer → 401", async () => {
    const res = await post({
      headers: {
        "content-type": "application/json",
        authorization: "Bearer nope",
      },
      body: JSON.stringify({ context: "hi" }),
    });
    expect(res.status).toBe(401);
  });

  it("browser path: a non-allowlisted Origin → 403", async () => {
    const res = await post({
      headers: {
        "content-type": "application/json",
        origin: "https://evil.example",
      },
      body: JSON.stringify({ context: "hi" }),
    });
    expect(res.status).toBe(403);
  });

  it("browser path: an allowlisted Origin gets a CORS preflight (204 + ACAO)", async () => {
    const res = await SELF.fetch(AGENT, {
      method: "OPTIONS",
      headers: { origin: "http://localhost:3000" },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
  });
});

describe("agent worker — Anthropic success path", () => {
  it("valid native bearer + a mocked Anthropic tool_use reply → 200 { data }", async () => {
    mockAnthropic({ ideas: [{ topic: "x" }] });
    const res = await post({
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-token",
        "cf-connecting-ip": "test-success",
      },
      body: JSON.stringify({ context: "designers / AI" }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: { ideas: [{ topic: "x" }] } });
  });
});

describe("agent worker — rate limit", () => {
  it("429s the 21st request from one client (AGENT_RATELIMIT simple = { limit: 20, period: 60 })", async () => {
    const headers = {
      "content-type": "application/json",
      authorization: "Bearer test-token",
      "cf-connecting-ip": "test-rate-limit", // a key isolated from every other test below
    };
    for (let i = 0; i < 20; i++) mockAnthropic();

    let last: Response | undefined;
    for (let i = 0; i < 21; i++) {
      last = await post({ headers, body: JSON.stringify({ context: "hi" }) });
      if (i < 20) expect(last.status).toBe(200);
    }
    expect(last?.status).toBe(429);
  });
});

describe("agent worker — body cap (413)", () => {
  it("a lying content-length header alone trips the fast pre-read check", async () => {
    const res = await post({
      headers: { "content-type": "application/json", "content-length": "5000" },
      body: JSON.stringify({ context: "hi" }), // the actual body is small — the header lies
    });
    expect(res.status).toBe(413);
  });

  it("an over-cap actual body (no lying header) trips the post-read check", async () => {
    const res = await post({
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ context: "x".repeat(4100) }),
    });
    expect(res.status).toBe(413);
  });
});

describe("agent worker — Turnstile fails closed", () => {
  const origin = "http://localhost:3000";

  it("a missing token → 401 (no siteverify call — short-circuits first)", async () => {
    const res = await post({
      headers: {
        "content-type": "application/json",
        origin,
        "cf-connecting-ip": "test-turnstile-missing",
      },
      body: JSON.stringify({ context: "hi" }),
    });
    expect(res.status).toBe(401);
  });

  it("siteverify replying { success: false } → 401", async () => {
    mockTurnstile(false);
    const res = await post({
      headers: {
        "content-type": "application/json",
        origin,
        "cf-connecting-ip": "test-turnstile-false",
      },
      body: JSON.stringify({
        context: "hi",
        "cf-turnstile-response": "sometoken",
      }),
    });
    expect(res.status).toBe(401);
  });

  it("siteverify throwing/network-failing → 401 (the catch { return false } path)", async () => {
    fetchMock
      .get(TURNSTILE_ORIGIN)
      .intercept({ method: "POST", path: "/turnstile/v0/siteverify" })
      .replyWithError(new Error("network down"));
    const res = await post({
      headers: {
        "content-type": "application/json",
        origin,
        "cf-connecting-ip": "test-turnstile-throw",
      },
      body: JSON.stringify({
        context: "hi",
        "cf-turnstile-response": "sometoken",
      }),
    });
    expect(res.status).toBe(401);
  });
});

describe("agent worker — cheap one-liners", () => {
  it("an unknown agent name → 404", async () => {
    const res = await SELF.fetch(
      "https://example.com/v1/agent/does-not-exist",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer test-token",
          "cf-connecting-ip": "test-unknown-agent",
        },
        body: JSON.stringify({ context: "hi" }),
      },
    );
    expect(res.status).toBe(404);
  });

  it("a missing ANTHROPIC_API_KEY → 503", async () => {
    // The test env's ANTHROPIC_API_KEY is wired statically (vitest.config.ts), so this one
    // case calls the handler directly (bypassing `SELF`'s separate isolate) with it removed.
    const ctx = createExecutionContext();
    const req = new Request(AGENT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-token",
        "cf-connecting-ip": "test-missing-key",
      },
      body: JSON.stringify({ context: "hi" }),
    });
    const res = await worker.fetch(
      req,
      { ...(env as unknown as Env), ANTHROPIC_API_KEY: undefined },
      ctx,
    );
    await waitOnExecutionContext(ctx);
    expect(res.status).toBe(503);
  });
});

describe("agent worker — locale clamp (prompt-injection guard)", () => {
  it('a garbage/injection locale still succeeds, clamped to "en" before reaching Anthropic', async () => {
    let sentSystem = "";
    fetchMock
      .get(ANTHROPIC_ORIGIN)
      .intercept({ method: "POST", path: "/v1/messages" })
      .reply((opts) => {
        sentSystem = (JSON.parse(String(opts.body)) as { system: string })
          .system;
        return {
          statusCode: 200,
          data: JSON.stringify({
            content: [{ type: "tool_use", name: "output", input: {} }],
          }),
        };
      });

    const res = await post({
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-token",
        "cf-connecting-ip": "test-locale-clamp",
      },
      body: JSON.stringify({
        context: "hi",
        locale: "'; DROP TABLE users; --",
      }),
    });
    expect(res.status).toBe(200);
    expect(sentSystem).toContain('"en"');
  });
});
