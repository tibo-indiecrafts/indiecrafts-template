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
   *  session_events, security_events, consent_events). The purge deletes rows past
   *  retention from all four. */
  DB?: D1Database;
}

/** GDPR storage-limitation ceiling for the audit + session records (Art. 5(1)(e)). */
const RETENTION_DAYS = 90;

/** consent_events is kept far longer than the audit tables — consent is a proof
 *  record with its own retention duty (spec §13). ~3 years. */
const CONSENT_RETENTION_DAYS = 1095;

/** ISO cutoff `days` before `scheduledTime` (ms epoch). */
export function retentionCutoff(scheduledTime: number, days: number): string {
  return new Date(scheduledTime - days * 86_400_000).toISOString();
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

    // Retention purge (GDPR storage limitation): purge all four tables past their
    // ceiling from the one EU D1. admin_audit + session_events + security_events use
    // the 90-day ceiling; consent_events uses its own, much longer 3-year window,
    // because it is a consent proof record, not an audit trail. Idempotent — safe on
    // every tick. No-ops until the DB is bound.
    const cutoff = retentionCutoff(controller.scheduledTime, RETENTION_DAYS);
    const consentCutoff = retentionCutoff(
      controller.scheduledTime,
      CONSENT_RETENTION_DAYS,
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
        logger.info("retention purge", {
          cutoff,
          consentCutoff,
          adminRows: admin.meta?.changes,
          sessionRows: session.meta?.changes,
          securityRows: security.meta?.changes,
          consentRows: consent.meta?.changes,
        });
      } catch (error) {
        logger.error("retention purge failed", {
          name: (error as Error)?.name,
        });
        throw error; // surface the failure on the scheduled run
      }
    }
  },

  async fetch(): Promise<Response> {
    return Response.json({ ok: true });
  },
} satisfies ExportedHandler<Env>;
