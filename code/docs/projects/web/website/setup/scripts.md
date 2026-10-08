---
title: "CLI scripts & verification"
description: "Every pnpm script, every standalone file in code/projects/web/surfaces/website/scripts/, and the Git hook that runs automatically."
status: stable
---

# CLI scripts & verification

Every `pnpm` script, every standalone file in `code/projects/web/surfaces/website/scripts/`, and the Git hook that runs automatically. Reach here when you're unsure which command does what, or which token a data script needs. Run everything from the **repo root** (turbo delegates to `@indiecrafts/web-surfaces-website`).

---

## 1. `package.json` scripts

Run with `pnpm <name>`.

### Where a script lives (root vs app)

Scripts sit at **two tiers**, split by blast radius — the same script is never duplicated across them:

- **App tier** (`code/projects/web/surfaces/website/scripts/` + `code/projects/web/surfaces/website/package.json`) — anything that touches **one
  app's** dataset, Cloudflare resources, env, or tokens (`seed`, `backup-*`, `deploy`, `setup:web:website:kv`,
  `check-contrast`, `doctor-env`). Travels with the app; can't reach a sibling app.
- **Root tier** (`/scripts` + root `package.json`) — anything **repo-wide**: governance
  (`tags-report`, `scan-placeholders`), git/toolchain (`clean`, `worktree`), and the
  **multi-app dispatcher** (`infra.mjs web …`). Governed — shellcheck + `node:test` (§4).

The root **re-exposes** app scripts through `pnpm --filter @indiecrafts/web-surfaces-website …`, so you run everything
from the root. **Naming rule:** a script whose name has an axis a second app would collide on carries
`:<app>:` — `deploy:web:website:prod`, `infra:web:website:plan:prod`, `secrets:sync:web:website:prod` (app #2 gets
`deploy:web:admin:prod`, no clash). Single-instance, dev-ergonomic aliases stay short (`seed`,
`doctor:web:website:env`) on purpose — the `:web:` façade is reserved for the env/infra scripts that need it.
**Docs commands** (`docs`, `docs:build`, `docs:install`) live **only at root** — `code/docs`
is an npm-isolated project (its own lockfile), not an app concern.

### Dev & build

| Script  | Command                | What it does                                                                                                     |
| ------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `dev`   | `next dev --turbopack` | Dev server at `http://localhost:3000` (Turbopack). Your default while working.                                   |
| `build` | `next build`           | Production build — prerenders every static route × locale. Run before deploy or to reproduce a CI build failure. |
| `start` | `next start`           | Serves the output of `pnpm build`. For smoke-testing a production build locally.                                 |

### Quality gates

