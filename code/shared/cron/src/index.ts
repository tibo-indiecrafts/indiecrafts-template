import { addTransport, logger } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

// A scheduled failure must not pass silently (see the NEVERs). Production console is
// silent, so forward error/fatal to Workers Logs; non-prod already shows them.
if (getCurrentEnvironment() === "production")
  addTransport(cloudflareTransport());

/**
 * Scheduled (cron) worker — a **bare** Cloudflare Worker (no Next/OpenNext).
 * Cloudflare fires `scheduled(...)` on the `[triggers] crons` schedule in
 * wrangler.toml. This file is the deploy **shell**; the task itself belongs in a
 * package or module (import via `workspace:*`), keeping this entrypoint thin.
 * Workers are apps — see `code/docs/shared/architecture/multi-app.md`.
 *
 * `fetch` is only a health check (a cron worker needs no HTTP surface).
 * Test a run locally: `wrangler dev` then `curl "http://localhost:8787/__scheduled"`.
 */
export interface Env {
  /** The api's EU D1 (binding `DB`) — the same database the api writes (admin_audit,
   *  session_events, security_events, consent_events, csp_reports, data_requests,
   *  erasure_requests, export_requests). The purge deletes rows past retention from
   *  csp_reports + all but export_requests; the SLA-flag + export-cleanup passes also
   *  read/write erasure_requests + export_requests. */
  DB?: D1Database;
  /** The api's export-bundle bucket (`[[r2_buckets]] binding = "EXPORT_BUCKET"`) — the
   *  same bucket `POST /v1/export` writes to. Shared, operator-provisioned; the
   *  expired-export cleanup pass no-ops until it's bound. */
  EXPORT_BUCKET?: R2Bucket;
}

/** GDPR storage-limitation ceiling for the audit + session records (Art. 5(1)(e)). */
const RETENTION_DAYS = 90;

/** consent_events is kept far longer than the audit tables — consent is a proof
 *  record with its own retention duty (spec §13). ~3 years. */
const CONSENT_RETENTION_DAYS = 1095;

/** CSP violation reports are operational signal, not a proof record — 30 days. */
const CSP_RETENTION_DAYS = 30;

/** data_requests (DSAR intake) is short-lived operational PII — a year gives the
 *  operator room to action + prove the request, then it's purged. */
const DATA_REQUEST_RETENTION_DAYS = 365;

/** erasure_requests is kept as long as consent_events — it is the proof-of-erasure
 *  record for a completed request, not an audit trail. ~3 years. */
const ERASURE_REQUEST_RETENTION_DAYS = 1095;

/** How far ahead of an erasure request's `due_at` counts as "due soon" for the SLA flag. */
const SLA_WARNING_DAYS = 7;

/** ISO cutoff `days` before `scheduledTime` (ms epoch). */
export function retentionCutoff(scheduledTime: number, days: number): string {
  return new Date(scheduledTime - days * 86_400_000).toISOString();
}

/** ISO horizon `days` after `scheduledTime` (ms epoch) — an erasure request due before
 *  this counts as "due soon" (GDPR one-month SLA, Art. 12(3)). */
export function slaDueSoonCutoff(scheduledTime: number, days = 7): string {
  return new Date(scheduledTime + days * 86_400_000).toISOString();
}

