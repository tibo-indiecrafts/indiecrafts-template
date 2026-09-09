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
 * wrangler.toml. This file is the deploy **shell**; the task itself belongs in a
 * package or module (import via `workspace:*`), keeping this entrypoint thin.
 * Workers are apps — see `code/docs/shared/architecture/multi-app.md`.
 *
 * `fetch` is only a health check (a cron worker needs no HTTP surface).
 * Test a run locally: `wrangler dev` then `curl "http://localhost:8787/__scheduled"`.
 */
export interface Env {
  /** The api's EU audit-firehose D1 (binding `DB`) — admin_audit, session_events,
   *  security_events, csp_reports. The purge deletes rows past retention from each; the
   *  erasure-SLA flag pass also inserts a security_events row per due/breached request. */
  AUDIT_DB?: D1Database;
  /** The api's EU main D1 (binding `MAIN_DB`) — identity/rights/settings: consent_events,
   *  data_requests, erasure_requests, export_requests, site_settings. The purge deletes
   *  rows past retention from consent_events, data_requests, erasure_requests; the
   *  SLA-flag pass reads/updates erasure_requests; the export-cleanup pass reads/deletes
   *  export_requests; loadSettings reads site_settings. */
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

    const settings = await loadSettings(env.MAIN_DB);

    // Retention purge (GDPR storage limitation): purge tables past their ceiling, split
    // across the two EU D1s. admin_audit + session_events + security_events (audit `DB`)
    // use the 90-day ceiling; csp_reports (audit `DB`) uses a 30-day ceiling (CSP
    // violations are operational signal, not proof records). consent_events (core
    // `MAIN_DB`) uses its own, much longer 3-year window, because it is a consent proof
    // record, not an audit trail; data_requests (core, DSAR intake, short-lived
    // operational PII) purges at 365 days; erasure_requests (core, proof-of-erasure
    // record) purges at the same 3-year window as consent_events. Idempotent — safe on
    // every tick. No-ops until the relevant DB is bound. Each window is the effective
    // value — the D1 `site_settings` override if operator-set, else the code default.
    const cutoff = retentionCutoff(
      controller.scheduledTime,
      settings["retention.audit_days"],
    );
    const consentCutoff = retentionCutoff(
      controller.scheduledTime,
      settings["retention.consent_days"],
    );
    const cspCutoff = retentionCutoff(
      controller.scheduledTime,
      settings["retention.csp_days"],
    );
    const dataRequestCutoff = retentionCutoff(
      controller.scheduledTime,
      settings["retention.data_request_days"],
    );
    const erasureRequestCutoff = retentionCutoff(
      controller.scheduledTime,
      settings["retention.erasure_request_days"],
    );
    const nowIso = new Date(controller.scheduledTime).toISOString();
    const dueSoon = slaDueSoonCutoff(
      controller.scheduledTime,
      settings["ops.sla_warning_days"],
    );
    if (env.AUDIT_DB) {
      try {
        const admin = await env.AUDIT_DB.prepare(
          "DELETE FROM admin_audit WHERE ts < ?",
        )
          .bind(cutoff)
          .run();
        const session = await env.AUDIT_DB.prepare(
          "DELETE FROM session_events WHERE ts < ?",
        )
          .bind(cutoff)
          .run();
        const security = await env.AUDIT_DB.prepare(
          "DELETE FROM security_events WHERE ts < ?",
        )
          .bind(cutoff)
          .run();
        const csp = await env.AUDIT_DB.prepare(
          "DELETE FROM csp_reports WHERE last_seen < ?",
        )
          .bind(cspCutoff)
          .run();
        logger.info("retention purge (audit)", {
          cutoff,
          cspCutoff,
          adminRows: admin.meta?.changes,
          sessionRows: session.meta?.changes,
          securityRows: security.meta?.changes,
          cspRows: csp.meta?.changes,
        });
      } catch (error) {
        logger.error("retention purge failed", {
          name: (error as Error)?.name,
        });
        throw error; // surface the failure on the scheduled run
      }
    }

    if (env.MAIN_DB) {
      try {
        const consent = await env.MAIN_DB.prepare(
          "DELETE FROM consent_events WHERE ts < ?",
        )
          .bind(consentCutoff)
          .run();
        const dataRequest = await env.MAIN_DB.prepare(
          "DELETE FROM data_requests WHERE submitted_at < ?",
        )
          .bind(dataRequestCutoff)
          .run();
        const erasureRequest = await env.MAIN_DB.prepare(
          "DELETE FROM erasure_requests WHERE requested_at < ?",
        )
          .bind(erasureRequestCutoff)
          .run();
        logger.info("retention purge (core)", {
          consentCutoff,
          dataRequestCutoff,
          erasureRequestCutoff,
          consentRows: consent.meta?.changes,
          dataRequestRows: dataRequest.meta?.changes,
          erasureRequestRows: erasureRequest.meta?.changes,
        });
      } catch (error) {
        logger.error("retention purge failed", {
          name: (error as Error)?.name,
        });
        throw error; // surface the failure on the scheduled run
      }

      // Erasure SLA flag (GDPR Art. 12(3) one-month deadline): once per request, flag a
      // MAIN_DB erasure_requests row whose due date is within the warning window (or
      // already breached) as a `DB` security_events row, then mark it flagged so a later
      // tick doesn't repeat it. Idempotent; the security_events insert no-ops until the
      // audit DB is bound (the flag itself still gets set).
      try {
        const { results: dueRows } = await env.MAIN_DB.prepare(
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
          if (env.AUDIT_DB) {
            await env.AUDIT_DB.prepare(
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
          }
          await env.MAIN_DB.prepare(
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
          const { results: expiredExports } = await env.MAIN_DB.prepare(
            "SELECT id, r2_key FROM export_requests WHERE expires_at < ?",
          )
            .bind(nowIso)
            .all<{ id: number; r2_key: string }>();
          for (const row of expiredExports) {
            await env.EXPORT_BUCKET.delete(row.r2_key);
            await env.MAIN_DB.prepare(
              "DELETE FROM export_requests WHERE id = ?",
            )
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
