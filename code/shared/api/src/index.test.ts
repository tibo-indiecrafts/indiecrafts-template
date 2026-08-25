/// <reference types="@cloudflare/vitest-pool-workers" />
import { env, SELF } from "cloudflare:test";
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

  it("401s GET /v1/csp-reports without a bearer token (gated)", async () => {
    const res = await SELF.fetch("https://example.com/v1/csp-reports");
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

describe("/v1/settings", () => {
  const auth = { authorization: "Bearer test-token" };

  it("401s without the bearer", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings");
    expect(res.status).toBe(401);
  });

  it("GET returns every key with its bounds + effective value", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", { headers: auth });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { settings: Array<{ key: string; value: number; min: number }> };
    const audit = body.settings.find((s) => s.key === "retention.audit_days");
    expect(audit?.value).toBe(90); // default, no override yet
  });

  it("PUT stores a valid override and writes an admin_audit row", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      method: "PUT",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({ key: "retention.audit_days", value: 120, actor: "user_admin" }),
    });
    expect(res.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT value FROM site_settings WHERE key = 'retention.audit_days'",
    ).first<{ value: string }>();
    expect(row?.value).toBe("120");
    const audit = await env.DB.prepare(
      "SELECT event, target_user_id FROM admin_audit WHERE event = 'setting_changed'",
    ).first<{ event: string; target_user_id: string }>();
    expect(audit).toEqual({ event: "setting_changed", target_user_id: "retention.audit_days" });
  });

  it("PUT 422s an out-of-range value (below the consent floor) and stores nothing", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      method: "PUT",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({ key: "retention.consent_days", value: 10, actor: "user_admin" }),
    });
    expect(res.status).toBe(422);
    const body = (await res.json()) as { min: number; max: number };
    expect(body.min).toBe(1095);
  });

  it("PUT 422s an unknown key and a non-integer", async () => {
    for (const value of [{ key: "nope", value: 1 }, { key: "retention.audit_days", value: 1.5 }]) {
      const res = await SELF.fetch("https://api.test/v1/settings", {
        method: "PUT",
        headers: { ...auth, "content-type": "application/json" },
        body: JSON.stringify({ ...value, actor: "user_admin" }),
      });
      expect(res.status).toBe(422);
    }
  });
});
