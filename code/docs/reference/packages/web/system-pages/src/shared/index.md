---
title: "Shared contracts barrel"
description: "Public entry for the platform-agnostic status-page contracts."
status: stable
---

# Shared contracts barrel

> The `./shared` entry — the copy contracts, no React.

## Purpose

The public entry for the platform-agnostic status-page layer. It re-exports the copy contracts. It contains no React, so the `../web` renderers can extend these types.

## Exports

- `MaintenanceProps` — the maintenance page copy contract.
- `NotFoundContentProps` — the base 404 copy contract.
- `ErrorContentProps` — the error page copy contract.

## Usage

```ts
import type { ErrorContentProps } from "@indiecrafts/packages-web-system-pages/shared";
```

## Source

`code/packages/web/system-pages/src/shared/index.ts`
