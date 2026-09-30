import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

type Health = Record<string, unknown>;

describe("/health", () => {
  it("stays minimal without the bearer (public uptime probe)", async () => {
    const res = await SELF.fetch("https://api.test/health");
    expect(await res.json()).toEqual({ ok: true });
  });

  it("reports both D1s, the build and the bindings with the bearer", async () => {
    const res = await SELF.fetch("https://api.test/health", {
      headers: { authorization: "Bearer test-token" },
    });
    const body = (await res.json()) as Health;
    expect(body).toMatchObject({
      ok: true,
      version: "dev",
      commit: "dev",
      db: { audit: "ok", main: "ok" },
      bindings: {
        kv: expect.stringMatching(/^(un)?bound$/),
        exportBucket: "bound",
        cron: expect.stringMatching(/^(un)?bound$/),
        rateLimit: expect.stringMatching(/^(un)?bound$/),
      },
    });
  });
});
