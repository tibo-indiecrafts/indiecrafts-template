---
title: "Platform deploy — registry · runners · CI"
description: "This platform ships many apps across several platforms from one monorepo."
status: stable
---

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
{ slug: "web", pkg: "@indiecrafts/web-surfaces-website", class: "next-cf", order: 30 }
```

- **`slug`** — the id, the `code/projects/<slug>` dir, and the `deploy:<slug>:<env>` script name.
- **`pkg`** — the workspace package (`pnpm --filter` target).
- **`class`** — the platform class (below) → picks the deploy recipe.
- **`order`** — deploy order (low first: services before their consumers).
- **`requiredEnv`** (optional) — build env the deploy refuses to ship without. `admin` and `app`
  list `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: without it the app's auth gate is off.

Helpers: `deployable({ only })`, `byClass()`, `isCloudflare()`. CLI for the CI matrix:
`node code/shared/scripts/lib/apps.mjs --json [--cloudflare] [--class <class>] [--kind <kind>]`. An `apps.test.mjs` guard asserts
every row's `dir` exists, so the registry can't drift or list an orphan.

## Platform classes

| Class       | Apps                  | Ships via                          | Runner                                  |
| ----------- | --------------------- | ---------------------------------- | --------------------------------------- |
| `next-cf`   | website · admin · app | OpenNext build → Cloudflare Worker | `code/shared/scripts/deploy/next.mjs`   |
| `worker-cf` | api · cron · workers  | `wrangler deploy` (bare Worker)    | `code/shared/scripts/deploy/worker.mjs` |
| `capacitor` | mobile                | not deployed (loads `app` by URL)  | —                                       |

`next-cf` + `worker-cf` are the **Cloudflare** classes. `capacitor` is the mobile shell — no deploy
runner touches it. It loads the deployed `app` surface by URL, and a store release has no pipeline yet
(see [Mobile shell (Capacitor)](/projects/mobile/main/)).

## The deploy contract

Every Cloudflare app exposes the same script: **`deploy:<slug>:<env>`**
(`env` ∈ `dev · staging · prod`). It delegates to the shared runner for its class:

```
pnpm deploy:web:website:prod    → node ../../../../../code/shared/scripts/deploy/next.mjs website prod
pnpm deploy:shared:api:staging     → node ../../../../../code/shared/scripts/deploy/worker.mjs api staging
```

**Build-time public vars (`next-cf`).** Next bakes every `NEXT_PUBLIC_*` value into the
browser bundle at build, from `process.env` first, then the app's `.env*` files. A deploy from
a laptop would bake `.env.local`'s `localhost` URLs, so `deploy/next.mjs` exports, before the
build: every `NEXT_PUBLIC_*` key of the app's `[env.<env>.vars]`, and `NEXT_PUBLIC_API_URL` from
that block's `API_URL` (else the api host in the domain registry). A value already exported
wins. Then it **refuses to build** if any `NEXT_PUBLIC_*` the build would see still points at
`localhost` / `127.0.0.1` (`loopbackPublicVars`).

The runners share `code/shared/scripts/lib/deploy-shared.mjs` (`run` + the prod confirm) and
`code/shared/scripts/lib/project.mjs` (`assertRenamed(app, env)` — the shared-account clobber guard: refuses a
staging/prod deploy while a Worker name is still on the template prefix). Every Cloudflare resource name is
**`<prefix>-<env>-<folder-tail>`** (env-first; the folder tail — `dir` under `code/`, minus a leading `projects/`, dash-joined; e.g. `indiecrafts-prod-web-surfaces-website`, `indiecrafts-dev-shared-api`),
the one formula in `code/shared/scripts/lib/apps.mjs` `resourceName(slug, env, prefix)` — so `pnpm project:rename <slug>`
swaps only the `<prefix>` (reaching `code/shared/*`), and the guard compares each app against
`resourceName(app, "prod", TEMPLATE_PREFIX)` — one rule, every app.

### Ship several at once

```bash
pnpm deploy:all:prod                 # every Cloudflare app, in registry order
node code/shared/scripts/deploy/all.mjs dev --dry-run     # list what would deploy, run nothing
```

