---
title: "Deployment (Cloudflare Workers)"
description: "The app deploys to Cloudflare Workers via OpenNext (@opennextjs/cloudflare), across three environments — dev · staging · prod — with an R2-backed incremental…"
status: stable
---

# Deployment (Cloudflare Workers)

The app deploys to **Cloudflare Workers** via [OpenNext](https://opennext.js.org/cloudflare)
(`@opennextjs/cloudflare`), across three environments — **dev · staging · prod** — with an
**R2-backed incremental cache** (so ISR / `revalidate` survive the stateless isolates).
GitHub Actions builds + deploys. Deploy scripts are **app-namespaced**: run
`pnpm deploy:web:website:<env>` from the workspace root — it delegates to the app, whose real
`deploy:<env>` scripts live in `code/projects/web/surfaces/website`. A second app gets its own `deploy:<app>:<env>`,
so the root never has an ambiguous `deploy:prod`.

Config files (all in `code/projects/web/surfaces/website/`): `wrangler.toml` (envs, bindings), `open-next.config.ts`
(R2 cache), `next.config.ts` (`initOpenNextCloudflareForDev()` for local bindings).

## Environments

| Env     | Worker                                | URL                | Robots                                                      |
| ------- | ------------------------------------- | ------------------ | ----------------------------------------------------------- |
| dev     | `<slug>-dev-web-surfaces-website`     | `*.workers.dev`    | Disallow (`NEXT_PUBLIC_ENVIRONMENT=development`)            |
| staging | `<slug>-staging-web-surfaces-website` | `*.workers.dev`    | Disallow (`…=staging`)                                      |
| prod    | `<slug>-prod-web-surfaces-website`    | your custom domain | Indexed once `NEXT_PUBLIC_SITE_URL` is set (`…=production`) |

> **Rename first — `pnpm project:rename <slug>`.** The template ships with the stem
> `indiecrafts-prod-web-surfaces-website`. `project:rename` rewrites every `wrangler.toml` resource name **and**
> `DEFAULT_SITE_PREFIX` in `@indiecrafts/packages-shared-config` in one command, then prints the R2 buckets to
> create. **Don't hand-edit the names** — Worker + R2 names are account-global, so
> `deploy:web:website:staging|prod` is **blocked** while they're still `indiecrafts-prod-web-surfaces-website` (a shared-account
> guard that stops one client overwriting another). The template's own deploy passes it with
> `ALLOW_DEFAULT_SLUG=true`.

**Databases use the same three envs, all real remote D1s.** There is no separate local tier: local
dev binds the real `dev` D1 (`pnpm dev` → `wrangler dev --env dev --remote`), so `pnpm dev` and
`db:migrate:*:dev` share the one dev database. Migrate with `db:migrate:<db>|all:<tier>` for `dev` /
`staging` / `prod` — each takes a pre-migration R2 snapshot that **aborts on failure**; a prod run
**confirms first**. Local dev: `pnpm db:migrate:all:dev` → `pnpm dev` (needs wrangler auth + network).
Full model → the [`code/shared/db` brief](/.claude/CLAUDE).

## One-time setup

0. **Rename the project** — `pnpm project:rename <slug>` (unique per client). Everything below uses
   `<slug>-prod-web-surfaces-website` in place of `indiecrafts-prod-web-surfaces-website`.
1. **Install** — `pnpm install` (resolves `@opennextjs/cloudflare` + `wrangler`, writes the lockfile).
2. **R2 buckets** — one incremental cache per env (names follow your slug):
   ```bash
   pnpm --filter @indiecrafts/web-surfaces-website exec wrangler r2 bucket create <slug>-dev-web-surfaces-website-isr
   pnpm --filter @indiecrafts/web-surfaces-website exec wrangler r2 bucket create <slug>-staging-web-surfaces-website-isr
   pnpm --filter @indiecrafts/web-surfaces-website exec wrangler r2 bucket create <slug>-prod-web-surfaces-website-isr
   ```
