---
title: "Vitest config (ui-tokens)"
description: "Vitest configuration for the ui-tokens package; extends the shared happy-dom base."
status: stable
---

# Vitest config (ui-tokens)

> Runs the colocated `*.test.ts` files in `@indiecrafts/packages-web-ui-tokens` on the shared base.

## Purpose

Configures Vitest for the `ui-tokens` package. It extends the repo-wide shared config (`vitest.shared`) with an empty override, so the package inherits the shared happy-dom base and runs its colocated `*.test.ts` files.

## Exports

- Default export: the merged Vitest config (`mergeConfig(shared, {})`).

## Source

`code/packages/web/ui-tokens/vitest.config.ts`
