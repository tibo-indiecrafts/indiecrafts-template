/**
 * Runs the retention purge, erasure-SLA flag, and expired-export cleanup on each scheduled tick.
 *
 * @see docs/reference/shared/cron/src/index.md
 */
import { addTransport, logger } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import {
  effectiveSettings,
  getCurrentEnvironment,
  type SettingKey,
} from "@indiecrafts/packages-shared-config";

// A scheduled failure must not pass silently (see the NEVERs). Production console is
// silent, so forward error/fatal to Workers Logs; non-prod already shows them.
if (getCurrentEnvironment() === "production")
  addTransport(cloudflareTransport());

/**
 * Scheduled (cron) worker — a **bare** Cloudflare Worker (no Next/OpenNext).
 * Cloudflare fires `scheduled(...)` on the `[triggers] crons` schedule in
 * wrangler.toml. The passes live inline here: one consumer, so no brick (the repo's
 * ≥2-consumer extraction rule). Every tick writes one `cron_runs` row (audit D1).
 * Workers are apps — see `code/docs/shared/architecture/multi-app.md`.
 *
 * `fetch` is only a health check (a cron worker needs no HTTP surface).
 * Test a run locally: `wrangler dev` then `curl "http://localhost:8787/__scheduled"`.
 */
export interface Env {
  /** The api's EU audit-firehose D1 (binding `AUDIT_DB`) — admin_audit, session_events,
   *  security_events, csp_reports, cron_runs. The purge deletes rows past retention from each; the
   *  erasure-SLA flag pass also inserts a security_events row per due/breached request. */
  AUDIT_DB?: D1Database;
  /** The api's EU main D1 (binding `MAIN_DB`) — identity/rights/settings: consent_events,
   *  data_requests, erasure_requests, export_requests, site_settings, churn_events,
   *  post_views. The purge deletes rows past retention from consent_events, data_requests,
   *  erasure_requests, churn_events, post_views; the SLA-flag pass reads/updates erasure_requests; the
   *  export-cleanup pass reads/deletes export_requests; loadSettings reads site_settings. */
  MAIN_DB?: D1Database;
  /** The api's export-bundle bucket (`[[r2_buckets]] binding = "EXPORT_BUCKET"`) — the
   *  same bucket `POST /v1/export` writes to. Shared, operator-provisioned; the
   *  expired-export cleanup pass no-ops until it's bound. */
  EXPORT_BUCKET?: R2Bucket;
}

/** Effective settings for this tick: defaults merged with clamped D1 overrides.
 *  Never throws — any read failure falls back to code defaults. */
async function loadSettings(
  db?: D1Database,
): Promise<Record<SettingKey, number>> {
  if (!db) return effectiveSettings([]);
  try {
    const { results } = await db
      .prepare("SELECT key, value FROM site_settings")
      .all<{ key: string; value: string }>();
    return effectiveSettings(results);
  } catch (error) {
    logger.error("settings read failed; using defaults", {
      name: (error as Error)?.name,
    });
    return effectiveSettings([]);
  }
}

/** ISO cutoff `days` before `scheduledTime` (ms epoch). */
export function retentionCutoff(scheduledTime: number, days: number): string {
  return new Date(scheduledTime - days * 86_400_000).toISOString();
}

/** ISO horizon `days` after `scheduledTime` (ms epoch) — an erasure request due before
 *  this counts as "due soon" (GDPR one-month SLA, Art. 12(3)). */
export function slaDueSoonCutoff(scheduledTime: number, days = 7): string {
  return new Date(scheduledTime + days * 86_400_000).toISOString();
}

type DueRow = {
  id: number;
  user_id: string | null;
  email_fingerprint: string;
  due_at: string;
};

/** Open = the engine still owes this request an outcome: confirmed, or awaiting confirmation
 *  with a live link. `?1` = now. Same definition as the api's monitoring routes. */
const OPEN =
  "(status = 'confirmed' OR (status IN ('pending','email_sent') AND token_expires_at >= ?1))";

