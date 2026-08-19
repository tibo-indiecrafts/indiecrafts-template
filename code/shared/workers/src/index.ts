/**
 * `@indiecrafts/workers` — a standalone Cloudflare Worker for work that isn't a
 * request in the Next app: cron jobs, queue consumers, background tasks. Deployed
 * separately from `web` (its own Worker + `wrangler.toml`).
 *
 * The skeleton logs with `console` (captured by Workers Logs). When a real job needs
 * shared code, add the brick + `@types/node` (e.g. `@indiecrafts/logger` is
 * isomorphic — structured, edge-safe — or `@indiecrafts/email` to send digests).
 */

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
   * Cron entry — fires on the schedule(s) in `wrangler.toml [triggers].crons`. Put
   * background work here: digest emails, Sanity cleanup, cache warming, queue draining.
   * Use `ctx.waitUntil(...)` for work that outlives the tick.
   */
  async scheduled(event, env, ctx): Promise<void> {
    console.info(
      JSON.stringify({
        scope: "workers",
        msg: "scheduled tick",
        cron: event.cron,
      }),
    );
    // TODO: replace with a real job.
    void env;
    void ctx;
  },
} satisfies ExportedHandler<Env>;