| Script             | Command                                                            | What it does                                                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc`              | `tsc --noEmit`                                                     | Strict typecheck, no output.                                                                                                                                                                                                                                                             |
| `lint`             | `eslint`                                                           | ESLint over the repo. Zero errors expected.                                                                                                                                                                                                                                              |
| `lint:fix`         | `eslint --fix`                                                     | Same, auto-fixing what it can.                                                                                                                                                                                                                                                           |
| `format`           | `prettier --write .`                                               | Formats the tree in place.                                                                                                                                                                                                                                                               |
| `format:check`     | `prettier --check .`                                               | Verifies formatting without writing. What CI runs.                                                                                                                                                                                                                                       |
| `verify:contrast`  | `node scripts/check-contrast.mjs`                                  | WCAG AA contrast on the theme tokens. Run after any colour change.                                                                                                                                                                                                                       |
| `doctor`           | `npx react-doctor@latest --verbose`                                | Full React Doctor scan (security / performance / correctness / architecture).                                                                                                                                                                                                            |
| `doctor:changed`   | `npx react-doctor@latest --verbose --scope changed --base main`    | React Doctor scoped to **only new issues vs `main`** — what `verify` runs.                                                                                                                                                                                                               |
| `lint:scripts`     | `npx shellcheck --severity=warning scripts/*.sh`                   | Shellcheck the repo-root shell scripts (warning+). In root `verify` + CI.                                                                                                                                                                                                                |
| `test:scripts`     | `node --test scripts/*.test.mjs`                                   | Node's built-in test runner over the tooling-script tests (`scripts/*.test.mjs`). In root `verify` + CI.                                                                                                                                                                                 |
| `check:tags`       | `node code/shared/scripts/checks/tags-report.mjs --check`          | Validates the issue-tag vocabulary (see the dev framework's Issue tags). In root `verify` + CI.                                                                                                                                                                                          |
| `check:api-guards` | `node code/shared/scripts/checks/api-guards.mjs`                   | Fails if a public **mutating** route (`src/app/**/route.ts` exporting POST/PUT/PATCH/DELETE) doesn't wrap `withGuard` or isn't allowlisted with a reason. In root `verify` + CI. See [API security limits](/projects/web/website/config/security-limits).                                |
| `check:tasks`      | `node code/shared/scripts/checks/tasks-sync.mjs --check`           | Fails if `.vscode/tasks.json` drifts from the root `package.json` scripts — every root script must have a Run Task entry. Curated **per-app** tasks (label `<app>: <name>`, e.g. `website: verify:contrast`) are allowed. In root `verify` + CI; the change-hygiene hook also nudges it. |
| `shadscan`         | `pnpm dlx @shadscan/cli`                                           | shadcn/ui fundamentals audit, scores UX 0–100 (62 rules). Manual, not in `verify`. `--prompt` for an AI fix-plan; `--json --fail-under <n>` for CI.                                                                                                                                      |
| `verify:quick`     | `pnpm tsc && pnpm lint`                                            | Typecheck + full-repo lint. A **manual pre-PR check** (the commit hook already runs `tsc`; this adds whole-repo lint).                                                                                                                                                                   |
| `verify`           | `tsc && lint && format:check && verify:contrast && doctor:changed` | The full local gate: types + lint + format + contrast + React Doctor (changed code). Run before opening a PR.                                                                                                                                                                            |

### Fast local checks (memory-optimized)

The harness keeps the TypeScript **type graph** — the memory-intensive part — off the hot path: lint is
type-info-free (guarded by `check:lint-no-types`), `tsc` no longer builds upstream first (turbo `tsc` lost
`dependsOn:["^build"]`, so `pnpm tsc` is ~0.4 s cached vs ~2 min), and the memory-heavy turbo tasks are
capped at `--concurrency=50%`. Two optional faster tools:

| Script                  | Runs                                                    | Use                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc:fast`              | `tsgo --noEmit` (TS 7 Go port) on the 6 core surfaces   | ~10× faster, ~half the memory of `tsc` — the local inner loop. CI + the commit hook keep the real `tsc` (tsgo is a preview; storybook + mobile stay on `tsc` for their test globals).                                                                                                                                                   |
| `oxlint` / `oxlint:fix` | `oxlint code` (Rust, AST-only)                          | Fast repo-wide lint (~3 s), covers admin/app/storybook too. **Advisory** today; graduate to a gate once its pre-existing findings are triaged.                                                                                                                                                                                          |
| `check:lint-no-types`   | scans the lint configs                                  | In `verify` — fails if a config re-introduces the type graph into linting.                                                                                                                                                                                                                                                              |
| `check:doc-coverage`    | `code/shared/scripts/checks/doc-coverage.mjs`           | In `verify` — asserts every code unit **and** every source file has a `code/docs/` page (unit page + a `reference/` page). Fails on any undocumented file.                                                                                                                                                                              |
| `check:claude-md`       | `code/shared/scripts/checks/claude-md.mjs`              | In `verify` — the brief + rule guard (`CLAUDE.md` · `AGENTS.md` · `.claude/rules/**`): every cited `pnpm` command resolves, no file passes 200 lines counting its `@imports`, no dead `@import` or relative link, no nested `agents/`/`commands/`; warns past the 90-line map budget. Also a Stop hook. Contract → `.claude/README.md`. |
| `check:infra`           | `code/shared/scripts/checks/infra.mjs`                  | In `verify` + the CI `infra` job — every Cloudflare Terraform stack in the infra registry: `terraform fmt`, `validate` (warnings fail) and a `plan` per env's tfvars against a mocked provider (creds-free, in a temp copy). Requires each stack's committed `.terraform.lock.hcl`. Skips locally without `terraform`; required in CI.  |
| `infra:all`             | `code/shared/scripts/infra/all.mjs <plan\|apply> <env>` | Terraform for **every** Cloudflare stack in registry order. Preflights all tfvars + the token first (nothing reaches Cloudflare while a value is missing); `apply` asks `yes` per stack.                                                                                                                                                |

