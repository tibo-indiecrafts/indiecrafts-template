---
title: "Network status hook"
description: "A React hook that reports whether the device has a usable network connection, tracked via NetInfo."
status: stable
---

# Network status hook

> Live online/offline state for the device, from NetInfo.

## Purpose

Returns `true` while the device has a usable network connection. It subscribes to NetInfo and starts `true`, so there is no false offline flash at launch. Only an explicit `false` for `isConnected` or `isInternetReachable` marks the device offline; an unknown (`null`) reachability reads as online.

## Exports

- `useNetworkStatus()` — React hook returning a `boolean` (online).

## Usage

```tsx
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const online = useNetworkStatus();
```

## Source

`code/projects/mobile/surfaces/main/hooks/useNetworkStatus.ts`
