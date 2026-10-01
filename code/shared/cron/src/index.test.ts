/// <reference types="@cloudflare/vitest-pool-workers" />
import {
  applyD1Migrations,
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import worker, { type Env, type PassResult, slaDueSoonCutoff } from "./index";

// Apply the api's db/audit + db/main migrations/*.sql (see vitest.config.ts) before any test runs —
// the cron shares the api's D1, so tests exercise the real schema.
beforeAll(async () => {
  await applyD1Migrations(env.AUDIT_DB, env.TEST_MIGRATIONS);
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

describe("retention purges", () => {
  const NOW = Date.UTC(2026, 0, 31); // 2026-01-31T00:00:00Z

  async function seedCspReport(
    groupKey: string,
    lastSeen: string,
  ): Promise<void> {
    const firstSeen = new Date(NOW - 60 * 86_400_000).toISOString();
    await env.AUDIT_DB?.prepare(
      "INSERT INTO csp_reports (group_key, first_seen, last_seen, surface, disposition, directive, document_path, blocked_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        groupKey,
        firstSeen,
        lastSeen,
        "website",
        "report",
        "img-src",
        "/",
        "https://example.com",
      )
      .run();
  }

  async function runScheduled(scheduledTime: number): Promise<void> {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 6 * * *",
      scheduledTime,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, env, ctx);
    await waitOnExecutionContext(ctx);
  }

  it("purges csp_reports older than 30 days on last_seen", async () => {
    const old = new Date(NOW - 31 * 86_400_000).toISOString();
    const fresh = new Date(NOW - 1 * 86_400_000).toISOString();

    await seedCspReport("website|report|img-src|/a|https://x", old);
    await seedCspReport("website|report|img-src|/b|https://y", fresh);

    await runScheduled(NOW);

    const result = await env
      .AUDIT_DB!.prepare("SELECT group_key FROM csp_reports ORDER BY group_key")
      .all<{ group_key: string }>();

    const groupKeys = result.results.map((r) => r.group_key);
    expect(groupKeys).toEqual(["website|report|img-src|/b|https://y"]);
  });

  it("purges csp_reports on an operator override (7 days) instead of the 30-day default", async () => {
    // Override the CSP window down to 7 days. site_settings lives on MAIN_DB.
    await env
      .MAIN_DB!.prepare(
        "INSERT INTO site_settings (key, value, updated_at, updated_by) VALUES ('retention.csp_days', '7', ?, 'user_test')",
      )
      .bind(new Date(NOW).toISOString())
      .run();

    const old = new Date(NOW - 10 * 86_400_000).toISOString(); // 10d — kept at 30d, purged at 7d
    await seedCspReport("website|report|img-src|/c|https://z", old);

    await runScheduled(NOW);

    const row = await env
      .AUDIT_DB!.prepare(
        "SELECT group_key FROM csp_reports WHERE group_key = 'website|report|img-src|/c|https://z'",
      )
      .first();
    expect(row).toBeNull();
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
    // data_requests lives on MAIN_DB.
    await env.MAIN_DB.prepare(
      "INSERT INTO data_requests (request_type, email, status, submitted_at) VALUES ('access', 'old-dsar@example.com', 'new', ?)",
    )
      .bind(oldDataRequestAt)
      .run();
    await env.MAIN_DB.prepare(
      "INSERT INTO data_requests (request_type, email, status, submitted_at) VALUES ('access', 'recent-dsar@example.com', 'new', ?)",
    )
      .bind(recentDataRequestAt)
      .run();
    // Its operator history must go with it (data_request_events, ON DELETE CASCADE).
    const old = await env.MAIN_DB.prepare(
      "SELECT id FROM data_requests WHERE email = 'old-dsar@example.com'",
    ).first<{ id: number }>();
    await env.MAIN_DB.prepare(
      "INSERT INTO data_request_events (request_id, status, actor, at) VALUES (?, 'done', 'user_a', ?)",
    )
      .bind(old!.id, oldDataRequestAt)
      .run();

    await runTick();

    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM data_requests WHERE email = 'old-dsar@example.com'",
      ).first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM data_request_events WHERE request_id = ?",
      )
        .bind(old!.id)
        .first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM data_requests WHERE email = 'recent-dsar@example.com'",
      ).first(),
    ).not.toBeNull();
  });

  it("purges an erasure_requests row past the 1095-day retention; keeps a recent one", async () => {
    // erasure_requests lives on MAIN_DB.
    await env.MAIN_DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, email_fingerprint, requested_at, due_at) VALUES ('completed', 'hash-old-purge', ?, 'fp-old-purge@example.com', ?, ?)",
    )
      .bind(oldErasureRequestAt, oldErasureRequestAt, oldErasureRequestAt)
      .run();
    await env.MAIN_DB.prepare(
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
      await env.MAIN_DB.prepare(
        "SELECT id FROM erasure_requests WHERE email_fingerprint = 'fp-old-purge@example.com'",
      ).first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM erasure_requests WHERE email_fingerprint = 'fp-recent-purge@example.com'",
      ).first(),
    ).not.toBeNull();
  });

  it("purges a churn_events row past the 730-day retention; keeps a recent one", async () => {
    // churn_events lives on MAIN_DB.
    const oldChurnAt = new Date(NOW - 800 * 86_400_000).toISOString(); // > 730d
    const recentChurnAt = new Date(NOW - 10 * 86_400_000).toISOString();

    await env.MAIN_DB.prepare(
      "INSERT INTO churn_events (user_id, deleted_at) VALUES ('user-old-purge', ?)",
    )
      .bind(oldChurnAt)
      .run();
    await env.MAIN_DB.prepare(
      "INSERT INTO churn_events (user_id, deleted_at) VALUES ('user-recent-purge', ?)",
    )
      .bind(recentChurnAt)
      .run();

    await runTick();

    expect(
      await env.MAIN_DB.prepare(
        "SELECT user_id FROM churn_events WHERE user_id = 'user-old-purge'",
      ).first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT user_id FROM churn_events WHERE user_id = 'user-recent-purge'",
      ).first(),
    ).not.toBeNull();
  });

  it("scrubs churn free-text past 365 days (keeps the aggregate); leaves recent rows intact", async () => {
    const oldAt = new Date(NOW - 400 * 86_400_000).toISOString(); // > 365d, < 730d
    const recentAt = new Date(NOW - 10 * 86_400_000).toISOString();
    await env.MAIN_DB.prepare(
      "INSERT INTO churn_events (user_id, deleted_at, reason, feedback, competitor) VALUES ('user-old-ft', ?, 'too_expensive', 'my email is a@b.com', 'RivalCo')",
    )
      .bind(oldAt)
      .run();
    await env.MAIN_DB.prepare(
      "INSERT INTO churn_events (user_id, deleted_at, reason, feedback, competitor) VALUES ('user-recent-ft', ?, 'missing_feature', 'keep this', 'RivalCo')",
    )
      .bind(recentAt)
      .run();

    await runTick();

    // Old row: free text scrubbed, aggregate kept, row still present.
    const old = await env.MAIN_DB.prepare(
      "SELECT reason, feedback, competitor FROM churn_events WHERE user_id = 'user-old-ft'",
    ).first<{
      reason: string;
      feedback: string | null;
      competitor: string | null;
    }>();
    expect(old?.reason).toBe("too_expensive");
    expect(old?.feedback).toBeNull();
    expect(old?.competitor).toBeNull();

    // Recent row: free text untouched.
    const recent = await env.MAIN_DB.prepare(
      "SELECT feedback FROM churn_events WHERE user_id = 'user-recent-ft'",
    ).first<{ feedback: string | null }>();
    expect(recent?.feedback).toBe("keep this");
  });

  it("hard-deletes user_profiles anonymised past 90 days; keeps recent-anonymised + active rows", async () => {
    const oldAnonAt = new Date(NOW - 100 * 86_400_000).toISOString(); // > 90d ago
    const recentAnonAt = new Date(NOW - 10 * 86_400_000).toISOString();
    const created = new Date(NOW - 500 * 86_400_000).toISOString();
    // Anonymised on erasure long ago → final purge (drops the retained fingerprint row).
    await env.MAIN_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at, deleted_at, anonymized) VALUES ('up-old-anon', 'deleted_up-old-anon@anonymized.local', 'Deleted User', 'fp-old', ?, ?, 1)",
    )
      .bind(created, oldAnonAt)
      .run();
    // Anonymised recently → kept (the window has not elapsed; late erasure can still resolve).
    await env.MAIN_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at, deleted_at, anonymized) VALUES ('up-recent-anon', 'deleted_up-recent-anon@anonymized.local', 'fp-recent', ?, ?, 1)",
    )
      .bind(created, recentAnonAt)
      .run();
    // Active account (never anonymised), old created_at → NEVER purged (anonymized = 0).
    await env.MAIN_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at, anonymized) VALUES ('up-active', 'active@example.com', 'fp-active', ?, 0)",
    )
      .bind(created)
      .run();

    await runTick();

    expect(
      await env.MAIN_DB.prepare(
        "SELECT user_id FROM user_profiles WHERE user_id = 'up-old-anon'",
      ).first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT user_id FROM user_profiles WHERE user_id = 'up-recent-anon'",
      ).first(),
    ).not.toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT user_id FROM user_profiles WHERE user_id = 'up-active'",
      ).first(),
    ).not.toBeNull();
  });
});

