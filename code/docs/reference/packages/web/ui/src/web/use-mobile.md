---
title: "useIsMobile hook"
description: "A hook that reports whether the viewport is below the 768px mobile breakpoint."
status: stable
---

# useIsMobile hook

> A hook that tracks whether the viewport is below the mobile breakpoint.

## Purpose

`useIsMobile` is a shadcn/ui hook. It subscribes to a `(max-width: 767px)` media
query with `useSyncExternalStore`, returning `true` when the viewport is under
the `768px` breakpoint. It returns `false` during server render.

## Exports

- `useIsMobile()` — returns a `boolean`: `true` when the viewport width is below `768px`.

## Usage

```tsx
import { useIsMobile } from "@indiecrafts/packages-web-ui/web/use-mobile";

const isMobile = useIsMobile();
```

## Source

`code/packages/web/ui/src/web/use-mobile.ts`
