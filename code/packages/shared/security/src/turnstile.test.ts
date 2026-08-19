import { afterEach, describe, expect, it, vi } from "vitest";

const { verifyTurnstile } = await import("./turnstile");

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  it("no-ops (passes) when TURNSTILE_SECRET is unset", async () => {
    expect(await verifyTurnstile("anything")).toBe(true);
  });

  it("fails an empty token once configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "s");
    expect(await verifyTurnstile("")).toBe(false);
  });

  it("returns true on a successful siteverify", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "s");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }))),
    );
    expect(await verifyTurnstile("tok")).toBe(true);
  });

  it("returns false when siteverify rejects the token", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "s");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: false }))),
    );
    expect(await verifyTurnstile("tok")).toBe(false);
  });

  it("fails CLOSED when siteverify is unreachable (configured)", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "s");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    expect(await verifyTurnstile("tok")).toBe(false);
  });
});
