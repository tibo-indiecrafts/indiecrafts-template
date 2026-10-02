import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "./index";

// Card 30 — app-level security incidents: write, minimize, escalate, alert, list.
const SALT = "test-ip-salt";
const SECRET = "whsec_dGVzdHNlY3JldA=="; // base64("testsecret")
const IP = "203.0.113.7";

afterEach(() => vi.unstubAllGlobals());

async function call(req: Request, overrides: Partial<Env> = {}) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    req,
    { ...env, IP_HASH_SALT: SALT, ...overrides },
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}

const postSecurity = (
  body: Record<string, unknown>,
  overrides?: Partial<Env>,
) =>
  call(
    new Request("https://example.com/v1/events", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "content-type": "application/json",
        "cf-connecting-ip": IP,
        "cf-ipcountry": "FR",
      },
      body: JSON.stringify({ kind: "security", ...body }),
    }),
    overrides,
  );

const rows = async () =>
  (
    await env.AUDIT_DB.prepare(
      "SELECT * FROM security_events ORDER BY ts, id",
    ).all<Record<string, unknown>>()
  ).results;

describe("POST /v1/events kind:security", () => {
  it("rejects an event type or severity outside the taxonomy (400)", async () => {
    expect(
      (await postSecurity({ eventType: "made_up", severity: "high" })).status,
    ).toBe(400);
    expect(
      (
        await postSecurity({
          eventType: "data_exfiltration",
          severity: "urgent",
        })
      ).status,
    ).toBe(400);
    expect(await rows()).toHaveLength(0);
  });

  it("stores a minimized row: country + salted IP hash, never the raw IP", async () => {
    const res = await postSecurity({
      eventType: "data_exfiltration",
      severity: "medium",
      surface: "app",
      userId: "user_1",
      description: "x".repeat(300),
    });
    expect(res.status).toBe(201);
    const [row] = await rows();
    expect(row).toMatchObject({
      event_type: "data_exfiltration",
      severity: "medium",
      surface: "app",
      user_id: "user_1",
      country: "FR",
    });
    expect(row!.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain(IP);
    expect((row!.description as string).length).toBe(200);
  });

  it("counts failed logins in KV and stores ONE credential_stuffing row at the threshold", async () => {
    const fail = () =>
      postSecurity({
        eventType: "failed_login",
        severity: "low",
        userId: "user_2",
      });
    for (let i = 1; i <= 4; i++) {
      const res = await fail();
      expect(res.status).toBe(202);
      expect(await res.json()).toMatchObject({ counted: i });
    }
    expect(await rows()).toHaveLength(0);
    const fifth = await fail();
    expect(fifth.status).toBe(201);
    const stored = await rows();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      event_type: "credential_stuffing",
      severity: "high",
      user_id: "user_2",
    });
  });

  it("emails the alert recipient for a high incident, not for a low one", async () => {
    const sent: string[] = [];
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      if (String(url).includes("api.resend.com"))
        sent.push(
          (JSON.parse(String(init?.body)) as { subject: string }).subject,
        );
      return new Response("{}", { status: 200 });
    });
    const mail = {
      RESEND_API_KEY: "re_test",
      EMAIL_FROM: "alerts@example.com",
      SECURITY_ALERT_EMAIL: "owner@example.com",
    } as Partial<Env>;
    await postSecurity(
      { eventType: "suspicious_pattern", severity: "low" },
      mail,
    );
    expect(sent).toHaveLength(0);
    await postSecurity(
      { eventType: "data_exfiltration", severity: "high", surface: "app" },
      mail,
    );
    expect(sent).toEqual(["[Security] high — data_exfiltration (app)"]);
  });
});

describe("GET /v1/security", () => {
  it("lists incidents newest-first without the IP hash", async () => {
    for (const ts of [
      "2026-01-01T00:00:00Z",
      "2026-03-01T00:00:00Z",
      "2026-02-01T00:00:00Z",
    ])
      await env.AUDIT_DB.prepare(
        "INSERT INTO security_events (ts, event_type, severity, ip_hash) VALUES (?, 'suspicious_pattern', 'low', 'h')",
      )
        .bind(ts)
        .run();
    const res = await call(
      new Request("https://example.com/v1/security", {
        headers: { authorization: "Bearer test-token" },
      }),
    );
    expect(res.status).toBe(200);
    const { data } = (await res.json()) as { data: Record<string, unknown>[] };
    expect(data.map((r) => r.ts)).toEqual([
      "2026-03-01T00:00:00Z",
      "2026-02-01T00:00:00Z",
      "2026-01-01T00:00:00Z",
    ]);
    expect(data[0]).not.toHaveProperty("ip_hash");
  });
});

// Sign a body the way verifySvix() checks it.
async function svixHeaders(id: string, ts: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(SECRET.replace(/^whsec_/, "")), (c) =>
      c.charCodeAt(0),
    ),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${ts}.${body}`),
  );
  return {
    "svix-id": id,
    "svix-timestamp": ts,
    "svix-signature": `v1,${btoa(String.fromCharCode(...new Uint8Array(mac)))}`,
    "content-type": "application/json",
  };
}

async function userUpdated(role?: string, firstName = "Ada") {
  const body = JSON.stringify({
    type: "user.updated",
    data: {
      id: "user_adm",
      first_name: firstName,
      public_metadata: role ? { role } : {},
      email_addresses: [],
    },
  });
  return call(
    new Request("https://example.com/v1/clerk-webhook", {
      method: "POST",
      body,
      headers: await svixHeaders(
        `msg_${crypto.randomUUID()}`,
        String(Math.floor(Date.now() / 1000)),
        body,
      ),
    }),
    { CLERK_WEBHOOK_SECRET: SECRET },
  );
}

describe("Clerk webhook → privilege_escalation", () => {
  it("records a grant once, not on every later update of an admin", async () => {
    await userUpdated(undefined);
    expect((await userUpdated("admin")).status).toBe(200);
    expect((await userUpdated("admin", "Ada L.")).status).toBe(200);
    const stored = await rows();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      event_type: "privilege_escalation",
      severity: "high",
      user_id: "user_adm",
    });
  });

  it("records a new grant after the role was removed", async () => {
    await userUpdated("admin");
    await userUpdated(undefined);
    await userUpdated("admin");
    expect(await rows()).toHaveLength(2);
  });
});
