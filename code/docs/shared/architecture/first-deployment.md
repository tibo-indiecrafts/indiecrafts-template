---
title: "First deployment — runbook (all envs)"
description: "A step-by-step plan to take one instance of this template live across dev, staging, and prod."
status: stable
---

# First deployment — runbook (all envs)

A step-by-step plan to take one **instance** of this template live across `dev`, `staging`, and
`prod`. This is the operational companion to [Platform deploy](/shared/architecture/platform-deploy) (the model:
registry, runners, CI). Read that first for _how_ deploy works; read this for _what to do_, in order.

## Template vs instance

- **The template** is the product — the code, with `example.com` / `indiecrafts` placeholders and only
  `.env.example` (never real secrets; the `guard.mjs` hook enforces this).
- **An instance** is one deployment = a **prefix** (`project:rename`) + a **domain**
  ([`domains.mjs`](../../../code/shared/scripts/lib/domains.mjs)) + its own Cloudflare / Clerk / Sanity
  accounts. `indiecrafts.dev` is one instance (the seller's). Each buyer renames and deploys their own.

## Naming convention

Every Cloudflare resource name comes from one function —
[`resourceName(slug, env, prefix)`](../../../code/shared/scripts/lib/apps.mjs) — as
**`<prefix>-<env>-<tail>`**, where `<tail>` is the app's directory under `code/` with a leading
`projects/` stripped, dash-joined (the same tail as the npm package). A client rename swaps only
`<prefix>`. Env is always explicit — prod is `-prod-`, never bare.

## URLs per env

`dev` + `staging` publish to `*.workers.dev` (no custom domain). `prod` uses the custom domains in
`domains.mjs` (placeholders `example.com` until set — until then prod also serves on `*.workers.dev`).
`<sub>` is your account's workers.dev subdomain (one per account, fixed after the first worker deploy).

| Surface       | Class           | dev / staging URL                                          | prod URL (once `domains.mjs` is set) |
| ------------- | --------------- | ---------------------------------------------------------- | ------------------------------------ |
| **website**   | next-cf         | `indiecrafts-<env>-web-surfaces-website.<sub>.workers.dev` | `https://example.com` (+ `www`)      |
| **admin**     | next-cf         | `indiecrafts-<env>-web-surfaces-admin.<sub>.workers.dev`   | `https://admin.example.com`          |
| **app**       | next-cf         | `indiecrafts-<env>-web-surfaces-app.<sub>.workers.dev`     | `https://app.example.com`            |
| **api**       | worker-cf       | `indiecrafts-<env>-shared-api.<sub>.workers.dev`           | `https://api.example.com`            |
| **cron**      | worker-cf       | `indiecrafts-<env>-shared-cron.<sub>.workers.dev`          | _(no route — scheduled)_             |
| **workers**   | worker-cf       | `indiecrafts-<env>-shared-workers.<sub>.workers.dev`       | _(no route — queue/event)_           |
| **storybook** | Worker (assets) | `indiecrafts-<env>-web-tools-storybook.<sub>.workers.dev`  | `https://storybook.example.com`      |
| **mobile**    | capacitor       | not deployed — loads the `app` URL (`CAP_SERVER_URL`)      | not deployed (no release pipeline)   |

`admin` + `app` are **subdomains of the website root** so Clerk drops the session cookie on the parent
domain and all three share one login. `api` and `storybook` get their own subdomains (`api.<root>`,
`storybook.<root>`).

Backing data/storage (no public URL): D1 `indiecrafts-<env>-db-audit` (audit) + `…-db-main`
(main) · KV `indiecrafts-<env>-shared-api-security-counters` · R2 `…-shared-api-export` (GDPR exports).

## Phase 0 — one-time setup (before any env)

1. **Rename off placeholders** — `pnpm --filter @indiecrafts/web-surfaces-website project:rename indiecrafts`
   (sets the resource-name prefix; fixes the env-doctor's prefix/deploy drift).
2. **External accounts** (each instance supplies its own):
   - Cloudflare (wrangler OAuth or `CLOUDFLARE_API_TOKEN`).
   - Clerk — publishable + secret keys + a webhook signing secret (admin allowlist, app sign-in, `POST /v1/clerk-webhook`).
   - Sanity — project + dataset; a read token if the dataset is private.
   - Turnstile — site + secret keys (erasure form / bot protection).
3. **Set the prod domains** in [`domains.mjs`](../../../code/shared/scripts/lib/domains.mjs)
   (leave `dev`/`staging` as `null` → `*.workers.dev`).

## Phase 1 — dev (do this first — `*.workers.dev`, lowest risk)

1. **Provision infra** (D1 `AUDIT_DB` + `MAIN_DB`, KV, R2 `EXPORT_BUCKET`, queues):
   - `pnpm infra:shared:api:init` then `pnpm infra:shared:api:apply:dev`
   - `pnpm infra:web:website:apply:dev` · `pnpm setup:web:website:kv`
   - Wire the bindings into `wrangler.toml`: `node code/shared/scripts/infra/bindings.mjs` (paste the emitted blocks).
2. **Set secrets** — fill each Worker's `.dev.vars` (from its `.dev.vars.example`) then bulk-push:
   `pnpm secrets:sync:shared:api:dev` (`APP_API_TOKEN`, `IP_HASH_SALT`, `SANITY_API_READ_TOKEN`, …).
   Website: `pnpm secrets:sync:web:website:dev`. (Or one-off: `wrangler secret put <NAME> --env dev`.)
3. **Migrate databases** — `pnpm db:migrate:all:dev` (dev is a real remote D1).
4. **Deploy** — `pnpm deploy:all:dev` (the 7 Cloudflare apps).
5. **Verify** — `curl https://indiecrafts-dev-shared-api.<sub>.workers.dev/health` → `{ok:true}`; open
   website/app/admin; sign in once; check the admin System screen. Optional: `pnpm db:backfill:profiles:dev`.

### Real-run findings (verified 2026-09-02, prefix `indiecrafts`, sub `thibault-montaufray`)

A first dev run surfaced these — fold them into the steps above:

- **D1 region is immutable — create with `--location weur`.** `wrangler d1 create indiecrafts-dev-db-audit
--location weur` (and `…-db-main`). audit + main MUST share the region (the split assumes one EU region);
  a bare `d1 create` picks a nearby region (EEUR here) and can't be changed after.
- **The FIRST migration needs `--no-backup`.** `pnpm db:migrate:all:dev --no-backup`. The pre-migration R2
  snapshot has nothing to back up (empty DBs) and its `recordBackupRun` writes to `backup_runs` — a table
  the migration itself creates (chicken-and-egg). Later migrations back up normally.
- **Each next-cf app needs its ISR R2 bucket first.** `wrangler r2 bucket create
indiecrafts-dev-web-surfaces-<app>-isr` (bound as `NEXT_INC_CACHE_R2_BUCKET`) for website/admin/app, or
  the deploy fails after the build.
- **OpenNext builds are memory-heavy.** Run with `NODE_OPTIONS=--max-old-space-size=6144` and NOT
  alongside other dev servers — concurrent servers + the build OOM'd (SIGTERM / exit 143).

> **✓ Resolved — the next-cf surfaces (website/admin/app) build + deploy to Cloudflare on a version pin.**
> The trap was Next 16's `src/proxy.ts` running **Node-only** ("Proxy does not support Edge runtime") while
> older `@opennextjs/cloudflare` rejected Node middleware ("Node.js middleware is not currently supported").
> `@opennextjs/cloudflare` **1.20.6** adds **experimental** Node-middleware support, so the pin — Next
> `16.3.4` + `@opennextjs/cloudflare` `1.20.6` (both **exact**, no `^`) — builds and ships all three apps.
> `pnpm build:cf` prints `WARN Node.js middleware support is experimental in cloudflare … Use at your own
risk`; that is expected. Tracking [cloudflare/workers-sdk#13755](https://github.com/cloudflare/workers-sdk/issues/13755)
> for the stable landing.
>
> **The pin is repo-wide.** ALL workspace `next` pins are `16.3.4` — a second Next version in
> `node_modules` re-introduces a duplicate-types conflict that fails the OpenNext build. Bump Next
> everywhere in one step (`@debt MIGRATION` — the exact pin holds until #13755 stabilises Node middleware).

> **✓ The website ships with the Sanity Studio hosted separately (10 MiB Worker limit).** The embedded
> `/studio` route pulls the whole `sanity` package into OpenNext's single server Worker (~50 MB) — over
> Cloudflare's 10 MiB cap. `build:cf` sets `NEXT_PUBLIC_EMBED_STUDIO=false`, which drops the `*.studio.tsx`
> route files from the build (via `pageExtensions` in `next.config.ts`) — website then ships at ~9.8 MiB
> gzip. **Host the Studio** with `pnpm --filter @indiecrafts/web-surfaces-website studio:deploy`
> (`sanity deploy` → `<host>.sanity.studio`) and set `NEXT_PUBLIC_SANITY_STUDIO_URL` so `/studio` redirects
> there. Local `pnpm dev` keeps the embedded Studio. `admin`/`app` have no Studio and ship small.
>
> **Real dev run (2026-09-03):** all 8 deployables live on `*.thibault-montaufray.workers.dev` — website
> (gzip 9.8 MiB, Studio hosted), admin (2.9), app (4.8), storybook + the 4 workers. **Heads-up:** the
> website sits at ~9.8/10 MiB even without the Studio — watch the budget (`pnpm --filter …website size`)
> before adding heavy deps.

## Phase 2 — staging (`*.workers.dev`)

Repeat Phase 1 with `staging`: `infra:*:apply:staging` → secrets `--env staging` /
`secrets:sync:web:website:staging` → `db:migrate:all:staging` → `deploy:all:staging` → verify.

## Phase 3 — prod (custom domain — highest risk)

1. **Confirm the hosts** in `domains.mjs` + set `NEXT_PUBLIC_SITE_URL`.
2. **DNS / zone** — point the domain at Cloudflare; `pnpm infra:*:apply:prod` (routes, zone, Turnstile domains).
3. **Secrets** `--env prod` / `pnpm secrets:sync:web:website:prod`.
4. **Back up, then migrate** (prod prompts a confirm) — `pnpm db:backup:all:prod` → `pnpm db:migrate:all:prod`.
5. **Deploy** (prod confirm gate) — `pnpm deploy:all:prod`.
6. **Verify** — health on `api.<domain>`, every surface on its subdomain, one auth round-trip, the
   erasure form + Turnstile, the CSP report-only pipeline.

## Storybook (Cloudflare Worker — static assets)

Storybook is a **Cloudflare Worker** serving static assets (Workers Static Assets — no `main`, just
`[assets]`), a full `apps.mjs` registry peer (`worker-cf`, so `deploy:all` includes it). Deploy like any
worker:

```bash
pnpm deploy:web:storybook:<env>   # storybook:build → shared/scripts/deploy/worker.mjs (wrangler deploy)
```

→ the Worker `indiecrafts-<env>-web-tools-storybook` (`*.workers.dev` in dev/staging). Its **prod
subdomain** (`storybook.<root>`) is a normal **Worker route** in `domains.mjs` alongside
`admin`/`app`/`api` — paste the `[[env.prod.routes]]` block from
`node code/shared/scripts/lib/domains.mjs print storybook prod` into its `wrangler.toml` once the host is set.

## Mobile shell (separate track — not Cloudflare)

The Capacitor shell does not deploy to Cloudflare, and no deploy runner touches it. It loads the
deployed `app` surface by URL (`CAP_SERVER_URL`), so deploying `app` updates the shell's content.
A store release has no pipeline yet. Setup + run → [Mobile shell (Capacitor)](/projects/mobile/main/).

## Pre-flight checklist

- `pnpm verify` green (tsc + tests + checks) before each deploy.
- `pnpm --filter @indiecrafts/web-surfaces-website doctor:env` clean. (Gap: only `website` has a
  `doctor:env` today — `api` / `admin` / `app` have no equivalent pre-flight.)
- Never commit `.env*` (only `.env.example`); no server token under `NEXT_PUBLIC_`.

## Issue tags

- `@debt TESTING` — no cross-surface `doctor:env`; only `website` pre-flights its config.
- `@debt MIGRATION` — next-cf deploy relies on `@opennextjs/cloudflare` 1.20.6's **experimental** Node
  middleware (both Next + OpenNext pinned exact). Ceiling: revisit the exact pin when
  `cloudflare/workers-sdk#13755` makes it stable.
