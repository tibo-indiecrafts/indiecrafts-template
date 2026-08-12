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
| `shadscan` | `pnpm dlx @shadscan/cli` | shadcn/ui fundamentals audit, scores UX 0–100 (62 rules). Manual, not in `verify`. `--prompt` for an AI fix-plan; `--json --fail-under <n>` for CI. |
| `verify:quick` | `pnpm tsc && pnpm lint` | Typecheck + full-repo lint. A **manual pre-PR check** (the commit hook already runs `tsc`; this adds whole-repo lint). |
| `verify` | `tsc && lint && format:check && verify:contrast && doctor:changed` | The full local gate: types + lint + format + contrast + React Doctor (changed code). Run before opening a PR. |

::: tip
`pnpm verify` does **not** run `pnpm build`. CI runs both — `verify` for correctness/style, `build` to prove every route prerenders. Run `pnpm build` yourself when you've touched routing, config, or anything affecting static generation.
:::

### React Doctor

React Doctor scans for React-specific security, performance, correctness, and architecture issues and prints a 0–100 health score.

- `pnpm doctor` — full scan. Use for a cleanup pass; fix by severity (errors first).
- `pnpm doctor:changed` — the version in `verify`. `--scope changed --base main` reports **only issues your branch introduced**, so pre-existing debt never fails your gate. It exits non-zero on a **new error** (default `--blocking` level); new warnings are reported but don't block. On `main` the changed set is empty, so it's a no-op. `--blocking warning` fails on warnings too; `--staged` scans only staged files.

Because it runs via `npx …@latest`, the first run fetches the CLI (needs network). **Config** (`doctor.config.jsonc`) excludes CLI-managed shadcn code and the isolated `docs/` project, plus a few per-file rule overrides, so those findings never count against you. **CI** (`.github/workflows/react-doctor.yml`) runs the same scan on every PR as an **advisory** sticky comment (never red-Xes the check); `pnpm doctor:changed` in `verify` is the local gate that actually blocks on a new error.

### Analysis, seeding, docs, housekeeping

| Script | Command | What it does |
| --- | --- | --- |
| `analyze` | `ANALYZE=1 next build` | Production build with `@next/bundle-analyzer` — opens the treemap. |
| `seed` | `node --env-file=.env.local scripts/seed-demo.mjs` | Seeds the Sanity dataset with demo content. Needs `SANITY_API_WRITE_TOKEN`; `--env-file` loads `.env.local`. See § 2. |
| `docs:install` | `npm --prefix docs install` | Installs the isolated docs package's deps. Run once before working on docs. |
| `docs` | `npm --prefix docs run docs:dev` | Docs dev server at `http://localhost:3002`. |
| `docs:build` | `npm --prefix docs run docs:build` | Static docs build → `docs/.vitepress/dist`. |
| `codegraph:init` / `codegraph:status` | guarded `codegraph …` | Initialise / status the optional CodeGraph index (no-op with a hint if CodeGraph isn't installed). |
| `prepare` | `""` | Empty no-op in the app — Husky is installed from the **repo root** `prepare` (§ 3). |

---

## 2. `scripts/*.mjs`

Four Node scripts. Only the contrast checker runs with plain `node` (no token, no network); the three Sanity scripts need a token in your environment (exported, or loaded from `.env.local` via `--env-file`). `scripts/seed-media/` alongside them holds the demo brand assets the seeder uploads.

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
