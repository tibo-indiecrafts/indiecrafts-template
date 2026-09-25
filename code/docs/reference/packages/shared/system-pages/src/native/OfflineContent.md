---
title: "Offline screen (native)"
description: "Presentational React Native offline screen for a screen that cannot render without the network."
status: stable
---

# Offline screen (native)

> The native offline screen — for a screen that cannot render without the network.

## Purpose

Renders the centered offline screen for React Native surfaces that need the network. It shares the `OfflineContentProps` copy contract with the web renderer and owns its own background so it reads in light and dark. The app provides `onRetry` to re-check connectivity.

## Exports

- `OfflineContent` — the React Native offline screen component.
- `OfflineContentProps` — re-exported copy contract (`title`, `description`, `retryLabel`, `onRetry`).

## Usage

```tsx
import { OfflineContent } from "@indiecrafts/packages-shared-system-pages/native";

<OfflineContent
  title="You're offline"
  description="Check your connection and try again."
  retryLabel="Try again"
  onRetry={() => refetch()}
/>;
```

## Source

`code/packages/shared/system-pages/src/native/OfflineContent.tsx`