async function flagSla(
  audit: D1Database | undefined,
  row: DueRow,
  type: "erasure_sla_due" | "erasure_sla_breach",
  severity: "medium" | "high",
  nowIso: string,
): Promise<void> {
  if (!audit) return;
  await audit
    .prepare(
      "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, 'api', ?, NULL, NULL, ?)",
    )
    .bind(
      nowIso,
      type,
      severity,
      row.user_id ?? row.email_fingerprint,
      `erasure request ${row.id} due ${row.due_at}`,
    )
    .run();
}

/** GDPR Art. 12(3) one-month SLA. Close lapsed unverified requests (never confirmed, link
 *  expired — nothing to action), then flag each open request at most twice: "due soon"
 *  (medium) once, "breached" (high) once. A request first seen breached gets only the high
 *  flag. The security_events insert no-ops until the audit DB is bound; the flags still set. */
async function erasureSla(
  main: D1Database,
  audit: D1Database | undefined,
  nowIso: string,
  dueSoonIso: string,
): Promise<{ expired: number; dueSoon: number; breached: number }> {
  const expired = await main
    .prepare(
      "UPDATE erasure_requests SET status = 'expired' WHERE status IN ('pending','email_sent') AND token_expires_at < ?",
    )
    .bind(nowIso)
    .run();
  const { results: breached } = await main
    .prepare(
      `SELECT id, user_id, email_fingerprint, due_at FROM erasure_requests WHERE ${OPEN} AND breach_flagged_at IS NULL AND due_at < ?1`,
    )
    .bind(nowIso)
    .all<DueRow>();
  for (const row of breached) {
    await flagSla(audit, row, "erasure_sla_breach", "high", nowIso);
    await main
      .prepare(
        "UPDATE erasure_requests SET breach_flagged_at = ?1, due_flagged_at = COALESCE(due_flagged_at, ?1) WHERE id = ?2",
      )
      .bind(nowIso, row.id)
      .run();
  }
  const { results: dueSoon } = await main
    .prepare(
      `SELECT id, user_id, email_fingerprint, due_at FROM erasure_requests WHERE ${OPEN} AND due_flagged_at IS NULL AND due_at >= ?1 AND due_at < ?2`,
    )
    .bind(nowIso, dueSoonIso)
    .all<DueRow>();
  for (const row of dueSoon) {
    await flagSla(audit, row, "erasure_sla_due", "medium", nowIso);
    await main
      .prepare("UPDATE erasure_requests SET due_flagged_at = ? WHERE id = ?")
      .bind(nowIso, row.id)
      .run();
  }
  return {
    expired: expired.meta?.changes ?? 0,
    dueSoon: dueSoon.length,
    breached: breached.length,
  };
}

export type PassName =
  "audit_purge" | "main_purge" | "erasure_sla" | "export_cleanup";

/** One pass's outcome — stored as JSON in `cron_runs.passes` and shown in the admin. */
export type PassResult = {
  name: PassName;
  status: "ok" | "failed" | "skipped";
  counts: Record<string, number>;
  /** skipped: which binding is missing. */
  reason?: string;
  /** failed: the error NAME only — a message can carry data. */
  error?: string;
};

const skipped = (name: PassName, reason: string): PassResult => ({
  name,
  status: "skipped",
  counts: {},
  reason,
});

/** Run one pass in isolation: a throw becomes a `failed` result, never an early exit. */
async function runPass(
  name: PassName,
  work: () => Promise<Record<string, number>>,
): Promise<PassResult> {
  try {
    return { name, status: "ok", counts: await work() };
  } catch (error) {
    const errorName = (error as Error)?.name || "Error";
    logger.error(`${name} failed`, { name: errorName });
    return { name, status: "failed", counts: {}, error: errorName };
  }
}

const changes = (r: D1Result): number => r.meta?.changes ?? 0;

/** Audit D1 retention: the 90-day ceiling (admin_audit · session_events · security_events ·
 *  cron_runs), the 30-day CSP ceiling (operational signal, not a proof record) and the fixed
 *  24 h of stored Idempotency-Key results (the api's replay window). */
