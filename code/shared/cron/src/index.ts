import { logger } from "@indiecrafts/logger";

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
  // Bindings declared in wrangler.toml surface here (KV / R2 / D1 / secrets).
}

export default {
  async scheduled(
    controller: ScheduledController,
    _env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    logger.info("cron tick", {
      cron: controller.cron,
      scheduledTime: controller.scheduledTime,
    });
    // → run your module's scheduled task here (await it; log + rethrow on failure).
  },

  async fetch(): Promise<Response> {
    return Response.json({ ok: true });
  },
} satisfies ExportedHandler<Env>;
