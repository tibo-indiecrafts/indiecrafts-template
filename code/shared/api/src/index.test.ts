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

  it("rejects /v1/announcements with an unknown surface (400)", async () => {
    const res = await SELF.fetch(
      "https://example.com/v1/announcements?surface=bogus&locale=en",
    );
    expect(res.status).toBe(400);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("503s /v1/announcements until Sanity vars are bound", async () => {
    // The test env has no SANITY_PROJECT_ID/DATASET → the route reports unavailable.
    const res = await SELF.fetch(
      "https://example.com/v1/announcements?surface=app&locale=en",
    );
    expect(res.status).toBe(503);
  });

  it("401s GET /v1/security without a bearer token (gated)", async () => {
    const res = await SELF.fetch("https://example.com/v1/security");
    expect(res.status).toBe(401);
  });

  it("fails closed on /v1/clerk-webhook when no secret is configured (503)", async () => {
    // The test env has no CLERK_WEBHOOK_SECRET → the webhook must refuse, not accept.
    const res = await SELF.fetch("https://example.com/v1/clerk-webhook", {
      method: "POST",
      body: "{}",
    });
    expect(res.status).toBe(503);
  });
});
