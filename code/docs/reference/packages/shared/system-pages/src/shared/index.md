---
title: "Shared contracts barrel"
description: "Public entry for the platform-agnostic status-page contracts and shell copy."
status: stable
---

# Shared contracts barrel

> The `./shared` entry — the copy contracts and the default shell copy, no React.

## Purpose

The public entry for the platform-agnostic status-page layer. It re-exports the copy contracts and the default shell copy. It contains no React, so both the `../web` and `../native` renderers can extend these types.

## Exports

- `MaintenanceProps` — the maintenance page copy contract.
- `NotFoundContentProps` — the base 404 copy contract.
- `ErrorContentProps` — the error page copy contract.
- `SHELL_COPY` — the default per-locale copy for the non-CMS shells.
- `ShellCopy` — the type of one locale's copy bundle.

## Usage

```ts
import {
  SHELL_COPY,
  type ErrorContentProps,
} from "@indiecrafts/packages-shared-system-pages/shared";
```

## Source

`code/packages/shared/system-pages/src/shared/index.ts`
