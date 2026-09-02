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
| **storybook** | pages | `https://indiecrafts-<env>-web-tools-storybook.pages.dev` | `https://storybook.example.com` |
| **mobile** | expo | EAS build channel `<env>` (App/Play Store) | store listing |
| **hybrid** | electron | installer artifact per `<env>` | signed `.dmg` / `.exe` |

`admin` + `app` are **subdomains of the website root** so Clerk drops the session cookie on the parent
domain and all three share one login. `api` and `storybook` get their own subdomains (`api.<root>`,
`storybook.<root>`).

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

Storybook is a static gallery on **Cloudflare Pages** (not a Worker, and not an `apps.mjs` registry row).
It has its own scripted deploy following the same naming convention:

```bash
pnpm deploy:web:storybook:<env>   # → shared/scripts/deploy/pages.mjs
```

The runner builds `storybook-static` and `wrangler pages deploy`s it to the project
`indiecrafts-<env>-web-tools-storybook` → `https://indiecrafts-<env>-web-tools-storybook.pages.dev`.
Its **prod subdomain** (`storybook.<root>`) lives in `domains.mjs` alongside `admin`/`app`/`api`; because
Pages custom domains attach to the project (not a wrangler route), point a DNS `CNAME` at the project (or
add it in the dashboard → Custom domains) once — the runner prints the domain to attach.

## Native surfaces (separate track — not Cloudflare)

Native apps don't deploy to Cloudflare. Here the `env` selects the **backend URLs baked into the
artifact** (not separate infra), each needs its own credentials, and — because signed artifacts don't
cross-build — a real release runs **one CI runner per target OS**.

### Mobile (Expo / EAS)

1. Install `eas-cli`; authenticate with `eas login` or an `EXPO_TOKEN` CI secret.
2. Define build profiles per env in `eas.json` (`dev` / `staging` / `prod` → the matching `EXPO_PUBLIC_API_URL`).
3. `pnpm deploy:mobile:main:<env>` → `deploy/expo.mjs` (env → EAS profile) → **EAS Build** → store submit.
4. Ship JS-only changes over the air with **EAS Update** (no store round-trip).

Prerequisites: an Expo account, an Apple Developer account (iOS) + Google Play account (Android).

### Hybrid (Electron) — desktop distribution

**What `env` means here.** A desktop app has no per-env infrastructure. The env picks the **backend URLs
compiled into the installer** — the packaged app reads `RENDERER_URL` / `API_URL` / `AGENT_URL`
(`src/main/index.ts`) + `src/config`. A `prod` installer talks to the prod api/website; `dev`/`staging`
to theirs. So `deploy:hybrid:main:<env>` means "build an installer wired to `<env>`'s backends."

**What works today.** `pnpm deploy:hybrid:main:<env>` → `deploy/electron.mjs` runs `dist:<os>`
(`electron-vite build && electron-builder --<os>`) → an **unsigned** installer in `release/`
(`.dmg` / `.exe` nsis / `.AppImage`). Runnable for internal testing; not distributable to the public.

**What a complete distribution adds** (each an owned follow-up):

1. **Per-OS CI matrix.** electron-builder can't cross-build signed artifacts, so release from
   `macos-latest` (→ `.dmg`), `windows-latest` (→ `.exe`), `ubuntu-latest` (→ `.AppImage`). The runner
   already selects `dist:mac|win|linux` by `process.platform`.
2. **Code signing.** macOS: an Apple **Developer ID Application** cert (electron-builder reads
   `CSC_LINK` + `CSC_KEY_PASSWORD`). Windows: an OV/EV cert or Azure Trusted Signing (`CSC_LINK` +
   `CSC_KEY_PASSWORD`). Linux AppImage needs no signing.
3. **Notarization (macOS).** Gatekeeper blocks an un-notarized app. Add `mac.notarize` to
   `electron-builder.yml` with an Apple API key (or `APPLE_ID` + `APPLE_APP_SPECIFIC_PASSWORD` +
   `APPLE_TEAM_ID`).
4. **Distribution / hosting.** Add a **`publish`** block to `electron-builder.yml` — GitHub Releases,
   S3, or a **generic** host (e.g. Cloudflare **R2** + a download link on the website). There is **no
   `publish` block today**.
5. **Auto-update.** Wire **electron-updater** against the same `publish` feed so installed apps
   self-update, and check the feed on launch.

**Config gaps in `electron-builder.yml`.** Present: `appId dev.indiecrafts.hybrid`, `productName
indiecrafts`, targets dmg/nsis/AppImage, output `release/`, files `out/**`. Missing: a `publish` block,
`mac.notarize`, and per-OS signing identities. Also **rename `appId` + `productName` per client** — the
yml flags this as a `project:rename` extension.

**Prerequisites (per publisher).** Apple Developer account (mac signing + notarization); a Windows
code-signing cert; a release host (R2 / GitHub); all certs as CI secrets.

## Pre-flight checklist

- `pnpm verify` green (tsc + tests + checks) before each deploy.
- `pnpm --filter @indiecrafts/web-surfaces-website doctor:env` clean. (Gap: only `website` has a
  `doctor:env` today — `api` / `admin` / `app` have no equivalent pre-flight.)
- Never commit `.env*` (only `.env.example`); no server token under `NEXT_PUBLIC_`.

## Issue tags

- `@debt TESTING` — no cross-surface `doctor:env`; only `website` pre-flights its config.