async function auditPurge(
  db: D1Database,
  cutoff: string,
  cspCutoff: string,
  idempotencyCutoff: string,
) {
  const del = async (sql: string, at: string) =>
    changes(await db.prepare(sql).bind(at).run());
  return {
    admin_audit: await del("DELETE FROM admin_audit WHERE ts < ?", cutoff),
    session_events: await del(
      "DELETE FROM session_events WHERE ts < ?",
      cutoff,
    ),
    security_events: await del(
      "DELETE FROM security_events WHERE ts < ?",
      cutoff,
    ),
    csp_reports: await del(
      "DELETE FROM csp_reports WHERE last_seen < ?",
      cspCutoff,
    ),
    cron_runs: await del("DELETE FROM cron_runs WHERE started_at < ?", cutoff),
    idempotency_keys: await del(
      "DELETE FROM idempotency_keys WHERE created_at < ?",
      idempotencyCutoff,
    ),
  };
}

type MainCutoffs = {
  consent: string;
  dataRequest: string;
  erasureRequest: string;
  churnFreeText: string;
  churn: string;
  profile: string;
  postViews: string;
};

/** Main D1 retention. consent_events + erasure_requests are proof records (3-year window);
 *  data_requests is short-lived operational PII (365 days); churn_events is
 *  legitimate-interest data excluded from erasure, so it has its own ceiling, with the
 *  user-typed free text scrubbed earlier; pseudonymised user_profiles are hard-deleted once
 *  past their window (drops the retained email_fingerprint — the 0001 "hard-deleted after 90
 *  days" promise); post_views (anonymous counters, no personal data) keep 90 days. */
async function mainPurge(db: D1Database, c: MainCutoffs) {
  const run = async (sql: string, at: string) =>
    changes(await db.prepare(sql).bind(at).run());
  return {
    consent_events: await run(
      "DELETE FROM consent_events WHERE ts < ?",
      c.consent,
    ),
    data_requests: await run(
      "DELETE FROM data_requests WHERE submitted_at < ?",
      c.dataRequest,
    ),
    erasure_requests: await run(
      "DELETE FROM erasure_requests WHERE requested_at < ?",
      c.erasureRequest,
    ),
    churn_freetext: await run(
      "UPDATE churn_events SET feedback = NULL, competitor = NULL WHERE deleted_at < ? AND (feedback IS NOT NULL OR competitor IS NOT NULL)",
      c.churnFreeText,
    ),
    churn_events: await run(
      "DELETE FROM churn_events WHERE deleted_at < ?",
      c.churn,
    ),
    user_profiles: await run(
      "DELETE FROM user_profiles WHERE anonymized = 1 AND deleted_at IS NOT NULL AND deleted_at < ?",
      c.profile,
    ),
    post_views: await run("DELETE FROM post_views WHERE day < ?", c.postViews),
  };
}

/** Sweep export bundles whose TTL passed unread (a downloaded one is already deleted by the
 *  api). An R2 delete is a no-op if the object is gone, so the pass is idempotent. */
async function exportCleanup(db: D1Database, bucket: R2Bucket, nowIso: string) {
  const { results } = await db
    .prepare("SELECT id, r2_key FROM export_requests WHERE expires_at < ?")
    .bind(nowIso)
    .all<{ id: number; r2_key: string }>();
  for (const row of results) {
    await bucket.delete(row.r2_key);
    await db
      .prepare("DELETE FROM export_requests WHERE id = ?")
      .bind(row.id)
      .run();
  }
  return { deleted: results.length };
}

/** One `cron_runs` row per tick (audit D1) — read by GET /v1/cron/status for the admin.
 *  A failed write is logged; it never masks the pass results. */
async function recordRun(
  db: D1Database | undefined,
  startedAt: string,
  passes: PassResult[],
): Promise<void> {
  if (!db) return;
  const status = passes.some((p) => p.status === "failed") ? "failed" : "ok";
  try {
    await db
      .prepare(
        "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES (?, ?, ?, ?)",
      )
      .bind(startedAt, new Date().toISOString(), status, JSON.stringify(passes))
      .run();
  } catch (error) {
    logger.error("cron run history write failed", {
      name: (error as Error)?.name,
    });
  }
}

