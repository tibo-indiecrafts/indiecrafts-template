---
title: "Offline banner (web)"
description: "Non-blocking web strip shown while the browser is offline, auto-hiding on reconnect."
status: stable
---

# Offline banner (web)

> A slim strip shown while the browser is offline; auto-hides on reconnect.

## Purpose

Renders a slim, non-blocking strip while the browser is offline, using `useOnlineStatus` to auto-hide on reconnect. It is a client component (`"use client"`). The copy is injected via `message`. `role="status"` and `aria-live="polite"` let a screen reader announce the change without stealing focus.

## Exports

- `OfflineBanner` — the DOM offline strip; takes `message`.

## Usage

```tsx
import { OfflineBanner } from "@indiecrafts/packages-web-system-pages/web";

<OfflineBanner message="You're offline — some features may be unavailable." />;
```

## Source

`code/packages/web/system-pages/src/web/OfflineBanner.tsx`
