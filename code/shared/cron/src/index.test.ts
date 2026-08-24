/// <reference types="@cloudflare/vitest-pool-workers" />
import {
  applyD1Migrations,
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import worker, { type Env, slaDueSoonCutoff, slaSeverity } from "./index";

// Apply the api's db/d1/migrations/*.sql (see vitest.config.ts) before any test runs —
// the cron shares the api's D1, so tests exercise the real schema.
beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

// `SELF` runs the actual worker in workerd; `scheduled` is invoked directly with the
// real `env` + an execution context. The job logic lives in a brick — unit-test it there.
describe("cron worker (workerd)", () => {
  it("serves a health fetch", async () => {
    const res = await SELF.fetch("https://example.com/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("runs a scheduled tick without throwing", async () => {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 6 * * *",
      scheduledTime: 0,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, env, ctx);
    await waitOnExecutionContext(ctx);
  });
});

describe("scheduled() — retention purge (data_requests + erasure_requests)", () => {
  const NOW = Date.UTC(2026, 0, 15); // 2026-01-15T00:00:00Z
  const oldDataRequestAt = new Date(NOW - 400 * 86_400_000).toISOString(); // > 365d
  const recentDataRequestAt = new Date(NOW - 10 * 86_400_000).toISOString();
  const oldErasureRequestAt = new Date(NOW - 1100 * 86_400_000).toISOString(); // > 1095d
  const recentErasureRequestAt = new Date(NOW - 10 * 86_400_000).toISOString();

  async function runTick(): Promise<void> {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 * * * *",
      scheduledTime: NOW,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, env, ctx);
    await waitOnExecutionContext(ctx);
  }

  it("purges a data_requests row past the 365-day retention; keeps a recent one", async () => {
    await env.DB.prepare(
      "INSERT INTO data_requests (request_type, email, status, submitted_at) VALUES ('access', 'old-dsar@example.com', 'new', ?)",
    )
      .bind(oldDataRequestAt)
      .run();
    await env.DB.prepare(
      "INSERT INTO data_requests (request_type, email, status, submitted_at) VALUES ('access', 'recent-dsar@example.com', 'new', ?)",
    )
      .bind(recentDataRequestAt)
      .run();

    await runTick();

    expect(
      await env.DB.prepare(
        "SELECT id FROM data_requests WHERE email = 'old-dsar@example.com'",
      ).first(),
    ).toBeNull();
    expect(
      await env.DB.prepare(
        "SELECT id FROM data_requests WHERE email = 'recent-dsar@example.com'",
      ).first(),
    ).not.toBeNull();
  });

  it("purges an erasure_requests row past the 1095-day retention; keeps a recent one", async () => {
    await env.DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, email_fingerprint, requested_at, due_at) VALUES ('completed', 'hash-old-purge', ?, 'fp-old-purge@example.com', ?, ?)",
    )
      .bind(oldErasureRequestAt, oldErasureRequestAt, oldErasureRequestAt)
      .run();
    await env.DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, email_fingerprint, requested_at, due_at) VALUES ('completed', 'hash-recent-purge', ?, 'fp-recent-purge@example.com', ?, ?)",
    )
      .bind(
        recentErasureRequestAt,
        recentErasureRequestAt,
        recentErasureRequestAt,
      )
      .run();

    await runTick();

    expect(
      await env.DB.prepare(
        "SELECT id FROM erasure_requests WHERE email_fingerprint = 'fp-old-purge@example.com'",
      ).first(),
    ).toBeNull();
    expect(
      await env.DB.prepare(
        "SELECT id FROM erasure_requests WHERE email_fingerprint = 'fp-recent-purge@example.com'",
      ).first(),
    ).not.toBeNull();
  });
});

