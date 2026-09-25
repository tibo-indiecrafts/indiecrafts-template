---
title: "Native system pages barrel"
description: "Public entry for the React Native status pages and the shared contracts."
status: stable
---

# Native system pages barrel

> The `./native` entry — the React Native status pages plus the shared contracts.

## Purpose

The public entry for the React Native status pages (Maintenance, 404, 500, offline). It re-exports each component and its props type, plus everything from `../shared` (copy contracts and `SHELL_COPY`). The app owns navigation and themes the pages at the shell.

## Exports

- `Maintenance` — the native maintenance page.
- `NotFoundContent`, `NotFoundContentProps` — the native 404 screen and its props.
- `ErrorContent`, `ErrorContentProps` — the native error screen and its props.
- `OfflineContent`, `OfflineContentProps` — the native offline screen and its props.
- `OfflineBanner` — the native offline strip.
- Re-exports everything from `../shared` (the copy contracts and `SHELL_COPY`).

## Usage

```tsx
import {
  NotFoundContent,
  SHELL_COPY,
} from "@indiecrafts/packages-shared-system-pages/native";
```

## Source

`code/packages/shared/system-pages/src/native/index.ts`
