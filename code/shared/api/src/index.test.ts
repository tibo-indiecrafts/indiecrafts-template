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

  it("401s GET /v1/churn without a bearer token (gated)", async () => {
    const res = await SELF.fetch("https://example.com/v1/churn");
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

describe("/v1 auth contract — bearer-gated mutating routes reject anon", () => {
  it.each([
    ["POST", "/v1/events"],
    ["PUT", "/v1/settings"],
    ["POST", "/v1/data-request"],
    ["POST", "/v1/export"],
    ["GET", "/v1/sessions"],
    ["GET", "/v1/security"],
    ["GET", "/v1/csp-reports"],
    ["GET", "/v1/churn"],
  ])("%s %s → 401 without a bearer", async (method, path) => {
    const res = await SELF.fetch(`https://api.test${path}`, {
      method,
      ...(method === "POST" || method === "PUT"
        ? { headers: { "content-type": "application/json" }, body: "{}" }
        : {}),
    });
    // Bearer-gated routes 401 anon. A route that binding-preflights (e.g. 503) is
    // acceptable ONLY if documented; /v1/events must 401 (it has no such preflight).
    expect([401, 503]).toContain(res.status);
    if (path === "/v1/events") expect(res.status).toBe(401);
  });
});

describe("/v1/events — trusted server token only", () => {
  const post = (token: string, body: Record<string, unknown>) =>
    SELF.fetch("https://api.test/v1/events", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  const session = { kind: "session", surface: "app", userId: "u1" };

  it("accepts the trusted APP_API_TOKEN", async () => {
    const res = await post(env.APP_API_TOKEN!, session);
    expect(res.status).toBe(201);
  });

  it("rejects the retired ingest token with 401 (not 403)", async () => {
    const res = await post("test-events-token", session);
    expect(res.status).toBe(401);
  });

  it("rejects a missing bearer with 401", async () => {
    const res = await SELF.fetch("https://api.test/v1/events", {
      method: "POST",
      body: "{}",
    });
    expect(res.status).toBe(401);
  });
});

describe("GET /v1/geo — removed", () => {
  it("is no longer routed", async () => {
    const res = await SELF.fetch("https://api.test/v1/geo");
    expect(res.status).toBe(404);
  });
});

describe("/v1/settings", () => {
  const auth = { authorization: "Bearer test-token" };

  it("401s without the bearer", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings");
    expect(res.status).toBe(401);
  });

  it("GET returns every key with its bounds + effective value", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      headers: auth,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      settings: Array<{ key: string; value: number; min: number }>;
    };
    const audit = body.settings.find((s) => s.key === "retention.audit_days");
    expect(audit?.value).toBe(90); // default, no override yet
  });

  it("PUT stores a valid override and writes an admin_audit row", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      method: "PUT",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({
        key: "retention.audit_days",
        value: 120,
        actor: "user_admin",
      }),
    });
    expect(res.status).toBe(200);
    const row = await env.AUDIT_DB.prepare(
      "SELECT value FROM site_settings WHERE key = 'retention.audit_days'",
    ).first<{ value: string }>();
    expect(row?.value).toBe("120");
    const audit = await env.AUDIT_DB.prepare(
      "SELECT event, target_user_id FROM admin_audit WHERE event = 'setting_changed'",
    ).first<{ event: string; target_user_id: string }>();
    expect(audit).toEqual({
      event: "setting_changed",
      target_user_id: "retention.audit_days",
    });
  });

  it("PUT 422s an out-of-range value (below the consent floor) and stores nothing", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      method: "PUT",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({
        key: "retention.consent_days",
        value: 10,
        actor: "user_admin",
      }),
    });
    expect(res.status).toBe(422);
    const body = (await res.json()) as { min: number; max: number };
    expect(body.min).toBe(1095);
  });

  it("PUT 422s an unknown key and a non-integer", async () => {
    for (const value of [
      { key: "nope", value: 1 },
      { key: "retention.audit_days", value: 1.5 },
    ]) {
      const res = await SELF.fetch("https://api.test/v1/settings", {
        method: "PUT",
        headers: { ...auth, "content-type": "application/json" },
        body: JSON.stringify({ ...value, actor: "user_admin" }),
      });
      expect(res.status).toBe(422);
    }
  });
});

describe("/v1/backups/status", () => {
  const auth = { authorization: "Bearer test-token" };
  it("401s without the bearer", async () => {
    expect(
      (await SELF.fetch("https://api.test/v1/backups/status")).status,
    ).toBe(401);
  });
  it("returns recent runs newest-first", async () => {
    await env.AUDIT_DB.prepare(
      "INSERT INTO backup_runs (db_name,env,kind,status,started_at,finished_at) VALUES ('audit','prod','manual','ok','2026-08-24T00:00:00Z','2026-08-24T00:00:03Z')",
    ).run();
    const res = await SELF.fetch("https://api.test/v1/backups/status", {
      headers: auth,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      runs: Array<{ dbName: string; status: string }>;
    };
    expect(body.runs[0]).toMatchObject({ dbName: "audit", status: "ok" });
  });
});

describe("/v1/churn", () => {
  const auth = { authorization: "Bearer test-token" };

  it("401s without the bearer", async () => {
    const res = await SELF.fetch("https://api.test/v1/churn");
    expect(res.status).toBe(401);
  });

  it("GET returns the aggregate shape", async () => {
    const res = await SELF.fetch("https://api.test/v1/churn", {
      headers: auth,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      total: number;
      byDay: Array<{ date: string; count: number }>;
      byReason: Array<{ reason: string; count: number }>;
      recentFeedback: Array<{
        deleted_at: string;
        reason: string | null;
        feedback: string | null;
        competitor: string | null;
      }>;
    };
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("byDay");
    expect(body).toHaveProperty("byReason");
    expect(body).toHaveProperty("recentFeedback");
    expect(Array.isArray(body.byDay)).toBe(true);
    expect(Array.isArray(body.byReason)).toBe(true);
    expect(Array.isArray(body.recentFeedback)).toBe(true);
  });
});

describe("GET /v1/announcements — surface validation", () => {
  it("rejects the removed mobile surface with 400", async () => {
    const res = await SELF.fetch(
      "https://api.test/v1/announcements?surface=mobile&locale=en",
    );
    expect(res.status).toBe(400);
  });
});