`deploy-all` reads the registry, resolves each app's `deploy:<slug>:<env>`, and runs them in order,
fail-fast.

## CI fan-out

CI reads the same registry — no app is hard-coded:

- **Build gate** (`test.yml`) — `turbo run build:cf --affected` builds every **affected** `next-cf`
  app (a docs-only PR builds none; a change to a shared brick builds its dependents).
- **Deploy** (`deploy.yml`) — a `discover` job emits `apps.mjs --json --cloudflare` and splits it by
  registry `order` into two waves, each a matrix in the reusable `deploy-app.yml` (deploy → smoke →
  rollback). Wave 1 (`order < 10`) is the services another app binds — the cron, which the api's `CRON`
  service binding needs, since a binding to a missing Worker fails the deploy. Wave 2 is everything
  else, in parallel. Add an app → it deploys, no workflow edit.
- **Preview** (`preview.yml`) — a matrix uploads a per-PR Cloudflare version preview for each `next-cf`
  app and comments the URL.
- **Backup** (`backup.yml`) — **hub-scoped by design**, NOT a fan-out: one Sanity dataset per tenant,
  and the hub Studio (on `web`) holds the write token + all content.

## Database tiers

The DB tiers are the same three as the deploy envs — **`dev` · `staging` · `prod`**, all real remote
Cloudflare D1s. There is no separate local tier: local dev binds the real `dev` D1 (`pnpm dev` →
`wrangler dev --env dev --remote`), so `pnpm dev` and `db:migrate:*:dev` share the one dev database.
Full model + per-DB scripts → [`code/shared/db`](/.claude/CLAUDE).

| Tier                       | `db:migrate:<db>\|all:<tier>` runs | Backed up first?                                                                                      |
| -------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `dev` · `staging` · `prod` | `--env <env> --remote`             | **yes** — a pre-migration R2 snapshot; a failed snapshot ABORTS (fail-closed; `--no-backup` opts out) |

Local flow: `pnpm db:migrate:all:dev` → `pnpm dev` (needs wrangler auth + network; the dev D1 is
shared across developers). A prod `db:migrate` / `db:backup` confirms first (`⚠ … in PRODUCTION?
[y/N]`, auto-skips under `CI` / `--yes`). Back up or migrate one DB by name (`db:migrate:main:<tier>`,
`db:backup:audit:<tier>`, …) or the whole registry with `--all`.

**Deploy-time migrations are snapshotted too.** A `worker-cf` deploy applies the migrations that worker
OWNS before shipping the new code (`scripts/deploy/worker.mjs`, expand → migrate → contract). It runs
each DB through `migrate.mjs`, so the same **fail-closed pre-migration R2 snapshot** fires first — a
deploy never alters a remote schema unbacked, and a failed snapshot aborts the deploy. This needs the
deploy environment's Cloudflare token to have R2-write + D1-export scope.

**Revert (undo a bad migration/deploy).** `node code/shared/scripts/data/restore.mjs <name>|--all <env>`
rewinds a D1 via Cloudflare **Time Travel** to any minute in the last 30 days — `--info` prints the
current restore bookmark (read-only), `--timestamp=<ISO|unix>` or `--bookmark=<id>` restores (prod
confirms; `--dry-run` previews). It is the data half of a rollback; the code half is CI's
`wrangler rollback`. For a point older than 30 days, restore from the R2 dump by hand.

## IaC (Terraform)

The Cloudflare **edge** config that `wrangler.toml` can't express (DNS, WAF, rate-limit, cache rules,
Turnstile) is Terraform, **co-located with each app and self-contained**: `code/projects/<platform>/<kind>/<app>/infra/`
holds one `main.tf` (provider + vars + all edge resources + outputs — no shared module) plus per-env
tfvars, so the app owns its whole deploy surface — `wrangler.toml` ships the Worker, `infra/` owns the
edge. Wired for `web` today; a new app **copies `code/projects/web/surfaces/website/infra/`** → `code/projects/<platform>/<kind>/<app>/infra/`
and retargets the tfvars. Runner: `node code/shared/scripts/infra/run.mjs <app> <plan|apply> <env>` (resolves
`code/projects/<platform>/<kind>/<app>/infra`).

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
