# CLI scripts & verification

Every `pnpm` script in `package.json`, every standalone file in `scripts/`, and the Git hooks that run automatically. Reach for this when you're not sure which command does what, or which token a data script needs.

---

## 1. `package.json` scripts

Run with `pnpm <name>`.

### Dev & build

| Script  | Command      | What it does / when to run                                                                                       |
| ------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `dev`   | `next dev`   | Local dev server at `http://localhost:3000`. Your default while working.                                         |
| `build` | `next build` | Production build — prerenders every static route × locale. Run before deploy or to reproduce a CI build failure. |
| `start` | `next start` | Serves the output of `pnpm build`. For smoke-testing a production build locally; not the dev server.             |

### Quality gates

| Script            | Command                                                                                     | What it does / when to run                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `tsc`             | `tsc --noEmit`                                                                              | Strict typecheck, no output files. Run after any type-level change.                                           |
| `lint`            | `eslint`                                                                                    | ESLint over the repo. Zero errors expected.                                                                   |
| `lint:fix`        | `eslint --fix`                                                                              | Same, auto-fixing what it can.                                                                                |
| `format`          | `prettier --write .`                                                                        | Formats the whole tree in place.                                                                              |
| `format:check`    | `prettier --check .`                                                                        | Verifies formatting without writing. What CI runs.                                                            |
| `verify:contrast` | `node scripts/check-contrast.mjs`                                                           | WCAG AA contrast check on the theme tokens. Run after any color change.                                       |
| `doctor`          | `npx react-doctor@latest --verbose`                                                         | Full [React Doctor](#react-doctor) scan (security / performance / correctness / architecture).                |
| `doctor:changed`  | `npx react-doctor@latest --verbose --scope changed --base main`                             | React Doctor scoped to **only new issues vs `main`** — what `verify` runs, so legacy debt can't block you.    |
| `verify:quick`    | `pnpm tsc && pnpm lint`                                                                     | Typecheck + lint. The **pre-push gate** — run it before you push.                                             |
| `verify`          | `pnpm tsc && pnpm lint && pnpm format:check && pnpm verify:contrast && pnpm doctor:changed` | The full local gate: types + lint + format + contrast + React Doctor (changed code). Run before opening a PR. |

::: tip
`pnpm verify` does **not** run `pnpm build`. CI runs both — `verify` for correctness/style, `build` to prove every route prerenders. Run `pnpm build` yourself when you've touched routing, config, or anything that affects static generation.
:::

### React Doctor

[React Doctor](https://github.com/millionco/react-doctor) scans the codebase for React-specific security, performance, correctness, and architecture issues and prints a 0–100 health score.

- `pnpm doctor` — full scan of the whole codebase. Use for a cleanup pass; fix by severity (errors first, then warnings).
- `pnpm doctor:changed` — the version wired into `verify`. `--scope changed --base main` reports **only issues your branch introduced vs `main`**, so a pre-existing warning elsewhere never fails your gate — you're accountable only for the code you touched. It exits non-zero on a **new error** (the default `--blocking` level); new warnings are reported but don't block.

Because it runs via `npx …@latest`, the first run fetches the CLI (needs network). On `main` itself the changed set is empty, so it's a no-op. To fail on warnings too, add `--blocking warning`; to scan only staged files in a hook, use `--staged`.

**Config** (`doctor.config.jsonc`) excludes code we don't own, so its findings never count against you: `src/user-interface/ui/**` and `src/hooks/use-mobile.ts` (shadcn — CLI-managed, READ-ONLY) and `docs/**` (the isolated VitePress project). Tune rules with `npx react-doctor@latest rules …` (`list` / `explain <rule>` / `set <rule> <severity>`).

**CI** (`.github/workflows/react-doctor.yml`) runs the same scan on every PR — a sticky comment listing only the issues that PR introduced, plus a health-score status. It's **advisory** (never red-Xes the check); `pnpm doctor:changed` in `verify` is the local gate that actually blocks on a new error.

### Analysis

| Script    | Command                | What it does / when to run                                                                     |
| --------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| `analyze` | `ANALYZE=1 next build` | Production build with `@next/bundle-analyzer`. Opens the treemap so you can hunt bundle bloat. |

### Content seeding

| Script      | Command                                                 | What it does / when to run                                                                                                                                                        |
| ----------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `seed:blog` | `node --env-file=.env.local scripts/seed-blog-demo.mjs` | Seeds the Sanity dataset with demo blog content. Needs `SANITY_API_WRITE_TOKEN`. The `--env-file=.env.local` flag loads your local env automatically. See [§ 2](#_2-scripts-mjs). |

### Documentation site

The docs site (this VitePress site) is an isolated npm package under `docs/`. These root scripts delegate to it via `npm --prefix docs`.

| Script         | Command                            | What it does / when to run                                         |
| -------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `docs:install` | `npm --prefix docs install`        | Installs the docs package's deps. Run once before working on docs. |
| `docs`         | `npm --prefix docs run docs:dev`   | Docs dev server at `http://localhost:3002`.                        |
| `docs:build`   | `npm --prefix docs run docs:build` | Static docs build → `docs/.vitepress/dist`.                        |

### Housekeeping

| Script    | Command | What it does                                                                            |
| --------- | ------- | --------------------------------------------------------------------------------------- |
| `prepare` | `husky` | Installs the Git hooks (§ 3). Runs automatically on `pnpm install` — you never call it. |

---

## 2. `scripts/*.mjs`

Four Node scripts. Only the contrast checker runs with plain `node` (no token, no network); the three Sanity scripts need a token in your environment (either exported, or loaded from `.env.local` via `--env-file`).

### `check-contrast.mjs` — WCAG contrast checker

- **Purpose:** parses the `oklch(...)` theme tokens out of `src/app/globals.css` (light, explicit dark, and `prefers-color-scheme: dark`), converts them to sRGB, and computes WCAG 2.1 contrast ratios for a fixed list of foreground/background pairs. **Read-only** — it never writes.
- **Invoke:** `pnpm verify:contrast` (or `node scripts/check-contrast.mjs`). No token, no network.
- **Result:** prints each pair's ratio in light and dark and exits `1` if any text pair dips below AA. Part of `pnpm verify`, so a failing pair blocks the gate.
- **Keep in sync:** when you add a new semantic token pair you want enforced, add it to the `PAIRS` array in the script.

### `seed-blog-demo.mjs` — seed demo content

- **Purpose:** populates the dataset with demo blog content — authors, categories, posts (with images fetched from Unsplash), quotes, people, and the `blog` singleton.
- **Invoke:** `pnpm seed:blog`. Needs a write-capable token in `SANITY_API_WRITE_TOKEN` (Editor role). The `pnpm` alias loads `.env.local` for you via `--env-file`.
- **Touches:** writes to the live Sanity dataset. **Idempotent** — it uses `createOrReplace` keyed on fixed `_id`s, so re-running updates docs in place instead of duplicating them. It only writes, never deletes, so removing an entry from the script and re-running leaves the old doc orphaned in the dataset (see the re-seed table in [`new-client.md`](./new-client.md) § 8).
- **When:** during template iteration or to stand up a demo. **Never** against a client's production dataset once real content exists.

### `audit-dataset.mjs` — read-only dataset audit

- **Purpose:** health-checks the live dataset. Surfaces documents missing a required `language` field, posts with broken author / category / tag references, drafts older than 30 days, and orphan documents of types that were removed from the schema.
- **Invoke:** `node --env-file=.env.local scripts/audit-dataset.mjs` (or `pnpm dlx tsx scripts/audit-dataset.mjs`). Needs `SANITY_API_READ_TOKEN` — a Viewer token is enough (it also accepts `SANITY_API_WRITE_TOKEN`).
- **Touches:** nothing — it only reads. Prints a report and exits `1` if any issue is found, `0` if the dataset is clean.
- **When:** before a migration, or periodically to catch content drift.

### `unset-legacy-fields.mjs` — one-shot cleanup

- **Purpose:** unsets fields that were removed from the schema so they stop lingering in stored documents. Currently targets `post.modules` and `blog.frontpageModules`.
- **Invoke:** `node --env-file=.env.local scripts/unset-legacy-fields.mjs`. Needs `SANITY_API_WRITE_TOKEN` (Editor role) — Sanity's CLI has no `documents patch`, so it patches via `@sanity/client` directly.
- **Touches:** writes (unset patches) to the dataset, committed in one transaction.
- **When:** once, after a release that drops a schema field. Safe to re-run — it's a no-op when nothing matches.

::: warning
`seed-blog-demo.mjs` and `unset-legacy-fields.mjs` both **write** to the dataset. Point them at a dev/demo dataset, not a client's production content, unless you know exactly what they'll change.
:::

---

## 3. Git hooks (husky)

Installed by the `prepare` script on `pnpm install`. Two hooks:

| Hook         | Runs                    | What it does                                                                             |
| ------------ | ----------------------- | ---------------------------------------------------------------------------------------- |
| `pre-commit` | `pnpm lint-staged`      | Runs `lint-staged` over **staged files only** — fast. Config in `.lintstagedrc.json`.    |
| `pre-push`   | `pnpm lint && pnpm tsc` | Full lint + typecheck before anything leaves your machine. Blocks the push on any error. |

`lint-staged` (`.lintstagedrc.json`) applies:

```json
{
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

So committing auto-fixes lint + formats the files you're committing; pushing re-checks the whole repo. To bypass a hook in a genuine emergency, `git commit`/`git push` accept `--no-verify` — but the same checks run in CI, so you're only deferring the failure.
