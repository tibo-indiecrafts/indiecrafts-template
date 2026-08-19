import { afterEach, describe, expect, it, vi } from "vitest";

// The gate orchestrates origin (real, pure) + rate-limit + turnstile. Mock the two
// external-dependent ones so every branch is drivable; use the real origin check.
const { rateLimit, verifyTurnstile } = vi.hoisted(() => ({
  rateLimit: vi.fn(async () => ({ ok: true, remaining: 5 })),
  verifyTurnstile: vi.fn(async () => true),
}));
vi.mock("./rate-limit", () => ({ rateLimit }));
vi.mock("./turnstile", () => ({ verifyTurnstile }));

const { withGuard } = await import("./guard");

// `Sec-Fetch-Site` etc. are forbidden headers a real Request strips — mock the
// surface the gate touches (headers.get · url · text).
const req = ({
  headers = {} as Record<string, string>,
  url = "https://x.test/api/t",
  body = "",
} = {}) =>
  ({
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
    url,
    text: async () => body,
  }) as unknown as Request;

const ok = () => new Response("ok", { status: 200 });
const sameSite = { "sec-fetch-site": "same-origin" };

afterEach(() => vi.clearAllMocks());

describe("withGuard", () => {
  it("blocks a cross-site POST with 403", async () => {
    const res = await withGuard(ok)(
      req({ headers: { "sec-fetch-site": "cross-site" } }),
    );
    expect(res.status).toBe(403);
  });

  it("413 when Content-Length exceeds bodyMax", async () => {
    const res = await withGuard(ok, { bodyMax: 10 })(
      req({ headers: { ...sameSite, "content-length": "9999" } }),
    );
    expect(res.status).toBe(413);
  });

  it("413 when the actual body exceeds bodyMax (Content-Length absent/lying)", async () => {
    const res = await withGuard(ok, { bodyMax: 5 })(
      req({ headers: sameSite, body: "way too long" }),
    );
    expect(res.status).toBe(413);
  });

  it("429 when the rate limiter is exhausted", async () => {
    rateLimit.mockResolvedValueOnce({ ok: false, remaining: 0 });
    const res = await withGuard(ok, { rateLimit: { limit: 1, windowSec: 60 } })(
      req({ headers: sameSite, body: "{}" }),
    );
    expect(res.status).toBe(429);
  });

  it("400 on an invalid JSON body", async () => {
    const res = await withGuard(ok)(
      req({ headers: sameSite, body: "{not json" }),
    );
    expect(res.status).toBe(400);
  });

  it("403 when Turnstile fails (configured + wrong token)", async () => {
    verifyTurnstile.mockResolvedValueOnce(false);
    const res = await withGuard(ok, { turnstile: true })(
      req({ headers: sameSite, body: '{"cf-turnstile-response":"x"}' }),
    );
    expect(res.status).toBe(403);
  });

  it("passes Turnstile when it verifies (or is unconfigured → true)", async () => {
    const res = await withGuard(ok, { turnstile: true })(
      req({ headers: sameSite, body: "{}" }),
    );
    expect(res.status).toBe(200);
  });

  it("calls the handler with the parsed body on a clean request", async () => {
    const handler = vi.fn(
      async (_req: Request, body: unknown) =>
        new Response(JSON.stringify(body), { status: 201 }),
    );
    const res = await withGuard(handler)(
      req({ headers: sameSite, body: '{"email":"a@b.com"}' }),
    );
    expect(res.status).toBe(201);
    expect(handler).toHaveBeenCalledWith(expect.anything(), {
      email: "a@b.com",
    });
  });
});
