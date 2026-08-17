/// <reference types="@cloudflare/vitest-pool-workers" />
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

// Integration-style: `SELF` runs the actual worker (wrangler.toml `main`) in workerd,
// so this exercises the real runtime + (once bound) real KV/D1. AAA · one Act · assert
// the public interface. Heavy job logic lives in a brick — unit-test it there too.
describe("api worker (workerd)", () => {
  it("serves /health as 200 JSON", async () => {
    const res = await SELF.fetch("https://example.com/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("404s an unknown path", async () => {
    const res = await SELF.fetch("https://example.com/nope");
    expect(res.status).toBe(404);
  });
});