3. **Rate-limit KV** — the in-app form rate limiter (`@indiecrafts/packages-shared-security` `withGuard`, on the
   newsletter / waitlist / comment routes) needs a KV namespace. Run it once — it creates the namespace
   and uncomments + fills the id in `wrangler.toml` (base + every env):
   ```bash
   pnpm setup:web:website:kv
   ```
   Until this runs the limiter **fails open** (allows every request). The Cloudflare WAF rule on
   `/api/*` (Terraform) is a separate edge layer; the KV limiter is the app's own guarantee, independent
   of Terraform.
4. **Worker secrets** — per env (runtime server tokens; never in `wrangler.toml`). Fill
   `code/projects/web/surfaces/website/.dev.vars` (from `.dev.vars.example`), then **bulk-push** them:
   ```bash
   pnpm secrets:sync:web:website:dev        # reads .dev.vars → `wrangler secret bulk` on the dev Worker
   pnpm secrets:sync:web:website:staging
   pnpm secrets:sync:web:website:prod
   ```
   It skips `NEXT_PUBLIC_*` + unfilled placeholders. **The deploy auto-syncs secrets** — after
   `wrangler deploy`, `secrets.mjs` bulk-pushes every secret the app's `.dev.vars.example`
   declares, sourced from the local `.dev.vars` OR, in CI, the matching **GitHub Environment
   Secrets** — so `pnpm deploy:<app>:<env>` and a CI deploy both set them, no manual step.
   Locally one `.dev.vars` feeds whatever env you deploy; in CI each Environment holds its own
   value, so a per-env secret like `GDPR_FINGERPRINT_SALT` stays DISTINCT per env. (A one-off
   still works: `wrangler secret put <NAME> --env <env>`.)
5. **Production domain** — declare the host once in the registry (`code/shared/scripts/lib/domains.mjs`),
   then `pnpm domains:print website prod` and attach it with **ONE** of the two options it prints — never
   both (they each claim the hostname and fight). **Default: Terraform owns it** — set `domain` +
   `attach_domain = true` in `infra/cloudflare/env/prod.tfvars` and `pnpm infra:web:website:apply:prod` (the
   same layer that owns the WAF / rate-limit / SSL). Only if you deploy **without** the infra/ layer,
   uncomment the `[[env.prod.routes]]` block in `wrangler.toml` instead (and keep `attach_domain = false`).
   The deploy runner exports `NEXT_PUBLIC_SITE_URL` from the registry either way (until a real host is set,
   robots.txt serves Disallow).

## GitHub Actions (auto-deploy)

`.github/workflows/deploy.yml`: **push to `main` (after CI passes) → prod**; **Run workflow** → pick dev/staging/prod.
It fans out from the registry in two waves (the cron first — the api binds it — then the rest, in
parallel, via the reusable `deploy-app.yml`), builds with OpenNext (next-cf) / bundles (worker-cf), runs
`wrangler deploy --env <target>`, then a **best-effort smoke test** — it curls the app's custom-domain
origin (from the domain registry via `domains:url`); no custom domain yet ⇒ skipped.

> **Deploy is gated on CI.** `deploy.yml` triggers on `workflow_run` after the
> `CI` workflow succeeds on `main` — a red CI (failing `verify`, `browser-stories`,
> `browser-e2e-app`, or `csp`) blocks the prod deploy. (`browser-e2e-visual` stays advisory until
> linux visual baselines are committed.) The auth E2E needs two repo Secrets —
> `E2E_CLERK_PUBLISHABLE_KEY` + `E2E_CLERK_SECRET_KEY` (a Clerk **test** instance); without them
> the sign-in journey self-skips. Setup → [testing](/projects/web/website/setup/testing) § Auth E2E.

### Deploy security — gates per env (who + what)

