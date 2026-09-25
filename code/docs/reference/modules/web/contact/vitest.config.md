---
title: "Vitest config (contact)"
description: "Vitest configuration for the contact module; extends the shared happy-dom base."
status: stable
---

# Vitest config (contact)

> Runs the colocated `*.test.{ts,tsx}` files in the contact module on the shared base.

## Purpose

Configures Vitest for the `@indiecrafts/modules-web-contact` module. It extends the repo-wide shared config (`vitest.shared`) with an empty override, so the module inherits the shared happy-dom base and runs its colocated `*.test.{ts,tsx}` files.

## Exports

- Default export: the merged Vitest config (`mergeConfig(shared, {})`).

## Source

`code/modules/web/contact/vitest.config.ts`
