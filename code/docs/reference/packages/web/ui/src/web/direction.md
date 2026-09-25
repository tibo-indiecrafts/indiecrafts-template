---
title: "Direction provider"
description: "A wrapper over the Radix direction provider for right-to-left support."
status: stable
---

# Direction provider

> Sets the reading direction (`ltr` or `rtl`) for descendant Radix components.

## Purpose

`DirectionProvider` wraps the Radix `Direction.DirectionProvider` so descendant primitives resolve their layout direction. It accepts either `dir` or an alias `direction` prop, and `direction` takes precedence when both are set.

## Exports

- `DirectionProvider` — provides the reading direction; accepts `dir` or `direction` (`ltr` or `rtl`).
- `useDirection` — the Radix hook that reads the current direction.

## Usage

```tsx
import { DirectionProvider } from "@indiecrafts/packages-web-ui/web/direction";

export function RtlRoot({ children }: { children: React.ReactNode }) {
  return <DirectionProvider direction="rtl">{children}</DirectionProvider>;
}
```

## Source

`code/packages/web/ui/src/web/direction.tsx`