The `build` scripts use `next build --turbopack` (Next 16, ~2–5× faster); the Cloudflare deploy build
(`build:cf`, OpenNext) is unchanged. Remote-dev has its own runners — see
[environment → Remote dev](/projects/web/website/setup/environment#remote-dev-the-workers-run-on-cloudflare-s-edge)
(`dev:doctor` · `dev:setup` · `dev:refresh:dev`).

::: tip CI mirrors this
`pnpm verify` is the local gate. `.github/workflows/test.yml` (CI) runs the same checks as blocking jobs — **verify** (tsc · lint · format · contrast · tests · tooling gates) + **build** (`build:cf`, the real OpenNext Worker build — catches prerender + CF-only breakage) + **browser-stories** (every Storybook story = a component + a11y test; `pnpm test:stories`) — plus advisory **browser-e2e** (Playwright visual-regression + app e2e, until linux baselines land) and a **docs** build + **dependency-review**. React Doctor is the advisory `react-doctor.yml`. `pnpm verify` itself skips `build:cf` and the browser jobs (they need a browser); push a PR (or run `pnpm --filter @indiecrafts/web-surfaces-website build:cf`) to exercise the build.
:::

### CI workflows (`.github/workflows/`)

| Workflow           | Trigger                      | Does                                                                                             |
| ------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `test.yml` (CI)    | PR + push `main`             | `verify` + `build` + `browser-stories` (blocking) · `browser-e2e` + `docs` + `dependency-review` |
| `react-doctor.yml` | PR                           | Advisory React Doctor sticky comment                                                             |
| `preview.yml`      | PR (same-repo)               | Build + a Cloudflare **version preview URL**, commented on the PR                                |
| `deploy.yml`       | push `main` → prod; dispatch | OpenNext build + `wrangler deploy`                                                               |
| `backup.yml`       | nightly + dispatch           | Sanity (+ D1) dump → R2                                                                          |

The `build`, `preview`, `deploy`, and `backup` workflows need the repo's GitHub **Environment**
vars/secrets (`CLOUDFLARE_API_TOKEN`/`ACCOUNT_ID`, `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_*`) —
see [Deployment](/projects/web/website/setup/deployment). Fork PRs don't get secrets, so `preview` is skipped and `build`
compiles without Sanity content.

### React Doctor

React Doctor scans for React-specific security, performance, correctness, and architecture issues and prints a 0–100 health score.

- `pnpm doctor` — full scan. Use for a cleanup pass; fix by severity (errors first).
- `pnpm doctor:changed` — the version in `verify`. `--scope changed --base main` reports **only issues your branch introduced**, so pre-existing debt never fails your gate. It exits non-zero on a **new error** (default `--blocking` level); new warnings are reported but don't block. On `main` the changed set is empty, so it's a no-op. `--blocking warning` fails on warnings too; `--staged` scans only staged files.

Because it runs via `npx …@latest`, the first run fetches the CLI (needs network). **Config** (`doctor.config.jsonc`) excludes CLI-managed shadcn code and the isolated `docs/` project, plus a few per-file rule overrides, so those findings never count against you. **CI** (`.github/workflows/react-doctor.yml`) runs the same scan on every PR as an **advisory** sticky comment (never red-Xes the check); `pnpm doctor:changed` in `verify` is the local gate that actually blocks on a new error.

### Analysis, seeding, docs, housekeeping

| Script                                            | Command                                                                                                | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analyze`                                         | `ANALYZE=1 next build`                                                                                 | Production build with `@next/bundle-analyzer` — opens the treemap.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `size`                                            | `node scripts/check-bundle-size.mjs`                                                                   | Landing-route **First-Load JS** budget, read from the production build manifests (Next 16: `build-manifest.json` + the route's client-reference manifest; the `nomodule` polyfills don't count). Budget **335 kB** gz (measured ~292 kB: React DOM ~65; Clerk loads only for signed-in visitors). `--enforce` fails over budget, or when a build exists but can't be read; no build is a skip. CI runs it **enforced** after `build:cf`. Perf's byte-budget half; Core Web Vitals is the gstack `/benchmark` nudge. |
| `doctor:web:website:env`                          | `node scripts/doctor-env.mjs`                                                                          | **Preflight.** Validates `.env.local` (Sanity project id / dataset / api version required; site URL + tokens recommended) with clear "missing X" messages, then prints the **site identity** (prefix · deploy slug · Sanity project/dataset · url) and warns on prefix/deploy drift or a shared-project `production` dataset. Reads the file itself, so a missing `.env.local` is reported, not a crash. `-- --for=seed` also requires the write token.                                                             |
| `db:backup:content:prod` (`:remote`)              | `node code/shared/scripts/data/backup.mjs content prod [--remote]`                                     | Back up the Sanity `content` dataset → `website/backups/sanity/`; `:remote` also uploads to the R2 backups bucket; keeps the last 10. Registry-driven (`code/shared/scripts/lib/databases.mjs`). Restore with `db:restore:content`. See [Backups](/projects/web/website/setup/backups).                                                                                                                                                                                                                             |
| `db:backup:all:<env>` · `db:migrate <name> <env>` | `node code/shared/scripts/data/backup.mjs --all <env>` · `node code/shared/scripts/data/migrate.mjs …` | Back up / migrate every registered db, dispatching on `kind` (`d1`→wrangler · `sanity`→dataset export · others reserved). No-op for a kind that isn't wired. Add a db = a row in `code/shared/scripts/lib/databases.mjs`.                                                                                                                                                                                                                                                                                           |
| `db:restore:content`                              | `doctor:web:website:env && node --env-file=.env.local scripts/content-import.mjs`                      | **Destructive restore** — `sanity dataset import … --replace`. Needs `SANITY_API_WRITE_TOKEN`; prompts for the dataset name unless `-- --yes`. Prefer a scratch dataset.                                                                                                                                                                                                                                                                                                                                            |
| `export:web:website:subscribers`                  | `doctor:web:website:env && node --env-file=.env.local scripts/subscribers-export.mjs`                  | Exports the **newsletter subscribers from Resend** (every `newsletter-<code>` segment) → `backups/subscribers/subscribers-<timestamp>.csv` (`email,locale,unsubscribed,created_at`); `--all` keeps unsubscribed contacts, for an audit. Read-only; needs `RESEND_API_KEY`.                                                                                                                                                                                                                                          |
| `resend:topics:sync` (root)                       | `node code/shared/scripts/data/resend-topics-sync.mjs`                                                 | **Resend setup, once per env.** Creates any missing marketing topic and prints the ids for Studio; creates the `locale` contact property (fallback = the default locale) and one `newsletter-<code>` segment per site locale. Idempotent. Needs `RESEND_API_KEY`.                                                                                                                                                                                                                                                   |
| `comments:export`                                 | `doctor:web:website:env && node --env-file=.env.local scripts/comments-export.mjs`                     | Exports blog comments → `backups/comments/comments-<timestamp>.csv` (`authorName,authorEmail,body,approved,spam,post,createdAt`). Read-only; needs `SANITY_API_READ_TOKEN`.                                                                                                                                                                                                                                                                                                                                         |
| `waitlist:export`                                 | `doctor:web:website:env && node --env-file=.env.local scripts/waitlist-export.mjs`                     | Exports waitlist entries → `backups/waitlist/waitlist-<timestamp>.csv` (`email,name,status,source,language,consent,createdAt`). Read-only; needs `SANITY_API_READ_TOKEN`.                                                                                                                                                                                                                                                                                                                                           |
| `contact:export`                                  | `doctor:web:website:env && node --env-file=.env.local scripts/contact-export.mjs`                      | Exports contact messages → `backups/contact/contact-<timestamp>.csv` (`email,name,subject,message,status,source,language,consent,consentPolicyVersion,createdAt`). Read-only; needs `SANITY_API_READ_TOKEN`.                                                                                                                                                                                                                                                                                                        |
| `seed`                                            | `doctor:web:website:env --for=seed && node --env-file=.env.local scripts/seed.mjs`                     | Seeds the Sanity dataset with demo content. The preflight fails fast if the write token is missing. See § 2.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `check:placeholders`                              | `node code/shared/scripts/checks/scan-placeholders.mjs`                                                | **Pre-handoff scan** of `code/` + `docs/` for leftover scaffolding (`<production URL>`, `lorem`, unfilled `your_…_here`, `CHANGEME`). `-- --strict` exits 1 on a HARD hit. CI runs it report-only (the template ships its own fill-me tokens); `--strict` before a **client** go-live.                                                                                                                                                                                                                              |
| `resources:dev` / `:staging` / `:prod`            | `node code/shared/scripts/lib/resources.mjs <env>`                                                     | **List every Cloudflare resource this instance owns** in one env (workers · D1 · KV · R2), DERIVED from the registries + the site prefix — no hard-coded ids, so the list follows a `project:rename`. Read-only. The single source of truth for what a deploy creates.                                                                                                                                                                                                                                              |
| `resources:teardown:dev` / `:staging` / `:prod`   | `node code/shared/scripts/infra/teardown.mjs <env>`                                                    | **DELETE all of the above** — for shipping the template clean (no leftover cloud resources on the seller's account) or wiping a demo instance. **Dry-run by default**; add `-- --yes` to execute. prod re-confirms by typing the prefix; a missing resource is skipped. ⚠ Destructive + irreversible — never a live client env.                                                                                                                                                                                     |
| `clean`                                           | `bash scripts/clean.sh`                                                                                | Removes build artifacts (`.next`, `.turbo`, `.open-next`, `dist`, …) across the workspace. `-- --all` also wipes every `node_modules` (then `pnpm install`).                                                                                                                                                                                                                                                                                                                                                        |

### Deploy (Cloudflare)

**Per app and per env** — every deploy script name is `deploy:<app>:<env>` at both levels (the root delegates to `code/projects/web/surfaces/website`, whose scripts share the same `deploy:web:website:<env>` names). A second app reads `deploy:web:admin:<env>`, so nothing is env-generic or ambiguous. Full runbook → [Deployment (Cloudflare)](/projects/web/website/setup/deployment).

| Script                                                | Command                                                         | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project:rename`                                      | `node scripts/project-rename.mjs <slug>`                        | **Reuse the template per client.** Rewrites `DEFAULT_SITE_PREFIX` (`@indiecrafts/packages-shared-config`) + every `wrangler.toml` resource name to `<prefix>-<env>-web-surfaces-website*` in one command, then prints the R2 buckets to create. Run once, right after cloning.                                                                                                                                                                                                                                                                                                          |
| `setup:web:website:kv`                                | `node scripts/setup-kv.mjs`                                     | **One-time.** Creates a `RATE_LIMIT_KV` namespace **per env** (dev/staging/prod, like the R2 buckets) and uncomments + fills each id in `wrangler.toml`, activating the in-app form rate limiter (`@indiecrafts/packages-shared-security` `withGuard`). Until run, the limiter fails **open**. Idempotent.                                                                                                                                                                                                                                                                              |
| `deploy:web:website:dev` / `:staging` / `:prod`       | `node ../../../../shared/scripts/deploy/next.mjs website <env>` | Version-stamp → OpenNext build → `wrangler deploy --env <env>` → **sync secrets** from `.dev.vars` (soft — a no-op when there are none; `--skip-secrets` opts out). Prod prompts for confirmation unless CI or `--yes`. **Guarded:** a `staging`/`prod` deploy aborts while the Worker/R2 names are still the template default `indiecrafts-prod-web-surfaces-website` (shared-account clobber guard) — run `project:rename` first, or set `ALLOW_DEFAULT_SLUG=true` for the template's own deploy. Runs in CI on push to `main` (prod) via `deploy.yml`.                               |
| `deploy:all:dev` / `:staging` / `:prod`               | `node code/shared/scripts/deploy/all.mjs <env>`                 | **Deploy every deployable app to one env, in order, fail-fast** (repo-root dispatcher, §4). Discovers apps from `code/projects/*` (any dir with a **`wrangler.toml`**), orders standalone services before the web app (`api` · `cron` · `web`, then the rest alphabetically), and runs each one's `deploy:<app>:<env>` — so a new app is picked up automatically (an app missing that script is reported + skipped, not silently dropped). `--dry-run` lists the plan; `--yes` passes through to each app's deploy. Each app keeps its own guards (prod confirm, rename clobber-guard). |
| `secrets:sync:web:website:dev` / `:staging` / `:prod` | `wrangler secret bulk` via the shared `data/secrets.mjs`        | The same sync the deploy runs. Pushes only the keys `.dev.vars.example` / `.env.example` declare, from `.env.local` (dev) or `.dev.vars.<env>`; skips `NEXT_PUBLIC_*`, placeholders, and any key `wrangler.toml` sets as a var for that env (`API_URL`, `ADMIN_URL`…). Same rename-guard as deploy.                                                                                                                                                                                                                                                                                     |
| `preview:web:cf`                                      | `opennextjs-cloudflare preview`                                 | Build + serve on the real workerd runtime locally (needs `.dev.vars`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `studio:deploy`                                       | `sanity deploy`                                                 | **Host the Sanity Studio** at `<host>.sanity.studio` (the embedded `/studio` is excluded from the CF Worker — it would blow the 10 MiB limit). Run `sanity login` once; needs `NEXT_PUBLIC_SANITY_*` in `.env.local`. Set `NEXT_PUBLIC_SANITY_STUDIO_URL` afterwards so `/studio` redirects there. Run per app dir: `pnpm --filter @indiecrafts/web-surfaces-website studio:deploy`.                                                                                                                                                                                                    |
| `build:cf` · `version`                                | `version.mjs` (+ OpenNext build)                                | Stamp `src/lib/build-info.ts` (version · sha · time); `build:cf` also builds the Worker bundle. Sets `NEXT_PUBLIC_EMBED_STUDIO=false` so the `/studio` route (heavy `sanity` package) is dropped from the Worker — host the Studio with `studio:deploy` instead.                                                                                                                                                                                                                                                                                                                        |
| `prepare`                                             | `""`                                                            | Empty no-op in the app — Husky is installed from the **repo root** `prepare` (§ 3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

> **Docs** — `pnpm docs` / `docs:build` / `docs:install` are **root-only**
> (`npm --prefix code/docs …`); the app no longer duplicates them
> (`code/docs` is an npm-isolated project, separate from the app's pnpm tree).

---

## 2. `scripts/*.mjs`

Node scripts in `code/projects/web/surfaces/website/scripts/`. The contrast checker + env preflight run with plain `node` (no token, no network); the Sanity scripts need a token (exported, or loaded from `.env.local` via `--env-file`). `scripts/seed-media/` alongside them holds the demo brand assets the seeder uploads.

- **`doctor-env.mjs`** — the `pnpm doctor:web:website:env` preflight. Parses `.env.local` itself (so a missing file is a clear message, not a crash), checks required Sanity keys, warns on optional ones. `--for=seed` also requires the write token. No token, no network.
- **`code/shared/scripts/data/backup.mjs`** (root toolchain) — registry-driven backup for every db in `code/shared/scripts/lib/databases.mjs`, dispatching on `kind`: `sanity`→`sanity dataset export`, `d1`→`wrangler d1 export`, others reserved. Runs from each db's owner dir; `--remote` uploads to the R2 backups bucket (keeps the last 10). `pnpm db:backup:content:prod` (the Sanity content dataset) · `pnpm db:backup:all:<env>` (all). Shared helpers in `code/shared/scripts/lib/backup-common.mjs`. Full story → [Backups](/projects/web/website/setup/backups).
- **`code/shared/scripts/data/migrate.mjs`** (root toolchain) — `pnpm db:migrate <name> <env>`. Dispatches on `kind`: `d1`→`wrangler d1 migrations apply`; `postgres`/`supabase` reserved; `kv`/`sanity` have no schema migrations. `content-import.mjs` restores Sanity (**destructive** `--replace`, prompts unless `--yes`).
- **`subscribers-export.mjs`** — `pnpm export:web:website:subscribers`. Writes the newsletter subscribers from Resend's `newsletter-<code>` segments to a CSV in `backups/subscribers/`; `--all` keeps unsubscribed contacts, for an audit (read-only; `RESEND_API_KEY`).
- **`comments-export.mjs`** — `pnpm comments:export`. Same shape for blog comments → `backups/comments/` (read-only; `SANITY_API_READ_TOKEN`). Includes the private `authorEmail` — owner-only.
- **`waitlist-export.mjs`** — `pnpm waitlist:export`. Same shape for waitlist entries → `backups/waitlist/` (read-only; `SANITY_API_READ_TOKEN`).
- **`contact-export.mjs`** — `pnpm contact:export`. Same shape for contact messages → `backups/contact/` (read-only; `SANITY_API_READ_TOKEN`). Includes the message body + sender email — owner-only.
- **`lib/csv.mjs`** — shared `csvCell(value)` used by all three exporters. RFC-4180 quoting **plus a
  formula-injection guard**: a cell starting with `= + - @` (or tab/CR) is prefixed with `'` so a
  spreadsheet treats it as text, not a formula (user content like a comment body can carry
  `=HYPERLINK(...)`). Unit-tested in `lib/csv.test.mjs` (run by `pnpm test:scripts`).

### `check-contrast.mjs` — WCAG contrast checker

- **Purpose:** parses the `oklch(...)` theme tokens (light, explicit dark, and `prefers-color-scheme: dark`), converts to sRGB, and computes WCAG 2.1 ratios for a fixed foreground/background pair list. **Read-only.**
- **Invoke:** `pnpm verify:contrast`. No token, no network.
- **Result:** prints each pair's ratio in light and dark, exits `1` if any text pair dips below AA. Part of `pnpm verify`.
- **Keep in sync:** to enforce a new token pair, add it to the `PAIRS` array in the script.

### `seed.mjs` — seed a dataset

- **Purpose:** writes the **baseline** a site needs (settings, per-language SEO, home page, UI messages, legal pages, navigation, consent, form settings, the blog singleton, the E-mails singleton) — uploading logo/icon/OG assets from `scripts/seed-media/`. `--demo` adds the demo content (authors, categories, tags, posts with Unsplash images, quotes, people, announcements, comments, waitlist entries). Every content doc is translated (EN + FR, linked by a `translation.metadata` doc).
- **Invoke:** `pnpm seed` (baseline) · `pnpm seed -- --demo` · `pnpm seed:e2e` (baseline + demo into `tests-e2e`, `--force`) · `pnpm seed -- --dry-run` (JSON, no network). Needs `SANITY_API_WRITE_TOKEN` (Editor role); reads `projectId`/`dataset` from `NEXT_PUBLIC_SANITY_*`.
- **Touches:** writes to the dataset. **Refuses** a dataset that already has a `siteSettings` document unless `--force`. Re-running with `--force` updates docs in place (`createOrReplace` on fixed `_id`s); it never deletes, so a removed entry stays orphaned.
- **When:** once on a new client's empty dataset; `seed:e2e` after any seed change. **Never** with `--force` against a dataset with real content.
- **Test:** `seed.test.mjs` — the baseline holds no demo content, every reference resolves, personal data has a `private.` id.

### `sanity-setup.mjs` — one-time Sanity project setup

- **Purpose:** creates the content dataset + `tests-e2e` (warns past the free plan's 2 datasets), adds every website origin to Sanity's CORS list (with credentials), and checks the api worker reads the same project. Prints the manual steps (tokens, seed, hosted Studio, webhook).
- **Invoke:** `pnpm sanity:setup` (`-- --dry-run` to preview). Needs a `sanity login` session.
- **Touches:** the Sanity project's datasets and CORS origins — adds only; safe to re-run.

### `sanity-privatize.mjs` — move personal data to private ids

- **Purpose:** gives every `comment`, `contactMessage` and `waitlistEntry` a `private.<type>.<id>` id and moves the E-mails singleton to `private.emailStrings` — a public dataset hides dotted ids from anonymous reads. Rewrites references to a moved id (a reply's `parent`).
- **Invoke:** `pnpm --filter @indiecrafts/web-surfaces-website sanity:privatize` (dry run) · `… -- --apply` · `… -- --dataset tests-e2e --apply`. Needs `SANITY_API_WRITE_TOKEN`.
- **Touches:** one transaction per run; re-runs move nothing. Run it once on each dataset created before the private ids.

### `audit-dataset.mjs` — read-only dataset audit

- **Purpose:** health-checks the live dataset — documents missing a `language` field, posts with broken author/category/tag references, drafts older than 30 days, orphan documents of removed types.
- **Invoke:** `node --env-file=.env.local scripts/audit-dataset.mjs`. Needs `SANITY_API_READ_TOKEN` (Viewer is enough; also accepts `SANITY_API_WRITE_TOKEN`).
- **Touches:** nothing — read-only. Prints a report, exits `1` if any issue is found, `0` if clean.
- **When:** before a migration, or periodically to catch content drift.

### `unset-legacy-fields.mjs` — one-shot cleanup

- **Purpose:** unsets fields removed from the schema so they stop lingering in stored documents. Currently targets `post.modules` and `blog.frontpageModules`.
- **Invoke:** `node --env-file=.env.local scripts/unset-legacy-fields.mjs`. Needs `SANITY_API_WRITE_TOKEN` (Editor role) — Sanity's CLI has no `documents patch`, so it patches via `@sanity/client` directly.
- **Touches:** writes unset patches in one transaction.
- **When:** once, after a release that drops a schema field. Safe to re-run — a no-op when nothing matches.

::: warning
`seed.mjs` and `unset-legacy-fields.mjs` both **write** to the dataset. Point them at a dev/demo dataset, not a client's production content, unless you know exactly what they'll change.
:::

---

## 3. Git hooks (Husky)

Husky is installed by the **repo-root** `prepare` script on `pnpm install` (the app's own `prepare` is an empty no-op). One hook:

| Hook         | Runs                                                                    | What it does                                                                                               |
| ------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `pre-commit` | `cd code/projects/web/surfaces/website && pnpm lint-staged && pnpm tsc` | Lints + formats **staged files only** (fast), then a full `tsc` typecheck. Blocks the commit on any error. |

There is **no pre-push hook** — the commit gate plus CI cover it. Run `pnpm verify:quick` yourself before opening a PR for a full-repo lint.

`lint-staged` (`code/projects/web/surfaces/website/.lintstagedrc.json`):

```json
{
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

So committing auto-fixes lint + formats the staged files, then typechecks. Pushing runs nothing — CI is the whole-repo backstop. `git commit --no-verify` bypasses the hook in a genuine emergency, but the same checks run in CI, so you're only deferring the failure.

---

## 4. Repo-root scripts (`/scripts`)

Workspace-wide tooling, run from the repo root. Shell scripts are shellcheck-clean (`pnpm lint:scripts`, warning+); the `.mjs` have colocated `*.test.mjs` run by Node's built-in test runner (`pnpm test:scripts`, which now also covers `code/projects/web/surfaces/website/scripts/lib/*.test.mjs`). Both are in `pnpm verify` + CI.

| File                    | Script                            | What it does                                                                                                                                                                       |
| ----------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy-all.mjs`        | `pnpm deploy:all:<env>`           | Deploy every `code/projects/*` app to one env, sequential + fail-fast. Multi-app dispatcher (mirrors `infra.mjs`); each app keeps its own deploy guards.                           |
| `tags-report.mjs`       | `pnpm tags:report` / `check:tags` | Inventory + validate the `@complexity`/`@refactor`/`@debt` issue tags (vocabulary in the dev framework's _Issue tags_).                                                            |
| `checks/api-guards.mjs` | `pnpm check:api-guards`           | Enforce `withGuard` adoption on every public mutating API route (allowlist + reason for token/session-authed exceptions). Colocated test `api-guards.test.mjs`.                    |
| `checks/tasks-sync.mjs` | `pnpm check:tasks`                | Guard `.vscode/tasks.json` ⊇ the root `package.json` scripts (per-app tasks use an `<app>: ` label). Colocated test `tasks-sync.test.mjs`; also called by the change-hygiene hook. |
| `scan-placeholders.mjs` | `pnpm check:placeholders`         | Pre-handoff scan for leftover template scaffolding in `code/` + `docs/`.                                                                                                           |
| `clean.sh`              | `pnpm clean`                      | Wipe build artifacts (`--all` also `node_modules`).                                                                                                                                |
| `worktree.sh`           | —                                 | Git worktree helper (pre-existing).                                                                                                                                                |
