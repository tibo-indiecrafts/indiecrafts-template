# CLI scripts & verification

Every `pnpm` script, every standalone file in `code/apps/web/scripts/`, and the Git hook that runs automatically. Reach here when you're unsure which command does what, or which token a data script needs. Run everything from the **repo root** (turbo delegates to `@indiecrafts/web`).

---

## 1. `package.json` scripts

Run with `pnpm <name>`.

### Dev & build

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `next dev --turbopack` | Dev server at `http://localhost:3000` (Turbopack). Your default while working. |
| `build` | `next build` | Production build — prerenders every static route × locale. Run before deploy or to reproduce a CI build failure. |
| `start` | `next start` | Serves the output of `pnpm build`. For smoke-testing a production build locally. |

### Quality gates

| Script | Command | What it does |
| --- | --- | --- |
| `tsc` | `tsc --noEmit` | Strict typecheck, no output. |
| `lint` | `eslint` | ESLint over the repo. Zero errors expected. |
| `lint:fix` | `eslint --fix` | Same, auto-fixing what it can. |
| `format` | `prettier --write .` | Formats the tree in place. |
| `format:check` | `prettier --check .` | Verifies formatting without writing. What CI runs. |
| `verify:contrast` | `node scripts/check-contrast.mjs` | WCAG AA contrast on the theme tokens. Run after any colour change. |
| `doctor` | `npx react-doctor@latest --verbose` | Full React Doctor scan (security / performance / correctness / architecture). |
| `doctor:changed` | `npx react-doctor@latest --verbose --scope changed --base main` | React Doctor scoped to **only new issues vs `main`** — what `verify` runs. |
| `lint:scripts` | `npx shellcheck --severity=warning scripts/*.sh` | Shellcheck the repo-root shell scripts (warning+). In root `verify` + CI. |
| `test:scripts` | `node --test scripts/*.test.mjs` | Node's built-in test runner over the tooling-script tests (`scripts/*.test.mjs`). In root `verify` + CI. |
| `tags:check` | `node scripts/tags-report.mjs --check` | Validates the issue-tag vocabulary (see the dev framework's Issue tags). In root `verify` + CI. |
| `shadscan` | `pnpm dlx @shadscan/cli` | shadcn/ui fundamentals audit, scores UX 0–100 (62 rules). Manual, not in `verify`. `--prompt` for an AI fix-plan; `--json --fail-under <n>` for CI. |
| `verify:quick` | `pnpm tsc && pnpm lint` | Typecheck + full-repo lint. A **manual pre-PR check** (the commit hook already runs `tsc`; this adds whole-repo lint). |
| `verify` | `tsc && lint && format:check && verify:contrast && doctor:changed` | The full local gate: types + lint + format + contrast + React Doctor (changed code). Run before opening a PR. |

::: tip CI mirrors this
`pnpm verify` is the local gate. `.github/workflows/test.yml` (CI) runs the same checks as blocking jobs — **verify** (tsc · lint · format · contrast · tests · tooling gates) + **build** (`build:cf`, the real OpenNext Worker build — catches prerender + CF-only breakage) — plus advisory **browser** (Storybook a11y + e2e/visual) and a **docs** build + **dependency-review**. React Doctor is the advisory `react-doctor.yml`. `pnpm verify` itself skips `build:cf`; push a PR (or run `pnpm --filter @indiecrafts/web build:cf`) to exercise the build.
:::

### CI workflows (`.github/workflows/`)

| Workflow | Trigger | Does |
| --- | --- | --- |
| `test.yml` (CI) | PR + push `main` | `verify` + `build` (blocking) · `browser` + `docs` + `dependency-review` |
| `react-doctor.yml` | PR | Advisory React Doctor sticky comment |
| `preview.yml` | PR (same-repo) | Build + a Cloudflare **version preview URL**, commented on the PR |
| `deploy.yml` | push `main` → prod; dispatch | OpenNext build + `wrangler deploy` |
| `backup.yml` | nightly + dispatch | Sanity (+ D1) dump → R2 |

The `build`, `preview`, `deploy`, and `backup` workflows need the repo's GitHub **Environment**
vars/secrets (`CLOUDFLARE_API_TOKEN`/`ACCOUNT_ID`, `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_*`) —
see [Deployment](./deployment). Fork PRs don't get secrets, so `preview` is skipped and `build`
compiles without Sanity content.

### React Doctor

React Doctor scans for React-specific security, performance, correctness, and architecture issues and prints a 0–100 health score.

- `pnpm doctor` — full scan. Use for a cleanup pass; fix by severity (errors first).
- `pnpm doctor:changed` — the version in `verify`. `--scope changed --base main` reports **only issues your branch introduced**, so pre-existing debt never fails your gate. It exits non-zero on a **new error** (default `--blocking` level); new warnings are reported but don't block. On `main` the changed set is empty, so it's a no-op. `--blocking warning` fails on warnings too; `--staged` scans only staged files.

Because it runs via `npx …@latest`, the first run fetches the CLI (needs network). **Config** (`doctor.config.jsonc`) excludes CLI-managed shadcn code and the isolated `docs/` project, plus a few per-file rule overrides, so those findings never count against you. **CI** (`.github/workflows/react-doctor.yml`) runs the same scan on every PR as an **advisory** sticky comment (never red-Xes the check); `pnpm doctor:changed` in `verify` is the local gate that actually blocks on a new error.

### Analysis, seeding, docs, housekeeping

| Script | Command | What it does |
| --- | --- | --- |
| `analyze` | `ANALYZE=1 next build` | Production build with `@next/bundle-analyzer` — opens the treemap. |
| `doctor:env` | `node scripts/doctor-env.mjs` | **Preflight.** Validates `.env.local` (Sanity project id / dataset / api version required; site URL + tokens recommended) with clear "missing X" messages, then prints the **site identity** (prefix · deploy slug · Sanity project/dataset · url) and warns on prefix/deploy drift or a shared-project `production` dataset. Reads the file itself, so a missing `.env.local` is reported, not a crash. `-- --for=seed` also requires the write token. |
| `sanity:typegen` | `sanity schema extract && sanity typegen generate` | Extracts the composed schema → `schema.json`, then generates typed GROQ results into `@indiecrafts/schema/generated` (shared, so the app **and** blog import them). Run after any schema or query change. The generated file is committed; `schema.json` is gitignored. |
| `backup:web:sanity` | `doctor:env && node --env-file=.env.local scripts/backup-sanity.mjs` | Back up the Sanity dataset → `backups/sanity/`. `-- --remote [--env <env>]` also uploads to the R2 backups bucket; keeps the last 10. Restore with `content:import`. See [Backups](./backups). |
| `backup:web:d1:dev` / `:staging` / `:prod` | `node scripts/backup-d1.mjs <env>` | Back up Cloudflare D1 → `backups/d1/` (no-op until D1 is configured). `-- --remote` also uploads to R2. |
| `content:import` | `doctor:env && node --env-file=.env.local scripts/content-import.mjs` | **Destructive restore** — `sanity dataset import … --replace`. Needs `SANITY_API_WRITE_TOKEN`; prompts for the dataset name unless `-- --yes`. Prefer a scratch dataset. |
| `subscribers:export` | `doctor:env && node --env-file=.env.local scripts/subscribers-export.mjs` | Exports newsletter subscribers → `backups/subscribers/subscribers-<timestamp>.csv` (`email,status,consent,source,language,createdAt`). Read-only; needs `SANITY_API_READ_TOKEN`. |
| `comments:export` | `doctor:env && node --env-file=.env.local scripts/comments-export.mjs` | Exports blog comments → `backups/comments/comments-<timestamp>.csv` (`authorName,authorEmail,body,approved,spam,post,createdAt`). Read-only; needs `SANITY_API_READ_TOKEN`. |
| `waitlist:export` | `doctor:env && node --env-file=.env.local scripts/waitlist-export.mjs` | Exports waitlist entries → `backups/waitlist/waitlist-<timestamp>.csv` (`email,name,status,source,language,consent,createdAt`). Read-only; needs `SANITY_API_READ_TOKEN`. |
| `seed` | `doctor:env --for=seed && node --env-file=.env.local scripts/seed-demo.mjs` | Seeds the Sanity dataset with demo content. The preflight fails fast if the write token is missing. See § 2. |
| `scan:placeholders` | `node scripts/scan-placeholders.mjs` | **Pre-handoff scan** of `code/` + `docs/` for leftover scaffolding (`<production URL>`, `lorem`, unfilled `your_…_here`, `CHANGEME`). `-- --strict` exits 1 on a HARD hit. Not in CI — the template ships with its own fill-me tokens; run before a **client** site goes live. |
| `clean` | `bash scripts/clean.sh` | Removes build artifacts (`.next`, `.turbo`, `.open-next`, `dist`, …) across the workspace. `-- --all` also wipes every `node_modules` (then `pnpm install`). |

### Deploy (Cloudflare)

**Per app and per env** — every deploy script name is `deploy:<app>:<env>` at both levels (the root delegates to `code/apps/web`, whose scripts share the same `deploy:web:<env>` names). A second app reads `deploy:admin:<env>`, so nothing is env-generic or ambiguous. Full runbook → [Deployment (Cloudflare)](./deployment).

| Script | Command | What it does |
| --- | --- | --- |
| `project:rename` | `node scripts/project-rename.mjs <slug>` | **Reuse the template per client.** Rewrites `DEFAULT_SITE_PREFIX` (`@indiecrafts/config`) + every `wrangler.toml` resource name to `<slug>-web*` in one command, then prints the R2 buckets to create. Run once, right after cloning. |
| `deploy:web:dev` / `:staging` / `:prod` | `node scripts/deploy.mjs <env>` | Version-stamp → OpenNext build → `wrangler deploy --env <env>`. Prod prompts for confirmation unless CI or `--yes`. **Guarded:** a `staging`/`prod` deploy aborts while the Worker/R2 names are still the template default `indiecrafts-web` (shared-account clobber guard) — run `project:rename` first, or set `ALLOW_DEFAULT_SLUG=true` for the template's own deploy. Runs in CI on push to `main` (prod) via `deploy.yml`. |
| `secrets:sync:web:dev` / `:staging` / `:prod` | `wrangler secret bulk` from `.dev.vars` | Bulk-provision the Worker's server secrets per env (skips `NEXT_PUBLIC_*` + unfilled placeholders). One dataset → same secrets to every env. Same rename-guard as deploy. |
| `preview:web:cf` | `opennextjs-cloudflare preview` | Build + serve on the real workerd runtime locally (needs `.dev.vars`). |
| `build:cf` · `version` | `version.mjs` (+ OpenNext build) | Stamp `src/lib/build-info.ts` (version · sha · time); `build:cf` also builds the Worker bundle. |
| `docs:install` | `npm --prefix docs install` | Installs the isolated docs package's deps. Run once before working on docs. |
| `docs` | `npm --prefix docs run docs:dev` | Docs dev server at `http://localhost:3002`. |
| `docs:build` | `npm --prefix docs run docs:build` | Static docs build → `docs/.vitepress/dist`. |
| `prepare` | `""` | Empty no-op in the app — Husky is installed from the **repo root** `prepare` (§ 3). |

---

## 2. `scripts/*.mjs`

Node scripts in `code/apps/web/scripts/`. The contrast checker + env preflight run with plain `node` (no token, no network); the Sanity scripts need a token (exported, or loaded from `.env.local` via `--env-file`). `scripts/seed-media/` alongside them holds the demo brand assets the seeder uploads.

- **`doctor-env.mjs`** — the `pnpm doctor:env` preflight. Parses `.env.local` itself (so a missing file is a clear message, not a crash), checks required Sanity keys, warns on optional ones. `--for=seed` also requires the write token. No token, no network.
- **`backup-sanity.mjs` / `content-import.mjs`** — `pnpm backup:web:sanity` / `content:import`. Export the Sanity dataset → `backups/sanity/` (`--remote` also uploads to the R2 backups bucket, keeps the last 10); import is **destructive** (`--replace`) and prompts unless `--yes`. Shared helpers in `lib/backup-common.mjs`. Full story → [Backups](./backups).
- **`backup-d1.mjs`** — `pnpm backup:web:d1:<env>`. `wrangler d1 export` → `backups/d1/`; `--remote` uploads to R2. No-op until D1 is configured (opt-in — see [db](/db/README)).
- **`subscribers-export.mjs`** — `pnpm subscribers:export`. GROQ-queries every `subscriber` and writes a CSV to `backups/subscribers/` (read-only; `SANITY_API_READ_TOKEN`). The escape hatch for newsletter lists stored in Sanity.
- **`comments-export.mjs`** — `pnpm comments:export`. Same shape for blog comments → `backups/comments/` (read-only; `SANITY_API_READ_TOKEN`). Includes the private `authorEmail` — owner-only.
- **`waitlist-export.mjs`** — `pnpm waitlist:export`. Same shape for waitlist entries → `backups/waitlist/` (read-only; `SANITY_API_READ_TOKEN`).

### `check-contrast.mjs` — WCAG contrast checker

- **Purpose:** parses the `oklch(...)` theme tokens (light, explicit dark, and `prefers-color-scheme: dark`), converts to sRGB, and computes WCAG 2.1 ratios for a fixed foreground/background pair list. **Read-only.**
- **Invoke:** `pnpm verify:contrast`. No token, no network.
- **Result:** prints each pair's ratio in light and dark, exits `1` if any text pair dips below AA. Part of `pnpm verify`.
- **Keep in sync:** to enforce a new token pair, add it to the `PAIRS` array in the script.

### `seed-demo.mjs` — seed demo content

- **Purpose:** populates the dataset with demo blog content (authors, categories, tags, posts with Unsplash images, quotes, people), plus the `blog`, `siteSettings`, and per-locale `siteMeta` singletons — uploading logo/icon/OG assets from `scripts/seed-media/`. Every content doc is translated (EN + FR, linked by a `translation.metadata` doc).
- **Invoke:** `pnpm seed`. Needs `SANITY_API_WRITE_TOKEN` (Editor role); reads `projectId`/`dataset` from `NEXT_PUBLIC_SANITY_*`.
- **Touches:** writes to the live dataset. **Idempotent** — `createOrReplace` keyed on fixed `_id`s, so re-running updates docs in place. It never deletes; removing an entry and re-running leaves the old doc orphaned.
- **When:** during template iteration or to stand up a demo. **Never** against a client's production dataset with real content.

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
`seed-demo.mjs` and `unset-legacy-fields.mjs` both **write** to the dataset. Point them at a dev/demo dataset, not a client's production content, unless you know exactly what they'll change.
:::

---

## 3. Git hooks (Husky)

Husky is installed by the **repo-root** `prepare` script on `pnpm install` (the app's own `prepare` is an empty no-op). One hook:

| Hook | Runs | What it does |
| --- | --- | --- |
| `pre-commit` | `cd code/apps/web && pnpm lint-staged && pnpm tsc` | Lints + formats **staged files only** (fast), then a full `tsc` typecheck. Blocks the commit on any error. |

There is **no pre-push hook** — the commit gate plus CI cover it. Run `pnpm verify:quick` yourself before opening a PR for a full-repo lint.

`lint-staged` (`code/apps/web/.lintstagedrc.json`):

```json
{
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

So committing auto-fixes lint + formats the staged files, then typechecks. Pushing runs nothing — CI is the whole-repo backstop. `git commit --no-verify` bypasses the hook in a genuine emergency, but the same checks run in CI, so you're only deferring the failure.

---

## 4. Repo-root scripts (`/scripts`)

Workspace-wide tooling, run from the repo root. Shell scripts are shellcheck-clean (`pnpm lint:scripts`, warning+); the `.mjs` have colocated `*.test.mjs` run by Node's built-in test runner (`pnpm test:scripts`). Both are in `pnpm verify` + CI.

| File | Script | What it does |
| --- | --- | --- |
| `tags-report.mjs` | `pnpm tags:report` / `tags:check` | Inventory + validate the `@complexity`/`@refactor`/`@debt` issue tags (vocabulary in the dev framework's *Issue tags*). |
| `scan-placeholders.mjs` | `pnpm scan:placeholders` | Pre-handoff scan for leftover template scaffolding in `code/` + `docs/`. |
| `clean.sh` | `pnpm clean` | Wipe build artifacts (`--all` also `node_modules`). |
| `sync-agents.sh` | `pnpm agents:sync` | Sync the Claude agent set (pre-existing). |
| `worktree.sh` | — | Git worktree helper (pre-existing). |
