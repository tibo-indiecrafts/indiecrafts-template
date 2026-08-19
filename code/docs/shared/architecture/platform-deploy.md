# Platform deploy — registry · runners · CI

This platform ships **many apps across several platforms** from one monorepo. The deploy layer is
built on three ideas:

- **Per-app owns its manifest** — each app carries its own `wrangler.toml` / build config,
  `.env.example`, briefs, and a thin `deploy:<slug>:<env>` script.
- **Shared owns the machinery** — the deploy runners, the clobber guard, and the app registry live
  once, in `scripts/`; no per-app copy-paste.
- **The registry is the source of truth** — one file lists every app; `deploy-all`, each runner,
  `project-rename`, and CI all read it. Adding an app is a one-row change.

## The registry

[`code/shared/scripts/lib/apps.mjs`](../../../code/shared/scripts/lib/apps.mjs) — one row per app:

```js
{ slug: "web", pkg: "@indiecrafts/website", class: "next-cf", order: 30 }
```

- **`slug`** — the id, the `code/projects/<slug>` dir, and the `deploy:<slug>:<env>` script name.
- **`pkg`** — the workspace package (`pnpm --filter` target).
- **`class`** — the platform class (below) → picks the deploy recipe.
- **`order`** — deploy order (low first: services before their consumers).

Helpers: `deployable({ only })`, `byClass()`, `isCloudflare()`. CLI for the CI matrix:
`node code/shared/scripts/lib/apps.mjs --json [--cloudflare] [--class <class>]`. An `apps.test.mjs` guard asserts
every row has a matching `code/projects/<slug>` dir, so the registry can't drift or list an orphan.

## Platform classes

| Class       | Apps                 | Ships via                            | Runner                                    |
| ----------- | -------------------- | ------------------------------------ | ----------------------------------------- |
| `next-cf`   | website · admin      | OpenNext build → Cloudflare Worker   | `code/shared/scripts/deploy/next.mjs`     |
| `worker-cf` | api · cron · workers | `wrangler deploy` (bare Worker)      | `code/shared/scripts/deploy/worker.mjs`   |
| `expo`      | mobile               | EAS build (+ submit)                 | `code/shared/scripts/deploy/expo.mjs`     |
| `electron`  | hybrid               | electron-builder (host-OS installer) | `code/shared/scripts/deploy/electron.mjs` |

`next-cf` + `worker-cf` are the **Cloudflare** classes. `expo` + `electron` are native — they need
their own credentials (EAS / Apple / signing) and are **structure-first stubs** today: the command +
guards are wired so they follow the same contract, but full store/signing pipelines are a follow-up
(see each app's README).

## The deploy contract

Every app — Cloudflare or native — exposes the same script: **`deploy:<slug>:<env>`**
(`env` ∈ `dev · staging · prod`). It delegates to the shared runner for its class:

```
pnpm deploy:website:prod    → node ../../../../../code/shared/scripts/deploy/next.mjs website prod
pnpm deploy:api:staging     → node ../../../../../code/shared/scripts/deploy/worker.mjs api staging
pnpm deploy:mobile:prod     → node ../../../../../code/shared/scripts/deploy/expo.mjs prod
```

The runners share `code/shared/scripts/lib/deploy-shared.mjs` (`run` + the prod confirm) and
`code/shared/scripts/lib/project.mjs` (`assertRenamed(app, env)` — the shared-account clobber guard: refuses a
staging/prod deploy while the Worker names are still the template default `indiecrafts-<app>`; run
`pnpm project:rename <slug>` first).

### Ship several at once

```bash
pnpm deploy:all:prod                 # every Cloudflare app, in registry order (default)
node code/shared/scripts/deploy/all.mjs prod --only all   # + native apps (expo/electron)
node code/shared/scripts/deploy/all.mjs dev --dry-run     # list what would deploy, run nothing
```

`deploy-all` reads the registry, resolves each app's `deploy:<slug>:<env>`, and runs them in order,
fail-fast.

## CI fan-out

CI reads the same registry — no app is hard-coded:

- **Build gate** (`test.yml`) — `turbo run build:cf --affected` builds every **affected** `next-cf`
  app (a docs-only PR builds none; a change to a shared brick builds its dependents).
- **Deploy** (`deploy.yml`) — a `discover` job emits `apps.mjs --json --cloudflare`; a matrix deploys
  each CF app to the target env (parallel — CF workers are independent). Add an app → it deploys, no
  workflow edit.
- **Preview** (`preview.yml`) — a matrix uploads a per-PR Cloudflare version preview for each `next-cf`
  app and comments the URL.
- **Backup** (`backup.yml`) — **hub-scoped by design**, NOT a fan-out: one Sanity dataset per tenant,
  and the hub Studio (on `web`) holds the write token + all content.

## IaC (Terraform)

The Cloudflare **edge** config that `wrangler.toml` can't express (DNS, WAF, rate-limit, cache rules,
Turnstile) is Terraform, **co-located with each app and self-contained**: `code/projects/<app>/infra/`
holds one `main.tf` (provider + vars + all edge resources + outputs — no shared module) plus per-env
tfvars, so the app owns its whole deploy surface — `wrangler.toml` ships the Worker, `infra/` owns the
edge. Wired for `web` today; a new app **copies `code/projects/web/surfaces/website/infra/`** → `code/projects/<app>/infra/`
and retargets the tfvars. Runner: `node code/shared/scripts/infra/run.mjs <app> <plan|apply> <env>` (resolves
`code/projects/<app>/infra`).

## Adding an app

1. Scaffold `code/projects/<slug>/` (its framework's init) with a `package.json` (`@indiecrafts/<slug>`).
2. Add a **row** to `code/shared/scripts/lib/apps.mjs` (slug · pkg · class · order).
3. Add its `deploy:<slug>:<env>` scripts delegating to the shared runner for its class, and a root
   delegator in `package.json`.
4. Wire the shared bricks like `web` (transpilePackages · workspace deps · tsconfig paths · a
   `@source` line if it renders Tailwind).

CI (build · deploy · preview) picks it up automatically from the registry.

## One client = one deploy

There is **no runtime multi-tenancy**. A client site is its own deploy (own domain · Sanity dataset ·
env), configured at build time via `pnpm project:rename <slug>` (which rewrites the resource-name
prefix across every app's `wrangler.toml` + the tfvars). Isolation is separate deploys, not a
request-time tenant switch.
