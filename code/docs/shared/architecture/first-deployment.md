# First deployment — runbook (all envs)

A step-by-step plan to take one **instance** of this template live across `dev`, `staging`, and
`prod`. This is the operational companion to [Platform deploy](./platform-deploy.md) (the model:
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

| Surface | Class | dev / staging URL | prod URL (once `domains.mjs` is set) |
| --- | --- | --- | --- |
| **website** | next-cf | `indiecrafts-<env>-web-surfaces-website.<sub>.workers.dev` | `https://example.com` (+ `www`) |
| **admin** | next-cf | `indiecrafts-<env>-web-surfaces-admin.<sub>.workers.dev` | `https://admin.example.com` |
| **app** | next-cf | `indiecrafts-<env>-web-surfaces-app.<sub>.workers.dev` | `https://app.example.com` |
| **api** | worker-cf | `indiecrafts-<env>-shared-api.<sub>.workers.dev` | `https://api.example.com` |
| **cron** | worker-cf | `indiecrafts-<env>-shared-cron.<sub>.workers.dev` | _(no route — scheduled)_ |
| **workers** | worker-cf | `indiecrafts-<env>-shared-workers.<sub>.workers.dev` | _(no route — queue/event)_ |
| **agent** | worker-cf | `indiecrafts-<env>-shared-agent.<sub>.workers.dev` | _(internal)_ |
| **storybook** | Worker (assets) | `indiecrafts-<env>-web-tools-storybook.<sub>.workers.dev` | `https://storybook.example.com` |
| **mobile** | expo | EAS build channel `<env>` (App/Play Store) | store listing |
| **hybrid** | electron | installer artifact per `<env>` | signed `.dmg` / `.exe` |

`admin` + `app` are **subdomains of the website root** so Clerk drops the session cookie on the parent
domain and all three share one login. `api`, `storybook`, and `downloads` (the hybrid installer host +
update feed, an R2 bucket) get their own subdomains (`api.<root>`, `storybook.<root>`, `downloads.<root>`).

Backing data/storage (no public URL): D1 `indiecrafts-<env>-shared-api` (audit) + `…-shared-api-core`
(core) · KV `indiecrafts-<env>-shared-api-security-counters` · R2 `…-shared-api-export` (GDPR exports)
and `…-hybrid-surfaces-main-releases` (desktop installers).

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

1. **Provision infra** (D1 `DB` + `CORE_DB`, KV, R2 `EXPORT_BUCKET`, queues):
   - `pnpm infra:shared:api:init` then `pnpm infra:shared:api:apply:dev`
   - `pnpm infra:web:website:apply:dev` · `pnpm setup:web:website:kv`
   - Wire the bindings into `wrangler.toml`: `node code/shared/scripts/infra/bindings.mjs` (paste the emitted blocks).
2. **Set secrets** (`wrangler secret put <NAME> --env dev` for api/cron): `APP_API_TOKEN`,
   `IP_HASH_SALT`, `CLERK_WEBHOOK_SECRET`, `GDPR_FINGERPRINT_SALT`, `SANITY_API_READ_TOKEN`.
   Website secrets: `pnpm secrets:sync:web:website:dev`.
3. **Migrate databases** — `pnpm db:migrate:all:dev` (dev is a real remote D1).
4. **Deploy** — `pnpm deploy:all:dev` (the 7 Cloudflare apps), or `--only all` to include native.
5. **Verify** — `curl https://indiecrafts-dev-shared-api.<sub>.workers.dev/health` → `{ok:true}`; open
   website/app/admin; sign in once; check the admin System screen. Optional: `pnpm db:backfill:profiles:dev`.

### Real-run findings (verified 2026-09-02, prefix `indiecrafts`, sub `thibault-montaufray`)

A first dev run surfaced these — fold them into the steps above:

- **D1 region is immutable — create with `--location weur`.** `wrangler d1 create indiecrafts-dev-shared-api
  --location weur` (and `…-core`). audit + core MUST share the region (the split assumes one EU region);
  a bare `d1 create` picks a nearby region (EEUR here) and can't be changed after.
- **The FIRST migration needs `--no-backup`.** `pnpm db:migrate:all:dev --no-backup`. The pre-migration R2
  snapshot has nothing to back up (empty DBs) and its `recordBackupRun` writes to `backup_runs` — a table
  the migration itself creates (chicken-and-egg). Later migrations back up normally.
- **Each next-cf app needs its ISR R2 bucket first.** `wrangler r2 bucket create
  indiecrafts-dev-web-surfaces-<app>-isr` (bound as `NEXT_INC_CACHE_R2_BUCKET`) for website/admin/app, or
  the deploy fails after the build.
- **OpenNext builds are memory-heavy.** Run with `NODE_OPTIONS=--max-old-space-size=6144` and NOT
  alongside other dev servers — concurrent servers + the build OOM'd (SIGTERM / exit 143).

> **⚠ Blocker — the next-cf surfaces (website/admin/app) do not currently deploy to Cloudflare.** Next 16's
> `src/proxy.ts` runs **Node-only** ("Proxy does not support Edge runtime"), but `@opennextjs/cloudflare`
> 1.20.x rejects Node middleware ("Node.js middleware is not currently supported"). The two are
> incompatible at these versions — no config flag bridges it. The **workers** (api·cron·workers·agent) and
> **storybook** deploy fine; the three OpenNext apps are blocked until OpenNext ships Node-middleware
> support (track `@opennextjs/cloudflare`), or the proxy is reworked. They run normally in local `pnpm dev`.

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

## Native surfaces (separate track — not Cloudflare)

Native apps don't deploy to Cloudflare. Here the `env` selects the **backend URLs baked into the
artifact** (not separate infra), each needs its own credentials, and — because signed artifacts don't
cross-build — a real release runs **one CI runner per target OS**.

### Mobile (Expo / EAS) — wired

`eas.json` ships the build/submit profiles and `app.config.ts` carries the EAS identity — you supply the
account + credentials:

1. Install `eas-cli`; `eas login` (or an `EXPO_TOKEN` CI secret); `eas init` (fills `owner` +
   `extra.eas.projectId` + the `updates.url`).
2. Profiles in `eas.json`: `development` (dev) · `preview` (staging) · `production` (prod), each baking
   its `EXPO_PUBLIC_API_URL`; the `production` submit block takes your Apple/Play store credentials.
3. `pnpm deploy:mobile:main:<env>` → `deploy/expo.mjs` (env → profile) → **EAS Build** (+ submit on prod).
4. **EAS Update** OTA is wired (`runtimeVersion` + `updates.url`, keyed by the profile `channel`).

Prerequisites (yours): an Expo account, an Apple Developer account (iOS) + Google Play account (Android).

### Hybrid (Electron) — desktop distribution, wired

**What `env` means here.** A desktop app has no per-env infrastructure. The env picks the **backend URLs
compiled into the installer** — the packaged app reads `RENDERER_URL` / `API_URL` / `AGENT_URL`
(`src/main/index.ts`) + `src/config`. So `deploy:hybrid:main:<env>` means "build an installer wired to
`<env>`'s backends."

**What's wired:**

- **Signing + notarization** (`electron-builder.yml`): hardened-runtime mac signing with
  `build-resources/entitlements.mac.plist` + `notarize: true`. Reads creds from the env; with none set a
  local build is **unsigned** (dev testing) and notarization is skipped — the daily `electron-vite dev`
  is untouched either way.
- **Publish + auto-update** (Cloudflare R2): a generic `publish` feed at `downloads.<root>/hybrid`;
  `src/main/index.ts` runs **electron-updater** on launch (packaged only, guarded).
- **CI** (`.github/workflows/deploy-native.yml`): a per-OS matrix (`macos`/`windows`/`ubuntu`) builds the
  signed installer, then uploads `release/*` to the R2 bucket
  `<prefix>-<env>-hybrid-surfaces-main-releases`.

**What you supply** (per-env GitHub Environment secrets/vars):

- **Signing** — `CSC_LINK` + `CSC_KEY_PASSWORD` (mac Developer ID / Windows cert); `APPLE_ID` +
  `APPLE_APP_SPECIFIC_PASSWORD` + `APPLE_TEAM_ID` (notarization).
- **R2** — `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` (an R2 S3 API token) + `CLOUDFLARE_ACCOUNT_ID`;
  the R2 bucket + its public `downloads.<root>` custom domain (provision once).
- `var SITE_PREFIX` (default `indiecrafts`).

Prerequisites (yours): an Apple Developer account; a Windows code-signing cert; the R2 bucket + domain.
The git remote is **GitLab** but the workflow is **GitHub Actions** — run it on a GitHub mirror, or port
the two jobs to `.gitlab-ci.yml`.

## Pre-flight checklist

- `pnpm verify` green (tsc + tests + checks) before each deploy.
- `pnpm --filter @indiecrafts/web-surfaces-website doctor:env` clean. (Gap: only `website` has a
  `doctor:env` today — `api` / `admin` / `app` have no equivalent pre-flight.)
- Never commit `.env*` (only `.env.example`); no server token under `NEXT_PUBLIC_`.

## Issue tags

- `@debt TESTING` — no cross-surface `doctor:env`; only `website` pre-flights its config.
- `@bug` — next-cf surfaces (website/admin/app) can't deploy to Cloudflare: Next 16 Node-only `proxy.ts`
  vs OpenNext-Cloudflare's edge-only middleware. Workers + storybook deploy fine.
