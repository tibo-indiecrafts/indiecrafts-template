---
title: "Web quality config"
description: "The ESLint, Prettier and commit-time checks every Next web surface shares."
status: stable
---

# Web quality config

The **one source of the code-quality rules** for every Next web surface — website, admin and app.
Lives in the **`@indiecrafts/packages-web-quality-config`** brick (`code/packages/web/quality-config`).
Change a rule here and every surface gets it; no surface keeps its own copy.

## What it holds

| Export                                                 | Used by each surface's | What it sets                                                                                                                                                                        |
| ------------------------------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@indiecrafts/packages-web-quality-config/eslint`      | `eslint.config.mjs`    | `webEslintConfig({ ignores? })` — Next core-web-vitals + TypeScript; every `jsx-a11y` rule as an error (WCAG 2.1 AA); routing only through `@/i18n/routing`; build outputs ignored. |
| `@indiecrafts/packages-web-quality-config/prettier`    | `prettier.config.mjs`  | Double quotes, semicolons, trailing commas, 90 columns, Tailwind classes sorted.                                                                                                    |
| `@indiecrafts/packages-web-quality-config/lint-staged` | `.lintstagedrc.mjs`    | At commit: staged code → `eslint --fix` + `prettier --write`; staged JSON / Markdown / CSS → `prettier --write`.                                                                    |

Each surface's file is a one-line re-export. A surface-only need (e.g. CLI-managed shadcn
primitives) goes in through `webEslintConfig({ ignores: [...] })`, never a forked config.

## Where it runs

- **While editing** — the `a11y-check` hook runs the surface's ESLint on each edited file.
- **At commit** — `.husky/pre-commit` runs each surface's `lint-staged` (the shared steps) and its
  `tsc` when one of its files is staged (the website always).
- **`pnpm verify`** — each surface: `tsc` · `lint` · `format:check` · `doctor:changed` · `test`
  (the website adds `verify:contrast`).
- **CI** — `pnpm lint` (turbo, every surface) and `pnpm format:check` (root files, then every
  workspace's own `format:check` through turbo).
- **React Doctor** — each surface has `doctor` / `doctor:changed` and its own `doctor.config.jsonc`
  (the paths to skip are per app). The `react-doctor-changed.sh` Stop hook runs every surface's
  `doctor:changed` in parallel on every turn.

## Not here

The repo root keeps its own Prettier defaults and `.prettierignore` for packages, modules, workers,
scripts and docs, and `.oxlintrc.json` for the fast repo-wide lint (`pnpm oxlint`).
