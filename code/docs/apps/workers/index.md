# Background Workers — `api` · `cron` · `workers` · `agent`

Four **bare Cloudflare Workers** live in the shared tier: `code/shared/api` (HTTP for non-web clients),
`code/shared/cron` (scheduled), `code/shared/workers` (queues / background), and `code/shared/agent` (the
AI agent — `POST /v1/agent/:name`, called cross-origin by the web and by bearer from mobile/hybrid; see
[agent](../../packages/agent)). They deploy **separately** from the web app — each its own Worker +
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
- **Thin shell, logic in bricks:** keep `src/index.ts` a ~40-line shell (routing + binding use); put the real
  job in a `code/packages/<name>` / `code/modules/<name>` brick (`workspace:*`). That brick is unit-tested
  with plain Vitest; the Worker test only covers the handler wiring. This is what scales — Workers multiply as
  shells, the testable logic stays shared.

## Scripts (two tiers, env is an argument)

Run everything from the **repo root**. Each op is one script that takes `<env>` — never a script per env.

| Command (root)                                                                      | What it does                                                                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm deploy:<app>:<env>`                                                           | Deploy one worker to one env (via the shared `code/shared/scripts/deploy/worker.mjs`).                  |
| `pnpm deploy:all:<env>`                                                             | Deploy every `code/projects/*` with a `wrangler.toml`, in order (`code/shared/scripts/deploy/all.mjs`). |
| `pnpm test:workers`                                                                 | Run the three workers' Vitest suites (also folded into `pnpm test`).                                    |
| `pnpm --filter @indiecrafts/<app> dev`                                              | Local `wrangler dev` (Miniflare/workerd, local storage).                                                |
| `pnpm --filter @indiecrafts/<app> tail:<env>`                                       | Live logs (`wrangler tail --env <env>`).                                                                |
| `pnpm --filter @indiecrafts/<app> cf-typegen`                                       | Regenerate `worker-configuration.d.ts` (typed `Env`).                                                   |
| `node code/shared/scripts/infra/bindings.mjs <app> <env> <kv\|d1\|queue> <BINDING>` | Provision a binding + print the `wrangler.toml` block.                                                  |

`<app>` ∈ `api` · `cron` · `workers` · `agent`; `<env>` ∈ `dev` · `staging` · `prod`. `deploy-worker.mjs` refuses a
staging/prod deploy while the Worker name is still the template default (`indiecrafts-<app>-…`) — run
`pnpm project:rename <slug>` first — and asks to confirm prod (CI / `--yes` skip it).

## Connectivity (bindings + secrets)

1. **Provision:** `node code/shared/scripts/infra/bindings.mjs workers prod kv JOBS_KV` — creates the resource
   (per-env name, so staging can't touch prod data) and prints the block to paste under `[env.prod]` in the
   app's `wrangler.toml`. Then `pnpm --filter @indiecrafts/shared-workers cf-typegen`.
2. **Secrets** are **not** bindings and never live in `wrangler.toml`: `wrangler secret put <NAME> --env <env>`
   (local: copy `.dev.vars.example` → `.dev.vars`).
3. **Types:** `cf-typegen` (`wrangler types`) rewrites `worker-configuration.d.ts` so `env.JOBS_KV` is typed.

## Observability

Workers log through the shared `@indiecrafts/packages-shared-logger` (`console`-based; `[observability.logs]`
is on in each `wrangler.toml`, so Workers Logs captures the output + `wrangler tail` streams it). Because the
prod console level is `silent` (no request-log noise), each Worker entry wires the **Cloudflare transport**,
gated to production, so `error`/`fatal` still reach Workers Logs:

```ts
import { addTransport } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

if (getCurrentEnvironment() === "production")
  addTransport(cloudflareTransport());
```

Live in `api`, `cron` + `agent` today (`workers` doesn't wire it yet). Full contract → [logger](../../packages/logger).

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
- The **job logic** → a `code/packages/` / `code/modules/` brick (thin-shell rule).
- Shared deploy/connectivity scripts (`<app> <env>`) → **root `scripts/`** (one copy).
- The per-app × per-env **delegators** → root `package.json`.

## Slot roles

`api` = HTTP for non-web clients (audit + session sink `POST /v1/events`) · `cron` = time-triggered
(`[triggers].crons`) · `workers` = queue/event consumers + background · `agent` = the AI agent
(`POST /v1/agent/:name`, dual-mode guard: browser Origin+Turnstile / native bearer). `cron` and `workers`
both expose `scheduled`; keep the roles crisp (or merge `cron` into `workers` if you never need separate
cron observability).
