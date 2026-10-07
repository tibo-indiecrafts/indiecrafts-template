/**
 * `@indiecrafts/shared-workers` — a standalone Cloudflare Worker for work that isn't a
 * request in the Next app: cron jobs, queue consumers, background tasks. Deployed
 * separately from `web` (its own Worker + `wrangler.toml`).
 *
 * Logs through `@indiecrafts/packages-shared-logger` (structured, edge-safe). When a real
 * job needs more shared code, add its brick (e.g. `@indiecrafts/packages-web-email` for digests).
 */
import { logger } from "@indiecrafts/packages-shared-logger";

const log = logger.child("workers");

/** Bindings + vars available to the Worker — extend as you add KV/R2/D1/queues. */
export interface Env {
  /** Set per env in `wrangler.toml [env.*.vars]` — drives gating. */
  NEXT_PUBLIC_ENVIRONMENT?: string;
}

export default {
  /**
   * HTTP entry. A `/health` probe today; add routes (or a router) as this grows into
   * an API. Everything else 404s.
   */
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/health") {
      return Response.json({
        ok: true,
        env: env.NEXT_PUBLIC_ENVIRONMENT ?? "unknown",
      });
    }
    return new Response("Not found", { status: 404 });
  },

  /**
   * Cron entry — fires on the schedule(s) in `wrangler.toml [triggers].crons`. An
   * intentional stub: the platform's jobs (retention, SLA, backups) live in `cron`. This
   * slot is for a client's own background work (digests, cache warming, queue draining);
   * until then the tick only logs, which proves the trigger is wired. Use
   * `ctx.waitUntil(...)` for work that outlives the tick.
   */
  async scheduled(event): Promise<void> {
    log.info("scheduled tick", { cron: event.cron });
  },
} satisfies ExportedHandler<Env>;
