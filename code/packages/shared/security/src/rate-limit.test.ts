import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The limiter reads `RATE_LIMIT_KV` from the context OpenNext publishes on
// `globalThis[Symbol.for("__cloudflare-context__")]` (worker runtime and
// `initOpenNextCloudflareForDev`). Publish a fake KV there, the same way, so the
// fixed-window + fail-open branches are testable off-Cloudflare.
const CONTEXT = Symbol.for("__cloudflare-context__");
const store = new Map<string, string>();
const kv = {
  get: vi.fn(async (k: string) => store.get(k) ?? null),
  put: vi.fn(async (k: string, v: string) => {
    store.set(k, v);
  }),
};
const global = globalThis as Record<symbol, unknown>;

const { rateLimit } = await import("./rate-limit");

beforeEach(() => {
  global[CONTEXT] = { env: { RATE_LIMIT_KV: kv } };
});

afterEach(() => {
  delete global[CONTEXT];
  store.clear();
  vi.clearAllMocks();
});

describe("rateLimit (KV-backed)", () => {
  it("allows (no-op) when no Cloudflare context is published", async () => {
    delete global[CONTEXT];
    expect(await rateLimit("off-cf", 1, 60)).toEqual({
      ok: true,
      remaining: 1,
    });
    expect(await rateLimit("off-cf", 1, 60)).toEqual({
      ok: true,
      remaining: 1,
    });
    expect(kv.get).not.toHaveBeenCalled();
  });

  it("allows up to the limit, then blocks", async () => {
    expect((await rateLimit("ip:/api", 2, 60)).ok).toBe(true); // 1
    expect((await rateLimit("ip:/api", 2, 60)).ok).toBe(true); // 2
    const third = await rateLimit("ip:/api", 2, 60); // 3 > 2
    expect(third.ok).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("resets after the window expires", async () => {
    await rateLimit("k", 1, 60); // c=1 ok
    expect((await rateLimit("k", 1, 60)).ok).toBe(false); // c=2 blocked
    store.set("rl:k", JSON.stringify({ c: 9, r: Date.now() - 1000 })); // window in the past
    expect((await rateLimit("k", 1, 60)).ok).toBe(true); // reset → c=1
  });

  it("fails OPEN on a KV read error (never blocks a real request)", async () => {
    kv.get.mockRejectedValueOnce(new Error("kv down"));
    expect((await rateLimit("k2", 1, 60)).ok).toBe(true);
  });

  it("fails OPEN on a KV write error", async () => {
    kv.put.mockRejectedValueOnce(new Error("kv down"));
    expect((await rateLimit("k3", 1, 60)).ok).toBe(true);
  });
});
