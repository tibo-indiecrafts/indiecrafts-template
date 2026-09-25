---
title: "Web Sanity Vitest config"
description: "Vitest config for the web-sanity brick; re-exports the shared happy-dom base unchanged."
status: stable
---

# Web Sanity Vitest config

> Vitest config for `@indiecrafts/packages-web-sanity`.

## Purpose

Vitest configuration for the `@indiecrafts/packages-web-sanity` brick. It merges the repo-wide base (`vitest.shared.ts`) through `mergeConfig` with no overrides, so `turbo run test` fans out and caches per package. The shared base runs colocated `*.test.{ts,tsx}` files in a happy-dom environment with globals, a `server-only` stub, and v8 coverage.

## Exports

- `default` — the package's Vitest config: the shared happy-dom base, merged unchanged.

## Source

`code/packages/web/sanity/vitest.config.ts`
