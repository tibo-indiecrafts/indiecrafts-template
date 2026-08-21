/// <reference types="@cloudflare/vitest-pool-workers" />
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

const AGENT = "https://example.com/v1/agent/content-research";
const post = (init: RequestInit) =>
  SELF.fetch(AGENT, { method: "POST", ...init });

// `SELF` runs the real worker (wrangler.toml `main`) in workerd. These cover the guard —
// they fail auth BEFORE `runAgent`, so no Anthropic call. The agent core is unit-tested
// in its brick.
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
      headers: { "content-type": "application/json", authorization: "Bearer nope" },
      body: JSON.stringify({ context: "hi" }),
    });
    expect(res.status).toBe(401);
  });

  it("browser path: a non-allowlisted Origin → 403", async () => {
    const res = await post({
      headers: { "content-type": "application/json", origin: "https://evil.example" },
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
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
  });
});
