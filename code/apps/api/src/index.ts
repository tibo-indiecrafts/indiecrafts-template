import { logger } from "@indiecrafts/logger";

/**
 * HTTP API worker — a **bare** Cloudflare Worker (no Next/OpenNext). This file is
 * the deploy **shell**; real business logic belongs in a package or module
 * (`code/packages/<name>` / `code/modules/<name>`), imported via `workspace:*` so
 * this entrypoint stays thin. Workers are apps — see
 * `docs/shared/architecture/multi-app.md`.
 *
 * Run `pnpm cf-typegen` after editing bindings in wrangler.toml — it regenerates
 * `worker-configuration.d.ts` with the typed `Env`.
 */
export interface Env {
  // Bindings declared in wrangler.toml surface here (KV / R2 / D1 / secrets).
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/health") return Response.json({ ok: true });

    logger.info("api request", { method: request.method, pathname });
    // → route to your module's logic here.
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
