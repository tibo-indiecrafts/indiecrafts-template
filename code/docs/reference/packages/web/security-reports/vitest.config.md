---
title: "Security reports Vitest config"
description: "Vitest config for the web-security-reports brick; re-exports the shared happy-dom base unchanged."
status: stable
---

# Security reports Vitest config

> Vitest config for `@indiecrafts/packages-web-security-reports`.

## Purpose

Vitest configuration for the `@indiecrafts/packages-web-security-reports` brick. It merges the repo-wide base (`vitest.shared.ts`) through `mergeConfig` with no overrides, so `turbo run test` fans out and caches per package. The shared base runs colocated `*.test.{ts,tsx}` files in a happy-dom environment with globals, a `server-only` stub, and v8 coverage.

## Exports

- `default` — the package's Vitest config: the shared happy-dom base, merged unchanged.

## Source

`code/packages/web/security-reports/vitest.config.ts`
