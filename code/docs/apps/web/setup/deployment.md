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
Full model → the [`code/shared/db` brief](../../../../shared/db/.claude/CLAUDE.md).

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
   It skips `NEXT_PUBLIC_*` + unfilled placeholders. One dataset → the same tokens go to every
   env. (A one-off still works: `wrangler secret put <NAME> --env <env>`.)
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
It fans out from the registry, builds with OpenNext (next-cf) / bundles (worker-cf), runs
`wrangler deploy --env <target>`, then a **best-effort smoke test** — it curls the app's custom-domain
origin (from the domain registry via `domains:url`); no custom domain yet ⇒ skipped.

> **Deploy is gated on CI.** `deploy.yml` triggers on `workflow_run` after the
> `CI` workflow succeeds on `main` — a red CI blocks the prod deploy. As a second
> layer, make CI a **required status check**: repo **Settings → Branches → add a
> branch protection rule** for `main` → enable **Require status checks to pass
> before merging** → select the `CI` checks (`verify`, `build`, `browser-stories`,
> `csp`, `docs`, `infra`, `wrangler`). This blocks a merge, while `workflow_run`
> blocks the deploy — together nothing ships on a red CI.

Add these in the repo, scoped to GitHub **Environments** `dev` / `staging` / `prod`:

| Kind   | Name                                                                                              | Notes                                                    |
| ------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Secret | `CLOUDFLARE_API_TOKEN`                                                                            | Workers Scripts + R2 edit permissions                    |
| Secret | `CLOUDFLARE_ACCOUNT_ID`                                                                           | your account id                                          |
| Secret | `SANITY_API_READ_TOKEN`                                                                           | build-time (blog `generateStaticParams` / sitemap fetch) |
| Var    | `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET` · `NEXT_PUBLIC_SANITY_API_VERSION` | build-time                                               |
| Var    | `NEXT_PUBLIC_SITE_URL`                                                                            | prod origin (canonical URLs)                             |

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
  optimizer. See [Images](../config/images.md).
- **ISR cache** is R2 (`NEXT_INC_CACHE_R2_BUCKET`). Clearing a bucket forces a cold rebuild of cached pages.
- **Prod deploys prompt** — a hand-run `pnpm deploy:web:website:prod` asks for confirmation; `--yes` or CI (GitHub Actions sets `CI`) skips it.
- **Build stamp** — `build:cf` regenerates `src/lib/build-info.ts` (version · git sha · build time). Import `buildInfo` from `@/lib/build-info` to surface it in a footer or debug panel.
- **Docs site** (`docs/`) is static VitePress — deploy it separately (Cloudflare Pages or any static host).
