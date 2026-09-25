---
title: "App Vitest config"
description: "Vitest configuration for the app surface, extending the shared base and adding the @/ source alias."
status: stable
---

# App Vitest config

> Extends the repo's shared Vitest base and adds the `app` surface's `@/` to `src` alias.

## Purpose

Configures Vitest for `@indiecrafts/web-surfaces-app`. It merges the shared happy-dom base config (`vitest.shared`) and adds the `@` alias pointing at `./src`, so colocated `*.test.{ts,tsx}` files import app modules exactly as production code does.

## Exports

- `default` — the merged Vitest config from `mergeConfig(shared, ...)`.

## Source

`code/projects/web/surfaces/app/vitest.config.ts`
