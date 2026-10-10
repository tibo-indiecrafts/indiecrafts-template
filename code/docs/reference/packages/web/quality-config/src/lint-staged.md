---
title: "Shared commit-time checks"
description: "The lint-staged steps every Next web surface runs at commit."
status: stable
---

# Shared commit-time checks

> Staged code is fixed by ESLint, then formatted.

## Purpose

At commit, `.husky/pre-commit` runs each surface's `lint-staged` with this config: staged `ts`/`tsx`/`js`/`jsx`/`mjs`/`cjs` files get `eslint --fix` then `prettier --write`; staged `json`/`md`/`css` files get `prettier --write`. Each surface's `.lintstagedrc.mjs` re-exports it.

## Exports

- `default` — the lint-staged config.

## Source

`code/packages/web/quality-config/src/lint-staged.mjs`
