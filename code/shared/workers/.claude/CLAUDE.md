# `@indiecrafts/shared-workers` — Cloudflare Worker (background jobs)

Auto-loads when you work under `code/shared/workers/**`. Platform-wide rules live in the root
`CLAUDE.md`; this is the app's _how to code_.

A standalone Cloudflare Worker for work that isn't a request in the Next app: **cron** jobs
(digests, cleanup, cache warming), **queue** consumers, and background tasks. Deployed
**separately** from `web` — its own Worker + `wrangler.toml`, its own deploy. **No UI, no Next, no
DESIGN.md.**

**Stack:** Cloudflare Workers · wrangler · TypeScript. The skeleton logs with `console` (captured by
Workers Logs) and has **no shared deps**. When a job needs shared code, add the brick + `@types/node`
(the shared bricks are isomorphic — they guard `process`/`window`, so a Worker-only tsconfig needs
`node` + `dom` type libs, or wrap the brick behind a thin helper). `@indiecrafts/packages-shared-logger` is Workers-safe
(structured, edge), `@indiecrafts/packages-web-email` sends digests. **Never imports another app** (deps point down);
bricks are consumed as source (wrangler/esbuild bundles the TS).

## Layout

- `src/index.ts` — the entry: `fetch` (HTTP; a `/health` check today) + `scheduled` (cron per
  `wrangler.toml [triggers].crons`). Add the real job in `scheduled`; grow `fetch` into an API with a
  router if needed. `ctx.waitUntil(...)` for work that outlives a tick.
- `wrangler.toml` — per-env Workers (dev/staging/prod), Workers Logs on, a cron example, and
  commented KV/queue binding stubs. Bind what a job needs (mirror the web app's `wrangler.toml`).

## Rules

- **Run from the repo root** — `pnpm --filter @indiecrafts/shared-workers <script>`; root delegators exist
  (`deploy:shared:workers:<env>`, `test:workers`), mirroring `deploy:web:website:*`.
- **Deploy:** `deploy:shared:workers:<env>` → the shared `shared/scripts/deploy/worker.mjs workers <env>` (rename
  guard + prod-confirm + `wrangler deploy --env <env>`). **Tail:** `tail:<env>`. **Typegen:** `cf-typegen`.
- **Connectivity:** `node shared/scripts/infra/bindings.mjs workers <env> <kv|d1|queue> <BINDING>` provisions +
  prints the `wrangler.toml` block. **Secrets:** `wrangler secret put <NAME> --env <env>` — never in
  `wrangler.toml`.
- **Test:** colocated `src/index.test.ts` runs in **workerd** via `@cloudflare/vitest-pool-workers`
  (`cloudflare:test` `SELF`/`env` — health + scheduled), in `pnpm test` / `pnpm test:workers` / CI.
- **Per client:** `pnpm project:rename <slug>` rewrites the `indiecrafts-<env>-shared-workers` Worker names
  (the shared-account guard blocks staging/prod on the template default).
- **Fire `scheduled` locally:** `curl localhost:8790/cdn-cgi/handler/scheduled` (`pnpm dev` runs this Worker
  with `--remote`; for local-only, `npx wrangler dev --env dev`).
- **No cross-app imports** — share only through `code/packages/` bricks.

**Compilable skeleton — the structure + a health-check test are wired; the job isn't.** Fill in
`scheduled` (a brick once another unit needs the logic — the ≥2-consumer rule), bind what it needs. **Platform class:** `worker-cf`; it's a row in
[`scripts/lib/apps.mjs`](../../../shared/scripts/lib/apps.mjs), so CI builds + deploys it from the registry — no
per-app workflow to add. Full guide → [`code/docs/shared/workers/`](../../../docs/shared/workers/index.md); deploy
model → [`code/docs/shared/architecture/platform-deploy.md`](../../../docs/shared/architecture/platform-deploy.md).
