---
title: "Status page prop contracts"
description: "The platform-agnostic copy-only prop contracts for the status pages."
status: stable
---

# Status page prop contracts

> The copy contracts an app resolves and passes in — no React, DOM, or RN.

## Purpose

The platform-agnostic copy contracts for the status pages. An app resolves these props (from `messages` or Sanity) and passes them in. There is no React, DOM, or RN here, so both the `../web` (DOM) and `../native` (RN) renderers extend these with their own navigation props.

## Exports

- `MaintenanceProps` — `statusLabel`, `title`, `body`, `contactLabel`, `name`, optional `email`.
- `NotFoundContentProps` — `eyebrow`, `title`, `description`, `homeLabel`.
- `ErrorContentProps` — `title`, `description`, `retryLabel`, optional `onRetry`.
- `OfflineContentProps` — `title`, `description`, `retryLabel`, optional `onRetry`.

## Usage

```ts
import type { ErrorContentProps } from "@indiecrafts/packages-web-system-pages/shared";

const copy: ErrorContentProps = {
  title: "Something went wrong",
  description: "An unexpected error occurred.",
  retryLabel: "Try again",
};
```

## Source

`code/packages/web/system-pages/src/shared/types.ts`
