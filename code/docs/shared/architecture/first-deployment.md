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
| **storybook** | pages | `https://indiecrafts-<env>-web-tools-storybook.pages.dev` | same (Pages, `*.pages.dev`) |
| **mobile** | expo | EAS build channel `<env>` (App/Play Store) | store listing |
| **hybrid** | electron | installer artifact per `<env>` | signed `.dmg` / `.exe` |

`admin` + `app` are **subdomains of the website root** so Clerk drops the session cookie on the parent
domain and all three share one login. `api` gets its own subdomain so clients call `https://api.<root>`.

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

## Storybook (Cloudflare Pages)

Storybook is a static gallery, not in the app registry, so it deploys to **Pages** by hand (no
`deploy:storybook` script yet — worth adding). The project name follows the same convention
(`indiecrafts-<env>-web-tools-storybook`):

```bash
pnpm --filter @indiecrafts/web-tools-storybook storybook:build
pnpm --filter @indiecrafts/shared-api exec wrangler pages deploy \
  code/projects/web/tools/storybook/storybook-static \
  --project-name=indiecrafts-<env>-web-tools-storybook --branch=main
```

→ `https://indiecrafts-<env>-web-tools-storybook.pages.dev`.

## Native surfaces (separate track — not Cloudflare)

- **Mobile (Expo/EAS)** — install `eas-cli`, `eas login` (or `EXPO_TOKEN`), configure the EAS project,
  then `pnpm deploy:mobile:main:<env>`.
- **Hybrid (Electron)** — set up code-signing + notarization (Apple / Windows certs), then
  `pnpm deploy:hybrid:main:<env>` for a shippable installer.

## Pre-flight checklist

- `pnpm verify` green (tsc + tests + checks) before each deploy.
- `pnpm --filter @indiecrafts/web-surfaces-website doctor:env` clean. (Gap: only `website` has a
  `doctor:env` today — `api` / `admin` / `app` have no equivalent pre-flight.)
- Never commit `.env*` (only `.env.example`); no server token under `NEXT_PUBLIC_`.

## Issue tags

- `@debt TESTING` — no cross-surface `doctor:env`; only `website` pre-flights its config.
- `@debt DEPRECATED` — Storybook has no `deploy:<slug>:<env>` script; its Pages deploy is manual.