describe("scheduled() — retention purge (admin_audit + session_events + security_events + consent_events)", () => {
  const NOW = Date.UTC(2026, 0, 15); // 2026-01-15T00:00:00Z
  const oldAuditAt = new Date(NOW - 100 * 86_400_000).toISOString(); // > 90d
  const freshAuditAt = new Date(NOW - 1 * 86_400_000).toISOString();
  const oldConsentAt = new Date(NOW - 1200 * 86_400_000).toISOString(); // > 1095d
  const freshConsentAt = new Date(NOW - 1 * 86_400_000).toISOString();

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

  it("purges Idempotency-Key results after 24 h; keeps a fresh one", async () => {
    const ins = (key: string, at: string) =>
      env.AUDIT_DB.prepare(
        "INSERT INTO idempotency_keys (scope, key, request_hash, status, body, created_at) VALUES ('/v1/events:x', ?, 'h', 201, '{}', ?)",
      )
        .bind(key, at)
        .run();
    await ins("idem-old", new Date(NOW - 2 * 86_400_000).toISOString());
    await ins("idem-fresh", new Date(NOW - 3_600_000).toISOString());

    await runTick();

    const has = async (key: string) =>
      (await env.AUDIT_DB.prepare(
        "SELECT key FROM idempotency_keys WHERE key = ?",
      )
        .bind(key)
        .first()) !== null;
    expect(await has("idem-old")).toBe(false);
    expect(await has("idem-fresh")).toBe(true);
  });

  it("purges an admin_audit row past the 90-day retention; keeps a recent one", async () => {
    // admin_audit lives on DB.
    await env.AUDIT_DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id) VALUES (?, 'admin.grant', ?, 'target-user')",
    )
      .bind(oldAuditAt, "actor-old-purge")
      .run();
    await env.AUDIT_DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id) VALUES (?, 'admin.grant', ?, 'target-user')",
    )
      .bind(freshAuditAt, "actor-recent-purge")
      .run();

    await runTick();

    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM admin_audit WHERE actor_user_id = 'actor-old-purge'",
      ).first(),
    ).toBeNull();
    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM admin_audit WHERE actor_user_id = 'actor-recent-purge'",
      ).first(),
    ).not.toBeNull();
  });

  it("purges a session_events row past the 90-day retention; keeps a recent one", async () => {
    // session_events lives on DB.
    await env.AUDIT_DB.prepare(
      "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
    )
      .bind(oldAuditAt, "user-session-old-purge")
      .run();
    await env.AUDIT_DB.prepare(
      "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
    )
      .bind(freshAuditAt, "user-session-recent-purge")
      .run();

    await runTick();

    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM session_events WHERE user_id = 'user-session-old-purge'",
      ).first(),
    ).toBeNull();
    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM session_events WHERE user_id = 'user-session-recent-purge'",
      ).first(),
    ).not.toBeNull();
  });

  it("purges a security_events row past the 90-day retention; keeps a recent one", async () => {
    // security_events lives on DB.
    await env.AUDIT_DB.prepare(
      "INSERT INTO security_events (ts, event_type, severity, description) VALUES (?, 'suspicious_pattern', 'low', ?)",
    )
      .bind(oldAuditAt, "sec-event-old-purge")
      .run();
    await env.AUDIT_DB.prepare(
      "INSERT INTO security_events (ts, event_type, severity, description) VALUES (?, 'suspicious_pattern', 'low', ?)",
    )
      .bind(freshAuditAt, "sec-event-recent-purge")
      .run();

    await runTick();

    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM security_events WHERE description = 'sec-event-old-purge'",
      ).first(),
    ).toBeNull();
    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM security_events WHERE description = 'sec-event-recent-purge'",
      ).first(),
    ).not.toBeNull();
  });

  it("purges a consent_events row past the 1095-day retention; keeps a recent one", async () => {
    // consent_events lives on MAIN_DB.
    await env.MAIN_DB.prepare(
      "INSERT INTO consent_events (ts, subject_type, subject_id, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'user', 'user-consent-purge', 'cookie_analytics', 1, 'v1', 'website', ?)",
    )
      .bind(oldConsentAt, "consent-old-purge")
      .run();
    await env.MAIN_DB.prepare(
      "INSERT INTO consent_events (ts, subject_type, subject_id, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'user', 'user-consent-purge', 'cookie_analytics', 1, 'v1', 'website', ?)",
    )
      .bind(freshConsentAt, "consent-recent-purge")
      .run();

    await runTick();

    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM consent_events WHERE idempotency_key = 'consent-old-purge'",
      ).first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM consent_events WHERE idempotency_key = 'consent-recent-purge'",
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

  // erasure_requests lives on MAIN_DB.
  async function seedErasureRequest(
    userId: string,
    status: string,
    dueAt: string,
    dueFlaggedAt: string | null = null,
    tokenExpiresAt: string = dueAt,
  ): Promise<void> {
    await env.MAIN_DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at, due_flagged_at) VALUES (?, 'hash', ?, ?, 'fp@example.com', ?, ?, ?)",
    )
      .bind(status, tokenExpiresAt, userId, dueAt, dueAt, dueFlaggedAt)
      .run();
  }

  // security_events lives on DB (the audit firehose).
  async function securityEventsFor(userId: string) {
    const { results } = await env.AUDIT_DB.prepare(
      "SELECT event_type, severity FROM security_events WHERE user_id = ?",
    )
      .bind(userId)
      .all<{ event_type: string; severity: string }>();
    return results;
  }

  async function dueFlaggedAtFor(userId: string): Promise<string | null> {
    const row = await env.MAIN_DB.prepare(
      "SELECT due_flagged_at FROM erasure_requests WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ due_flagged_at: string | null }>();
    return row?.due_flagged_at ?? null;
  }

  async function breachFlaggedAtFor(userId: string): Promise<string | null> {
    const row = await env.MAIN_DB.prepare(
      "SELECT breach_flagged_at FROM erasure_requests WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ breach_flagged_at: string | null }>();
    return row?.breach_flagged_at ?? null;
  }

  async function statusFor(userId: string): Promise<string | null> {
    const row = await env.MAIN_DB.prepare(
      "SELECT status FROM erasure_requests WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ status: string }>();
    return row?.status ?? null;
  }

  async function runTick(at: number = NOW): Promise<void> {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 * * * *",
      scheduledTime: at,
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
    await seedErasureRequest("user-breached", "confirmed", breachedAt);
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

  it("escalates a due-soon request to breach once, never twice", async () => {
    await seedErasureRequest("user-escalate", "confirmed", dueSoonAt);
    await runTick(); // due soon → medium
    const after = NOW + 4 * 86_400_000; // past dueSoonAt
    await runTick(after);
    await runTick(after + 3_600_000);
    expect(await securityEventsFor("user-escalate")).toEqual([
      { event_type: "erasure_sla_due", severity: "medium" },
      { event_type: "erasure_sla_breach", severity: "high" },
    ]);
    expect(await breachFlaggedAtFor("user-escalate")).toBe(
      new Date(after).toISOString(),
    );
  });

  it("a request first seen already breached gets only the high flag, once", async () => {
    await seedErasureRequest("user-late", "confirmed", breachedAt);
    await runTick();
    await runTick(NOW + 3_600_000);
    expect(await securityEventsFor("user-late")).toEqual([
      { event_type: "erasure_sla_breach", severity: "high" },
    ]);
    expect(await dueFlaggedAtFor("user-late")).toBe(nowIso);
  });

  it("does not re-flag a request already flagged due soon and breached", async () => {
    await seedErasureRequest(
      "user-already-flagged",
      "confirmed",
      breachedAt,
      alreadyFlaggedAt,
    );
    await env.MAIN_DB.prepare(
      "UPDATE erasure_requests SET breach_flagged_at = ? WHERE user_id = 'user-already-flagged'",
    )
      .bind(alreadyFlaggedAt)
      .run();
    await runTick();
    expect(await securityEventsFor("user-already-flagged")).toEqual([]);
  });

  it("closes a never-confirmed request whose link lapsed — expired, never flagged", async () => {
    await seedErasureRequest(
      "user-lapsed",
      "email_sent",
      breachedAt,
      null,
      breachedAt,
    );
    await runTick();
    expect(await statusFor("user-lapsed")).toBe("expired");
    expect(await securityEventsFor("user-lapsed")).toEqual([]);
  });

  it("deletes an expired export bundle from R2 + its row; keeps a not-yet-expired one", async () => {
    // export_requests lives on MAIN_DB.
    await env.EXPORT_BUCKET.put("export/expired-key", "bundle");
    await env.EXPORT_BUCKET.put("export/future-key", "bundle");
    await env.MAIN_DB.prepare(
      "INSERT INTO export_requests (token_hash, r2_key, email_fingerprint, created_at, expires_at) VALUES ('hash-expired', 'export/expired-key', 'fp@example.com', ?, ?)",
    )
      .bind(nowIso, breachedAt)
      .run();
    await env.MAIN_DB.prepare(
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
      await env.MAIN_DB.prepare(
        "SELECT id FROM export_requests WHERE r2_key = 'export/expired-key'",
      ).first(),
    ).toBeNull();
    expect(
      await env.MAIN_DB.prepare(
        "SELECT id FROM export_requests WHERE r2_key = 'export/future-key'",
      ).first(),
    ).not.toBeNull();
  });
});

describe("scheduled() — passes + run history", () => {
  const NOW = Date.UTC(2026, 0, 15);
  const tick = async (e: Env = env, at = NOW) => {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 * * * *",
      scheduledTime: at,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, e, ctx);
    await waitOnExecutionContext(ctx);
  };
  const lastRun = async () =>
    env.AUDIT_DB.prepare(
      "SELECT status, passes FROM cron_runs ORDER BY id DESC LIMIT 1",
    ).first<{ status: string; passes: string }>();

  it("writes one ok history row with every pass's counts", async () => {
    await tick();
    const row = await lastRun();
    expect(row?.status).toBe("ok");
    const passes = JSON.parse(row!.passes) as PassResult[];
    expect(passes.map((p) => [p.name, p.status])).toEqual([
      ["audit_purge", "ok"],
      ["main_purge", "ok"],
      ["erasure_sla", "ok"],
      ["export_cleanup", "ok"],
    ]);
    expect(passes[2].counts).toEqual({ expired: 0, dueSoon: 0, breached: 0 });
  });

  it("a failing pass does not block the others — history says which, then the tick rejects", async () => {
    await env.AUDIT_DB.prepare("DROP TABLE csp_reports").run();
    await env.MAIN_DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at) VALUES ('confirmed','h','2026-01-01T00:00:00Z','user-still-flagged','fp','2025-12-01T00:00:00Z','2026-01-01T00:00:00Z')",
    ).run();
    await expect(tick()).rejects.toThrow(/1 pass\(es\) failed/);
    const row = await lastRun();
    expect(row?.status).toBe("failed");
    const passes = JSON.parse(row!.passes) as PassResult[];
    expect(passes[0]).toMatchObject({ name: "audit_purge", status: "failed" });
    expect(passes[0].error).toBeTruthy();
    expect(passes[2]).toMatchObject({
      name: "erasure_sla",
      status: "ok",
      counts: { breached: 1 },
    });
    expect(row!.passes).not.toMatch(/no such table/); // the error NAME only, never the message
  });

  it("skips the export cleanup (with a reason) when EXPORT_BUCKET is unbound", async () => {
    await tick({ ...env, EXPORT_BUCKET: undefined });
    const passes = JSON.parse((await lastRun())!.passes) as PassResult[];
    expect(passes[3]).toEqual({
      name: "export_cleanup",
      status: "skipped",
      counts: {},
      reason: "EXPORT_BUCKET unbound",
    });
  });

  it("purges cron_runs past the audit window", async () => {
    await env.AUDIT_DB.prepare(
      "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES ('2025-01-01T00:00:00Z','2025-01-01T00:00:01Z','ok','[]')",
    ).run();
    await tick();
    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM cron_runs WHERE started_at = '2025-01-01T00:00:00Z'",
      ).first(),
    ).toBeNull();
  });
});