/** One tick: load the settings, run the four passes in isolation, record the run. Shared by
 *  the cron trigger (`scheduled`) and an on-demand run (`POST /run`, via the api's binding). */
export async function runTick(
  env: Env,
  scheduledTime: number,
): Promise<PassResult[]> {
  const settings = await loadSettings(env.MAIN_DB);

  // Each window is the effective value — the D1 `site_settings` override if operator-set,
  // else the code default. What each window covers → auditPurge / mainPurge above.
  const cutoff = retentionCutoff(
    scheduledTime,
    settings["retention.audit_days"],
  );
  const consentCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.consent_days"],
  );
  const cspCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.csp_days"],
  );
  const dataRequestCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.data_request_days"],
  );
  const erasureRequestCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.erasure_request_days"],
  );
  const profileCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.profile_anonymized_days"],
  );
  const churnCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.churn_days"],
  );
  const churnFreeTextCutoff = retentionCutoff(
    scheduledTime,
    settings["retention.churn_freetext_days"],
  );
  // Fixed, not a setting: post_views hold no personal data, and the Trending window
  // (GET /v1/views/top `days`) never exceeds 90. `day` is YYYY-MM-DD, so compare dates.
  const postViewsCutoff = retentionCutoff(scheduledTime, 90).slice(0, 10);
  const nowIso = new Date(scheduledTime).toISOString();
  const dueSoon = slaDueSoonCutoff(
    scheduledTime,
    settings["ops.sla_warning_days"],
  );
  const { AUDIT_DB: audit, MAIN_DB: main, EXPORT_BUCKET: bucket } = env;
  // Each pass runs on its own: one failing pass never skips the others.
  const passes: PassResult[] = [
    audit
      ? await runPass("audit_purge", () =>
          auditPurge(
            audit,
            cutoff,
            cspCutoff,
            new Date(scheduledTime - 86_400_000).toISOString(),
          ),
        )
      : skipped("audit_purge", "AUDIT_DB unbound"),
    main
      ? await runPass("main_purge", () =>
          mainPurge(main, {
            consent: consentCutoff,
            dataRequest: dataRequestCutoff,
            erasureRequest: erasureRequestCutoff,
            churnFreeText: churnFreeTextCutoff,
            churn: churnCutoff,
            profile: profileCutoff,
            postViews: postViewsCutoff,
          }),
        )
      : skipped("main_purge", "MAIN_DB unbound"),
    main
      ? await runPass("erasure_sla", () =>
          erasureSla(main, audit, nowIso, dueSoon),
        )
      : skipped("erasure_sla", "MAIN_DB unbound"),
    !main
      ? skipped("export_cleanup", "MAIN_DB unbound")
      : !bucket
        ? skipped("export_cleanup", "EXPORT_BUCKET unbound")
        : await runPass("export_cleanup", () =>
            exportCleanup(main, bucket, nowIso),
          ),
  ];
  logger.info("cron passes", { passes });
  await recordRun(audit, nowIso, passes);
  return passes;
}

const failedPasses = (passes: PassResult[]) =>
  passes.filter((p) => p.status === "failed");

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    logger.info("cron tick", {
      cron: controller.cron,
      scheduledTime: controller.scheduledTime,
    });
    const failed = failedPasses(await runTick(env, controller.scheduledTime));
    // Cloudflare does not retry a failed cron run — the next hourly tick re-runs every pass.
    if (failed.length)
      throw new AggregateError(
        failed.map((p) => new Error(`${p.name}: ${p.error}`)),
        `cron: ${failed.length} pass(es) failed`,
      );
  },

  /** `POST /run` runs one tick now. This Worker has no public URL (`workers_dev = false`):
   *  only the api's service binding (`POST /v1/cron/run`, admin-only) can reach it. Any other
   *  request is the health check. */
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "POST" && new URL(request.url).pathname === "/run") {
      const passes = await runTick(env, Date.now());
      const status = failedPasses(passes).length ? "failed" : "ok";
      return Response.json(
        { status, passes },
        { status: status === "ok" ? 200 : 500 },
      );
    }
    return Response.json({ ok: true });
  },
} satisfies ExportedHandler<Env>;
