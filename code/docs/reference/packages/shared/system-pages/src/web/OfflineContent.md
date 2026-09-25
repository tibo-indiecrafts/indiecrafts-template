---
title: "Offline content (web)"
description: "Presentational web offline content card for a route that cannot render without the network."
status: stable
---

# Offline content (web)

> The web offline content card — for a route that cannot render without the network.

## Purpose

Renders the centered offline card for web routes that need the network (a non-blocking banner covers the common case). It is a client component (`"use client"`). The app resolves the copy from bundled messages (never Sanity, so it renders while offline) and wraps this in its own chrome. Next-agnostic, with no `next-intl` dependency.

## Exports

- `OfflineContent` — the DOM offline card; takes `title`, `description`, `retryLabel`, `onRetry`.
- `OfflineContentProps` — re-exported copy contract.

## Usage

```tsx
import { OfflineContent } from "@indiecrafts/packages-shared-system-pages/web";

<OfflineContent
  title="You're offline"
  description="Check your connection and try again."
  retryLabel="Try again"
  onRetry={() => refetch()}
/>;
```

## Source

`code/packages/shared/system-pages/src/web/OfflineContent.tsx`