describe("POST /run — a tick on demand (reached only via the api's service binding)", () => {
  it("runs the four passes, records the run and returns the result", async () => {
    const res = await SELF.fetch("https://cron/run", { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; passes: PassResult[] };
    expect(body.status).toBe("ok");
    expect(body.passes.map((p) => p.name)).toEqual([
      "audit_purge",
      "main_purge",
      "erasure_sla",
      "export_cleanup",
    ]);
    const row = await env.AUDIT_DB.prepare(
      "SELECT status FROM cron_runs ORDER BY id DESC LIMIT 1",
    ).first<{ status: string }>();
    expect(row?.status).toBe("ok");
  });

  it("500s with the passes when a pass fails", async () => {
    await env.AUDIT_DB.prepare("DROP TABLE csp_reports").run();
    const res = await SELF.fetch("https://cron/run", { method: "POST" });
    expect(res.status).toBe(500);
    const body = (await res.json()) as { status: string; passes: PassResult[] };
    expect(body.status).toBe("failed");
    expect(body.passes[0].status).toBe("failed");
  });

  it("a GET is still only the health check — it never runs a tick", async () => {
    const res = await SELF.fetch("https://cron/run");
    expect(await res.json()).toEqual({ ok: true });
    expect(
      await env.AUDIT_DB.prepare("SELECT COUNT(*) AS n FROM cron_runs").first<{
        n: number;
      }>(),
    ).toEqual({ n: 0 });
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

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    // Populated in vitest.config.ts via readD1Migrations().
    TEST_MIGRATIONS: D1Migration[];
    // Env.AUDIT_DB/MAIN_DB/EXPORT_BUCKET are optional (no-ops until bound in prod); the test
    // pool always binds all three (d1Databases/r2Buckets in vitest.config.ts), so narrow
    // them here to non-optional.
    AUDIT_DB: D1Database;
    MAIN_DB: D1Database;
    EXPORT_BUCKET: R2Bucket;
  }
}