/** `high` once the due date has already passed (breached); `medium` while still approaching. */
export function slaSeverity(dueAt: string, nowIso: string): "high" | "medium" {
  return dueAt < nowIso ? "high" : "medium";
}

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

    // Retention purge (GDPR storage limitation): purge tables past their ceiling from
    // the one EU D1. admin_audit + session_events + security_events use the 90-day
    // ceiling; consent_events uses its own, much longer 3-year window, because it is a
    // consent proof record, not an audit trail. csp_reports uses a 30-day ceiling (CSP
    // violations are operational signal, not proof records); data_requests (DSAR intake,
    // short-lived operational PII) purges at 365 days; erasure_requests (proof-of-erasure
    // record) purges at the same 3-year window as consent_events. Idempotent — safe on
    // every tick. No-ops until the DB is bound.
    const cutoff = retentionCutoff(controller.scheduledTime, RETENTION_DAYS);
    const consentCutoff = retentionCutoff(
      controller.scheduledTime,
      CONSENT_RETENTION_DAYS,
    );
    const cspCutoff = retentionCutoff(
      controller.scheduledTime,
      CSP_RETENTION_DAYS,
    );
    const dataRequestCutoff = retentionCutoff(
      controller.scheduledTime,
      DATA_REQUEST_RETENTION_DAYS,
    );
    const erasureRequestCutoff = retentionCutoff(
      controller.scheduledTime,
      ERASURE_REQUEST_RETENTION_DAYS,
    );
    const nowIso = new Date(controller.scheduledTime).toISOString();
    const dueSoon = slaDueSoonCutoff(
      controller.scheduledTime,
      SLA_WARNING_DAYS,
    );
    if (env.DB) {
      try {
        const admin = await env.DB.prepare(
          "DELETE FROM admin_audit WHERE ts < ?",
        )
          .bind(cutoff)
          .run();
        const session = await env.DB.prepare(
          "DELETE FROM session_events WHERE ts < ?",
        )
          .bind(cutoff)
          .run();
        const security = await env.DB.prepare(
          "DELETE FROM security_events WHERE ts < ?",
        )
          .bind(cutoff)
          .run();
        const consent = await env.DB.prepare(
          "DELETE FROM consent_events WHERE ts < ?",
        )
          .bind(consentCutoff)
          .run();
        const csp = await env.DB.prepare(
          "DELETE FROM csp_reports WHERE last_seen < ?",
        )
          .bind(cspCutoff)
          .run();
        const dataRequest = await env.DB.prepare(
          "DELETE FROM data_requests WHERE submitted_at < ?",
        )
          .bind(dataRequestCutoff)
          .run();
        const erasureRequest = await env.DB.prepare(
          "DELETE FROM erasure_requests WHERE requested_at < ?",
        )
          .bind(erasureRequestCutoff)
          .run();
        logger.info("retention purge", {
          cutoff,
          consentCutoff,
          cspCutoff,
          dataRequestCutoff,
          erasureRequestCutoff,
          adminRows: admin.meta?.changes,
          sessionRows: session.meta?.changes,
          securityRows: security.meta?.changes,
          consentRows: consent.meta?.changes,
          cspRows: csp.meta?.changes,
          dataRequestRows: dataRequest.meta?.changes,
          erasureRequestRows: erasureRequest.meta?.changes,
        });
      } catch (error) {
        logger.error("retention purge failed", {
          name: (error as Error)?.name,
        });
        throw error; // surface the failure on the scheduled run
      }

      // Erasure SLA flag (GDPR Art. 12(3) one-month deadline): once per request, flag any
      // erasure request whose due date is within the warning window (or already breached)
      // as a security_events row, then mark it flagged so a later tick doesn't repeat it.
      // Idempotent; no-ops until the DB is bound.
      try {
        const { results: dueRows } = await env.DB.prepare(
          "SELECT id, user_id, email_fingerprint, due_at FROM erasure_requests WHERE due_flagged_at IS NULL AND status NOT IN ('completed','cancelled','expired') AND due_at < ?",
        )
          .bind(dueSoon)
          .all<{
            id: number;
            user_id: string | null;
            email_fingerprint: string;
            due_at: string;
          }>();
        for (const row of dueRows) {
          const severity = slaSeverity(row.due_at, nowIso);
          const eventType =
            severity === "high" ? "erasure_sla_breach" : "erasure_sla_due";
          await env.DB.prepare(
            "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, 'api', ?, NULL, NULL, ?)",
          )
            .bind(
              nowIso,
              eventType,
              severity,
              row.user_id ?? row.email_fingerprint,
              `erasure request ${row.id} due ${row.due_at}`,
            )
            .run();
          await env.DB.prepare(
            "UPDATE erasure_requests SET due_flagged_at = ? WHERE id = ?",
          )
            .bind(nowIso, row.id)
            .run();
        }
        logger.info("erasure SLA flag", { flagged: dueRows.length });
      } catch (error) {
        logger.error("erasure SLA flag failed", {
          name: (error as Error)?.name,
        });
        throw error;
      }

      // Expired export-bundle cleanup (deferred from the export slice): a bundle is
      // already deleted from R2 on first download, so this sweeps the rest — a bundle
      // whose 1-hour TTL passed without ever being downloaded. Idempotent (an R2 delete
      // is a no-op if the object is already gone); no-ops until EXPORT_BUCKET is bound.
      if (env.EXPORT_BUCKET) {
        try {
          const { results: expiredExports } = await env.DB.prepare(
            "SELECT id, r2_key FROM export_requests WHERE expires_at < ?",
          )
            .bind(nowIso)
            .all<{ id: number; r2_key: string }>();
          for (const row of expiredExports) {
            await env.EXPORT_BUCKET.delete(row.r2_key);
            await env.DB.prepare("DELETE FROM export_requests WHERE id = ?")
              .bind(row.id)
              .run();
          }
          logger.info("expired export cleanup", {
            purged: expiredExports.length,
          });
        } catch (error) {
          logger.error("expired export cleanup failed", {
            name: (error as Error)?.name,
          });
          throw error;
        }
      }
    }
  },

  async fetch(): Promise<Response> {
    return Response.json({ ok: true });
  },
} satisfies ExportedHandler<Env>;
