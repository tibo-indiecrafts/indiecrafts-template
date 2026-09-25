---
title: "Web system pages barrel"
description: "Public entry for the DOM status pages, the online-status hook, and the shared contracts."
status: stable
---

# Web system pages barrel

> The `./web` entry — the DOM status pages plus the shared contracts; Next-agnostic.

## Purpose

The public entry for the DOM status pages (Maintenance, 404, 500, offline). It re-exports each component and its props type, the `useOnlineStatus` hook, and everything from `../shared`. It is Next-agnostic, because the 404 home link is injected.

## Exports

- `Maintenance` — the DOM maintenance page.
- `NotFoundContent`, `NotFoundContentProps` — the DOM 404 card and its props.
- `ErrorContent`, `ErrorContentProps` — the DOM error card and its props.
- `OfflineContent`, `OfflineContentProps` — the DOM offline card and its props.
- `OfflineBanner` — the DOM offline strip.
- `useOnlineStatus` — the browser online/offline hook.
- Re-exports everything from `../shared` (the copy contracts and `SHELL_COPY`).

## Usage

```tsx
import {
  NotFoundContent,
  useOnlineStatus,
} from "@indiecrafts/packages-shared-system-pages/web";
```

## Source

`code/packages/shared/system-pages/src/web/index.ts`
