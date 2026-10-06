---
title: "Web i18n Vitest config"
description: "Vitest config for the web-i18n brick; re-exports the shared happy-dom base unchanged."
status: stable
---

# Web i18n Vitest config

> Vitest config for `@indiecrafts/packages-web-i18n`.

## Purpose

Vitest configuration for the `@indiecrafts/packages-web-i18n` brick. It merges the repo-wide base (`vitest.shared.ts`) through `mergeConfig`, so `turbo run test` fans out and caches per package. The shared base runs colocated `*.test.{ts,tsx}` files in a happy-dom environment with globals, a `server-only` stub, and v8 coverage.

## Exports

- `default` — the package's Vitest config: the shared happy-dom base.

## Source

`code/packages/web/i18n/vitest.config.ts`