describe("scheduled() — erasure SLA flag + expired export cleanup", () => {
  const NOW = Date.UTC(2026, 0, 15); // 2026-01-15T00:00:00Z
  const nowIso = new Date(NOW).toISOString();
  const dueSoonAt = new Date(NOW + 3 * 86_400_000).toISOString(); // 3 days out — within the 7-day window
  const breachedAt = new Date(NOW - 86_400_000).toISOString(); // 1 day ago — already past due
  const alreadyFlaggedAt = new Date(NOW - 2 * 86_400_000).toISOString();

  async function seedErasureRequest(
    userId: string,
    status: string,
    dueAt: string,
    dueFlaggedAt: string | null = null,
  ): Promise<void> {
    await env.DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at, due_flagged_at) VALUES (?, 'hash', ?, ?, 'fp@example.com', ?, ?, ?)",
    )
      .bind(status, dueAt, userId, dueAt, dueAt, dueFlaggedAt)
      .run();
  }

  async function securityEventsFor(userId: string) {
    const { results } = await env.DB.prepare(
      "SELECT event_type, severity FROM security_events WHERE user_id = ?",
    )
      .bind(userId)
      .all<{ event_type: string; severity: string }>();
    return results;
  }

  async function dueFlaggedAtFor(userId: string): Promise<string | null> {
    const row = await env.DB.prepare(
      "SELECT due_flagged_at FROM erasure_requests WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ due_flagged_at: string | null }>();
    return row?.due_flagged_at ?? null;
  }

  async function runTick(): Promise<void> {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 * * * *",
      scheduledTime: NOW,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, env, ctx);
    await waitOnExecutionContext(ctx);
  }

  it("flags a due-soon request as erasure_sla_due/medium and sets due_flagged_at", async () => {
    await seedErasureRequest("user-due-soon", "email_sent", dueSoonAt);
    await runTick();
    expect(await securityEventsFor("user-due-soon")).toEqual([
      { event_type: "erasure_sla_due", severity: "medium" },
    ]);
    expect(await dueFlaggedAtFor("user-due-soon")).toBe(nowIso);
  });

  it("flags a breached request as erasure_sla_breach/high", async () => {
    await seedErasureRequest("user-breached", "email_sent", breachedAt);
    await runTick();
    expect(await securityEventsFor("user-breached")).toEqual([
      { event_type: "erasure_sla_breach", severity: "high" },
    ]);
  });

  it.each(["completed", "cancelled", "expired"] as const)(
    "does not flag a %s request even if its due date has passed",
    async (status) => {
      const userId = `user-${status}`;
      await seedErasureRequest(userId, status, breachedAt);
      await runTick();
      expect(await securityEventsFor(userId)).toEqual([]);
      expect(await dueFlaggedAtFor(userId)).toBeNull();
    },
  );

  it("does not re-flag an already-flagged request on a later tick", async () => {
    await seedErasureRequest(
      "user-already-flagged",
      "email_sent",
      breachedAt,
      alreadyFlaggedAt,
    );
    await runTick();
    await runTick();
    expect(await securityEventsFor("user-already-flagged")).toEqual([]);
    expect(await dueFlaggedAtFor("user-already-flagged")).toBe(
      alreadyFlaggedAt,
    );
  });

  it("deletes an expired export bundle from R2 + its row; keeps a not-yet-expired one", async () => {
    await env.EXPORT_BUCKET.put("export/expired-key", "bundle");
    await env.EXPORT_BUCKET.put("export/future-key", "bundle");
    await env.DB.prepare(
      "INSERT INTO export_requests (token_hash, r2_key, email_fingerprint, created_at, expires_at) VALUES ('hash-expired', 'export/expired-key', 'fp@example.com', ?, ?)",
    )
      .bind(nowIso, breachedAt)
      .run();
    await env.DB.prepare(
      "INSERT INTO export_requests (token_hash, r2_key, email_fingerprint, created_at, expires_at) VALUES ('hash-future', 'export/future-key', 'fp@example.com', ?, ?)",
    )
      .bind(nowIso, dueSoonAt)
      .run();

    await runTick();

    expect(await env.EXPORT_BUCKET.get("export/expired-key")).toBeNull();
    const kept = await env.EXPORT_BUCKET.get("export/future-key");
    expect(kept).not.toBeNull();
    await kept?.text(); // consume the body — an unread R2 stream breaks storage isolation
    expect(
      await env.DB.prepare(
        "SELECT id FROM export_requests WHERE r2_key = 'export/expired-key'",
      ).first(),
    ).toBeNull();
    expect(
      await env.DB.prepare(
        "SELECT id FROM export_requests WHERE r2_key = 'export/future-key'",
      ).first(),
    ).not.toBeNull();
  });
});

describe("slaDueSoonCutoff", () => {
  it("computes the ISO horizon `days` after scheduledTime", () => {
    const now = Date.UTC(2026, 0, 15);
    expect(slaDueSoonCutoff(now, 7)).toBe(
      new Date(now + 7 * 86_400_000).toISOString(),
    );
  });

  it("defaults to a 7-day horizon", () => {
    const now = Date.UTC(2026, 0, 15);
    expect(slaDueSoonCutoff(now)).toBe(slaDueSoonCutoff(now, 7));
  });
});

describe("slaSeverity", () => {
  const nowIso = new Date(Date.UTC(2026, 0, 15)).toISOString();

  it("is high once the due date has already passed", () => {
    const pastDueAt = new Date(Date.UTC(2026, 0, 14)).toISOString();
    expect(slaSeverity(pastDueAt, nowIso)).toBe("high");
  });

  it("is medium while the due date is still ahead", () => {
    const futureDueAt = new Date(Date.UTC(2026, 0, 16)).toISOString();
    expect(slaSeverity(futureDueAt, nowIso)).toBe("medium");
  });
});

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    // Populated in vitest.config.ts via readD1Migrations().
    TEST_MIGRATIONS: D1Migration[];
    // Env.DB/EXPORT_BUCKET are optional (no-ops until bound in prod); the test pool
    // always binds both (d1Databases/r2Buckets in vitest.config.ts), so narrow them
    // here to non-optional.
    DB: D1Database;
    EXPORT_BUCKET: R2Bucket;
  }
}