Gating is **tiered** — `dev` stays fast, `staging`/`prod` are gated hard, `prod` needs an approval:

| Env       | Gate before it ships                                                                                                                              | Approval                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `dev`     | none beyond the commit hook + `build:cf` — the fast shared sandbox                                                                                | —                                               |
| `staging` | full **`pnpm verify`** (tsc · lint · tests · guards) — CI on the auto path, the `gate` job on manual dispatch, or the deploy runner on a hand-run | —                                               |
| `prod`    | same, **plus** the CI e2e suite and an un-skippable confirm                                                                                       | **required reviewer** on the `prod` Environment |

Three gates enforce that:

1. **Auto (push to `main`)** — `workflow_run` fires only on CI success (above).
2. **Manual dispatch** — a `workflow_dispatch` to `staging`/`prod` runs a `gate` job (`pnpm verify`) that `deploy` requires, so a dispatch can't ship on red; a `dev` dispatch skips it.
3. **Hand-run `pnpm deploy:*`** — the runner runs `pnpm verify` for `staging`/`prod` before `wrangler deploy` (dev + CI skip it). Prod also **confirms and no longer skips on bare `--yes`** — an intentional non-interactive prod deploy needs `--yes-prod`; `--skip-gate` is the logged hotfix escape; `--dry-run` builds without publishing.

**Required (enable these in GitHub — they are not in the repo and prod auto-deploys from `main`):**

- **Branch protection on `main`** — Settings → Branches → require status checks to pass: `verify`,
  `build`, `browser-stories`, `browser-e2e-app`, `csp`, `docs`, `infra`, `wrangler`; and **Require
  review from Code Owners** (see `.github/CODEOWNERS` — replace the placeholder team).
- **Required reviewer on the `prod` Environment** — Settings → Environments → `prod` → **Required
  reviewers**. This is the only human gate on the auto prod deploy; without it a green `main` ships prod unattended.
- **Scope the `CLOUDFLARE_API_TOKEN`** to the minimum (Workers + R2 edit) and rotate it; prefer short-lived
  OIDC when available — today it is a long-lived account-scoped token reused by deploy + rollback.

Add these in the repo, scoped to GitHub **Environments** `dev` / `staging` / `prod`:

| Kind   | Name                                                                                                                                                                                                                     | Notes                                                                                                                                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret | `CLOUDFLARE_API_TOKEN`                                                                                                                                                                                                   | Workers Scripts + R2 edit permissions                                                                                                                                                                                                                                                               |
| Secret | `CLOUDFLARE_ACCOUNT_ID`                                                                                                                                                                                                  | your account id                                                                                                                                                                                                                                                                                     |
| Secret | `SANITY_API_READ_TOKEN`                                                                                                                                                                                                  | build-time (blog `generateStaticParams` / sitemap fetch)                                                                                                                                                                                                                                            |
| Secret | `APP_API_TOKEN` · `PII_ENCRYPTION_KEY` · `IP_HASH_SALT` · `GDPR_FINGERPRINT_SALT` · `CLERK_WEBHOOK_SECRET` · `EMAIL_PREF_SECRET` · `RESEND_API_KEY` · `CLERK_SECRET_KEY` · `SANITY_API_WRITE_TOKEN` · `TURNSTILE_SECRET` | Worker runtime secrets — the deploy **auto-syncs** each to Cloudflare per env (all optional; unset → skipped). Without `CLERK_SECRET_KEY` + `SANITY_API_WRITE_TOKEN` the api's export and erasure routes answer 503. `GDPR_FINGERPRINT_SALT` DISTINCT per env; `PII_ENCRYPTION_KEY` stable per env. |
| Var    | `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET` · `NEXT_PUBLIC_SANITY_API_VERSION`                                                                                                                        | build-time                                                                                                                                                                                                                                                                                          |
| Var    | `NEXT_PUBLIC_SITE_URL`                                                                                                                                                                                                   | prod origin (canonical URLs)                                                                                                                                                                                                                                                                        |

