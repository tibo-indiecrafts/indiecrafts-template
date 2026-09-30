/// <reference types="@cloudflare/vitest-pool-workers" />
import { env, SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import { erasureState } from "./monitoring";

const auth = { authorization: "Bearer test-token" };
const NOW = Date.now();
const iso = (days: number) => new Date(NOW + days * 86_400_000).toISOString();
/** An erasure request due `dueDays` from now, its confirmation link valid `tokenDays` from now. */
const seed = (status: string, dueDays: number, tokenDays = 30) =>
  env.MAIN_DB.prepare(
    "INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at) VALUES (?, 'h', ?, 'user_secret', 'fp_secret', ?, ?)",
  )
    .bind(status, iso(tokenDays), iso(dueDays - 30), iso(dueDays))
    .run();

describe("erasureState", () => {
  const now = iso(0);
  const soon = iso(7);
  it.each([
    ["completed", iso(-1), "closed"],
    ["confirmed", iso(-1), "breached"],
    ["confirmed", iso(3), "dueSoon"],
    ["confirmed", iso(20), "onTrack"],
  ])("%s due %s → %s", (status, due, state) => {
    expect(erasureState(status, due, iso(30), now, soon)).toBe(state);
  });
  it("a lapsed unverified request is closed", () => {
    expect(erasureState("email_sent", iso(20), iso(-1), now, soon)).toBe(
      "closed",
    );
  });
  it("an unverified request with a live link is open", () => {
    expect(erasureState("email_sent", iso(20), iso(1), now, soon)).toBe(
      "onTrack",
    );
  });
});

describe("GET /v1/erasure-requests", () => {
  beforeEach(async () => {
    await seed("confirmed", 20);
    await seed("confirmed", -1);
    await seed("confirmed", 3);
    await seed("completed", -5);
    await seed("email_sent", 25, -1); // lapsed: never confirmed, link expired
  });

  it("401s without the bearer", async () => {
    expect(
      (await SELF.fetch("https://api.test/v1/erasure-requests")).status,
    ).toBe(401);
  });

  it("lists open requests by deadline, with state, and no identifiers", async () => {
    const res = await SELF.fetch("https://api.test/v1/erasure-requests", {
      headers: auth,
    });
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(text).not.toMatch(/user_secret|fp_secret|email_fingerprint|user_id/);
    const body = JSON.parse(text) as {
      open: { state: string }[];
      recentClosed: { state: string }[];
    };
    expect(body.open.map((r) => r.state)).toEqual([
      "breached",
      "dueSoon",
      "onTrack",
    ]);
    expect(body.recentClosed.map((r) => r.state)).toEqual(["closed", "closed"]);
  });
});

describe("GET /v1/cron/status", () => {
  it("401s without the bearer", async () => {
    expect((await SELF.fetch("https://api.test/v1/cron/status")).status).toBe(
      401,
    );
  });

  it("is stale with no runs, and counts open erasure + exports live", async () => {
    await seed("confirmed", -1);
    await seed("confirmed", 3);
    await env.MAIN_DB.prepare(
      "INSERT INTO export_requests (token_hash, r2_key, email_fingerprint, created_at, expires_at) VALUES ('t','k','fp',?,?)",
    )
      .bind(iso(-1), iso(-0.5))
      .run();
    const res = await SELF.fetch("https://api.test/v1/cron/status", {
      headers: auth,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      stale: true,
      lastRunAt: null,
      erasure: { open: 2, dueSoon: 1, breached: 1 },
      exports: { outstanding: 0, expiredUnswept: 1 },
    });
  });

  it("is fresh right after a run, and returns it with its passes parsed", async () => {
    const at = new Date(NOW - 10 * 60_000).toISOString();
    await env.AUDIT_DB.prepare(
      "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES (?, ?, 'ok', ?)",
    )
      .bind(
        at,
        at,
        JSON.stringify([
          { name: "audit_purge", status: "ok", counts: { admin_audit: 2 } },
        ]),
      )
      .run();
    const body = (await (
      await SELF.fetch("https://api.test/v1/cron/status", { headers: auth })
    ).json()) as {
      stale: boolean;
      lastRunAt: string;
      runs: { passes: { counts: Record<string, number> }[] }[];
    };
    expect(body.stale).toBe(false);
    expect(body.lastRunAt).toBe(at);
    expect(body.runs[0].passes[0].counts.admin_audit).toBe(2);
  });

  it("is stale when the newest run is over 2 hours old", async () => {
    const at = new Date(NOW - 3 * 3_600_000).toISOString();
    await env.AUDIT_DB.prepare(
      "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES (?, ?, 'ok', '[]')",
    )
      .bind(at, at)
      .run();
    const body = (await (
      await SELF.fetch("https://api.test/v1/cron/status", { headers: auth })
    ).json()) as { stale: boolean };
    expect(body.stale).toBe(true);
  });
});
