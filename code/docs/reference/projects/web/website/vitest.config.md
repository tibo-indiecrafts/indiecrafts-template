---
title: "Vitest config"
description: "Vitest config extending the shared base and adding the app's @/ path alias."
status: stable
---

# Vitest config

> The app's unit-test config: the shared base plus the `@/` alias.

## Purpose

Extends the repo's shared happy-dom Vitest base (`vitest.shared`) via `mergeConfig` and adds the app's `@/` to `src` path alias. That lets colocated `*.test.ts` and `*.test.tsx` files import app modules exactly as production code does, since the shared base only stubs `server-only`.

## Exports

- `default` — the merged Vitest configuration.

## Source

`code/projects/web/surfaces/website/vitest.config.ts`