## Preview deploys (per PR)

`.github/workflows/preview.yml` builds each PR and runs `wrangler versions upload --env dev` — a
Cloudflare **version preview URL** (isolated per push; does **not** touch the deployed worker) — then
comments the link. Same-repo PRs only (forks don't receive secrets). It reuses the `dev` Environment
secrets/vars above. Separately, CI's `build` job (`test.yml`) runs `build:cf` on every PR with the
Sanity vars/read-token, so a build/prerender break is caught before merge.

## PR checks (`test.yml`)

Every PR runs these (all **blocking** except `browser`):

| Job                 | What                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `verify`            | tsc · lint · format · WCAG contrast · unit tests · script tests · tooling gates                                             |
| `build`             | the real OpenNext `build:cf` for every affected next-cf app                                                                 |
| `infra`             | `terraform fmt -check` + `init -backend=false` + `validate` on the Cloudflare edge (creds-free; `plan`/`apply` stay manual) |
| `wrangler`          | `wrangler deploy --dry-run` for each bare worker (api · cron · workers) — validates the toml + bundle, no auth              |
| `docs`              | the VitePress build (Vue-parser + structural errors)                                                                        |
| `dependency-review` | GitHub-native — flags vulnerable / disallowed deps                                                                          |
| `secrets-scan`      | gitleaks — fails on a committed credential                                                                                  |
| `browser`           | advisory — Storybook a11y + Playwright e2e/visual                                                                           |

## Local preview + manual deploy

```bash
cp code/projects/web/surfaces/website/.dev.vars.example code/projects/web/surfaces/website/.dev.vars   # fill the tokens
pnpm preview:web:cf                                           # OpenNext build → wrangler dev
pnpm deploy:web:website:dev                                           # manual deploy (or :staging / :prod)
```

`preview:web:cf` runs on the real workerd runtime (catches CF-only issues `next dev` misses).
The root scripts delegate to `code/projects/web/surfaces/website`, whose scripts carry the same
`deploy:web:website:<env>` names (per app **and** per env), so you can run them from either place.

## Verify after the first deploy

Three things run differently on Workers than on Node — check them on the deployed URL:

- **Code blocks** — the blog `CodeBlock` highlights with **Shiki (WASM)**. Confirm a post with a
  fenced code block renders highlighted (not plain).
- **`/studio`** — the embedded Sanity Studio is a heavy client route; confirm it loads and can auth.
- **`/api/*`** — `/api/newsletter` + `/api/comments` use `@sanity/client` + Resend; `nodejs_compat`
  covers them, but submit one of each to confirm writes land.

If Shiki fails on workerd, precompute highlighting at build or lazy-load the WASM — see the OpenNext
notes on WASM modules.

## Notes

- **Images** need no image worker — `next/image` uses the Sanity CDN loader
  (`next.config.ts` `images.loaderFile`), so every image is CDN-sized, not run through Next's
  optimizer. See [Images](/projects/web/website/config/images).
- **ISR cache** is R2 (`NEXT_INC_CACHE_R2_BUCKET`). Clearing a bucket forces a cold rebuild of cached pages.
- **Prod deploys prompt + gate** — a hand-run `pnpm deploy:web:website:prod` runs `pnpm verify` first, then asks for confirmation. CI (GitHub sets `CI`) skips both; a bare `--yes` no longer skips the prompt — use `--yes-prod` for an intentional non-interactive prod deploy, `--skip-gate` to skip the verify (logged), `--dry-run` to build without publishing.
- **Build stamp** — `build:cf` regenerates `src/lib/build-info.ts` (version · git sha · build time). Import `buildInfo` from `@/lib/build-info` to surface it in a footer or debug panel.
- **Docs site** (`docs/`) is static VitePress — deploy it separately (Cloudflare Pages or any static host).
