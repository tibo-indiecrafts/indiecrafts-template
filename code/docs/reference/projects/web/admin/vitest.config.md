---
title: "Admin Vitest config"
description: "Vitest configuration for the admin surface, extending the shared base and adding the @/ source alias."
status: stable
---

# Admin Vitest config

> Extends the repo's shared Vitest base and adds the admin app's `@/` to `src` alias.

## Purpose

Configures Vitest for `@indiecrafts/web-surfaces-admin`. It merges the shared happy-dom base config (`vitest.shared`) and adds the `@` alias pointing at `./src`, so colocated `*.test.{ts,tsx}` files import app modules exactly as production code does.

## Exports

- `default` — the merged Vitest config from `mergeConfig(shared, ...)`.

## Source

`code/projects/web/surfaces/admin/vitest.config.ts`
