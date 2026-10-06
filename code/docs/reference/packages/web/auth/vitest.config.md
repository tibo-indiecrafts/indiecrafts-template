---
title: "Web auth Vitest config"
description: "Vitest config for the web-auth brick; the shared happy-dom base with a longer test timeout."
status: stable
---

# Web auth Vitest config

> Vitest config for `@indiecrafts/packages-web-auth`.

## Purpose

Vitest configuration for the `@indiecrafts/packages-web-auth` brick. It merges the repo-wide base (`vitest.shared.ts`) through `mergeConfig` with one override, a 20 s `testTimeout` (the first Radix render pays a cold import that can pass 5 s under a parallel run), so `turbo run test` fans out and caches per package. The shared base runs colocated `*.test.{ts,tsx}` files in a happy-dom environment with globals, a `server-only` stub, and v8 coverage.

## Exports

- `default` — the package's Vitest config: the shared happy-dom base with a 20 s test timeout.

## Source

`code/packages/web/auth/vitest.config.ts`
