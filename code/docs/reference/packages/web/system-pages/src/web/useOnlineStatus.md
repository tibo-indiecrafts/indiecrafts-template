---
title: "Online status hook"
description: "Hydration-safe React hook that tracks the browser's online/offline status."
status: stable
---

# Online status hook

> `true` while the browser reports a connection — hydration-safe via `useSyncExternalStore`.

## Purpose

Returns `true` while the browser reports a network connection, tracking the `online` and `offline` events. It uses `useSyncExternalStore` so it is hydration-safe: the server snapshot is `true` (assume online, never flash an offline banner during SSR) and the client reads the real `navigator.onLine` on hydration. `onLine` is a coarse signal, so pair it with a failed request for certainty.

## Exports

- `useOnlineStatus` — a hook returning a `boolean` online state.

## Usage

```tsx
import { useOnlineStatus } from "@indiecrafts/packages-web-system-pages/web";

const online = useOnlineStatus();
```

## Source

`code/packages/web/system-pages/src/web/useOnlineStatus.ts`
