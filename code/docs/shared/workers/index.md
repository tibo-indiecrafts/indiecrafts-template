---
title: "Background Workers — api · cron · workers"
description: "Three bare Cloudflare Workers live in the shared tier: code/shared/api (HTTP for non-web clients), code/shared/cron (scheduled), and code/shared/workers (que…"
status: stable
---

# Background Workers — `api` · `cron` · `workers`

Three **bare Cloudflare Workers** live in the shared tier: `code/shared/api` (the shared HTTP API for the web surfaces' servers and partners),
`code/shared/cron` (scheduled), and `code/shared/workers` (queues / background). They deploy
**separately** from the web app — each its own Worker +
`wrangler.toml`. (The web app is another Cloudflare surface: an OpenNext Worker that also runs its
co-located `/api` route handlers — unrelated to these bare slots.)

## How a Worker works

A Worker is a module exporting handlers:

```ts
export default {
  async fetch(request, env, ctx) {
    /* HTTP */
  },
  async scheduled(controller, env, ctx) {
    /* cron */
  },
} satisfies ExportedHandler<Env>;
```

- Cloudflare calls the handler that matches the event. `wrangler` bundles `src/index.ts` + its imports
  (esbuild) and deploys — **no build step** (unlike the web app's OpenNext build).
- **`env`** carries the **bindings** (KV · D1 · R2 · Queues · secrets · vars) declared in `wrangler.toml`.
  `ctx.waitUntil(p)` keeps work alive past the response.
- **Per-env** via `[env.dev|staging|prod]` blocks. `wrangler deploy --env <env>` picks one.
- **Shared logic in bricks, single-use logic inline:** logic another unit also needs goes in a
  `code/packages/<name>` / `code/modules/<name>` brick (`workspace:*`, unit-tested with plain Vitest). Logic
  only this Worker uses may stay in its `src/` (the repo's ≥2-consumer extraction rule) — the `cron` passes
  live in `code/shared/cron/src/index.ts`, tested in workerd against real D1/R2.

## Scripts (two tiers, env is an argument)

Run everything from the **repo root**. Each op is one script that takes `<env>` — never a script per env.

| Command (root)                                                                      | What it does                                                                                                                                 |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm deploy:<app>:<env>`                                                           | Deploy one worker to one env (via the shared `code/shared/scripts/deploy/worker.mjs`).                                                       |
| `pnpm deploy:all:<env>`                                                             | Deploy every Cloudflare app in the registry, in registry order (`code/shared/scripts/deploy/all.mjs`).                                       |
| `pnpm test:workers`                                                                 | Run the three workers' Vitest suites (also folded into `pnpm test`).                                                                         |
| `pnpm dev` / `pnpm --filter @indiecrafts/<app> dev`                                 | **Local** `wrangler dev` — api, cron and workers share one state (`--persist-to <repo>/.wrangler/state`); run `pnpm db:migrate:local` first. |
| `pnpm dev:remote` / `pnpm --filter @indiecrafts/<app> dev:remote`                   | `wrangler dev --remote` on the dev env's **real** bindings (writes to the shared dev D1).                                                    |
| `pnpm db:migrate:local`                                                             | Apply the D1 migrations to the local state (`code/shared/scripts/data/migrate-local.mjs`).                                                   |
| `pnpm --filter @indiecrafts/<app> tail:<env>`                                       | Live logs (`wrangler tail --env <env>`).                                                                                                     |
| `pnpm --filter @indiecrafts/<app> cf-typegen`                                       | Regenerate `worker-configuration.d.ts` (typed `Env`).                                                                                        |
| `node code/shared/scripts/infra/bindings.mjs <app> <env> <kv\|d1\|queue> <BINDING>` | Provision a binding + print the `wrangler.toml` block.                                                                                       |

`<app>` ∈ `api` · `cron` · `workers`; `<env>` ∈ `dev` · `staging` · `prod`. `worker.mjs` refuses a
staging/prod deploy while the Worker name is still the template default (`indiecrafts-<env>-shared-<app>`) —
run `pnpm project:rename <slug>` first — and asks to confirm prod (CI / `--yes` skip it). CI dry-runs every
`worker-cf` service from the registry (`apps.mjs --class worker-cf --kind service`) on each push.

**Fire a `scheduled` handler locally:** `curl "http://localhost:<port>/cdn-cgi/handler/scheduled"` (or
`/__scheduled` when started with `--test-scheduled`). Ports: api `8787` · cron `8789` · workers `8790`.

## Connectivity (bindings + secrets)

1. **Provision:** `node code/shared/scripts/infra/bindings.mjs workers prod kv JOBS_KV` — creates the resource
   (per-env name, so staging can't touch prod data) and prints the block to paste under `[env.prod]` in the
   app's `wrangler.toml`. Then `pnpm --filter @indiecrafts/shared-workers cf-typegen`.
2. **Secrets** are **not** bindings and never live in `wrangler.toml`: `wrangler secret put <NAME> --env <env>`
   (local: copy `.dev.vars.example` → `.dev.vars`).
3. **Types:** `cf-typegen` (`wrangler types`) rewrites `worker-configuration.d.ts` so `env.JOBS_KV` is typed.

## Observability

Every Cloudflare app turns on Workers Observability — logs, traces (10% sampled) and issues — in its
top-level `wrangler.toml` `[observability]` block. Every env inherits it; an `[env.<name>.observability]`
table would replace it, so there is none (`code/shared/scripts/lib/wrangler-parity.test.mjs` guards this).
Workers log through the shared `@indiecrafts/packages-shared-logger` (`console`-based, so Workers Logs
captures the output + `wrangler tail` streams it). Because the
prod console level is `silent` (no request-log noise), each Worker entry wires the **Cloudflare transport**,
gated to production, so `error`/`fatal` still reach Workers Logs:

```ts
import { addTransport } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

if (getCurrentEnvironment() === "production")
  addTransport(cloudflareTransport());
```

Live in `api` + `cron`, and in the `website` + `app` surfaces through their `instrumentation.ts`. The `workers` skeleton and `admin` log with plain `console`, which production does not silence. Full contract → [logger](/packages/shared/logger).

## Testing

Each slot runs its tests **inside the Workers runtime (workerd)** via
`@cloudflare/vitest-pool-workers` — `defineWorkersConfig` in `vitest.config.ts`, pointed at the slot's
`wrangler.toml`. The colocated `src/index.test.ts` imports `cloudflare:test`: `SELF.fetch(...)` drives the
real deployed worker, and `env` + `createExecutionContext()` invoke `scheduled` with the real bindings.
Picked up by `pnpm test` · `pnpm test:workers` · CI `verify`. Best practices: real bindings (not mocks) ·
Arrange-Act-Assert, one Act per test · assert the public interface · keep `nodejs_compat` in `wrangler.toml`
(the pool honors it).

**Version note:** the repo is on **Vitest 3.2.7**, so the pool is pinned to the **0.8.x** line (peer
`vitest 2.0.x – 3.2.x`) — **no Vitest bump was needed**, and the existing suite is untouched. When the repo
moves to Vitest 4, switch these configs to the newer `cloudflareTest()` **plugin** form (same
`{ wrangler: { configPath } }` option) and bump the pool to `0.21.x`.

## Where things live

- Worker app + colocated test + `wrangler.toml` + `package.json` → `code/shared/<app>/`.
- **Job logic** → a `code/packages/` / `code/modules/` brick once a second unit needs it; single-use logic stays in the Worker's `src/`.
- Shared deploy/connectivity scripts (`<app> <env>`) → **root `scripts/`** (one copy).
- The per-app × per-env **delegators** → root `package.json`.

## Slot roles

`api` = the shared HTTP API (audit + session sink, GDPR rights, consent, admin reads) · `cron` = time-triggered
(`[triggers].crons`) · `workers` = queue/event consumers + background. `cron` and `workers`
both expose `scheduled`; keep the roles crisp (or merge `cron` into `workers` if you never need separate
cron observability).
