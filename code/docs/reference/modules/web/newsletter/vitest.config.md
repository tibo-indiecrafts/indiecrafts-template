---
title: "Vitest config (newsletter)"
description: "Vitest configuration for the newsletter module; extends the shared happy-dom base."
status: stable
---

# Vitest config (newsletter)

> Runs the colocated `*.test.{ts,tsx}` files in the newsletter module on the shared base.

## Purpose

Configures Vitest for the `@indiecrafts/modules-web-newsletter` module. It extends the repo-wide shared config (`vitest.shared`) with an empty override, so the module inherits the shared happy-dom base and runs its colocated `*.test.{ts,tsx}` files.

## Exports

- Default export: the merged Vitest config (`mergeConfig(shared, {})`).

## Source

`code/modules/web/newsletter/vitest.config.ts`
