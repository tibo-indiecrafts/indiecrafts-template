---
title: "Hover card"
description: "A styled hover-triggered popover built on the Radix hover-card primitive."
status: stable
---

# Hover card

> Popover that opens on hover, built on Radix `HoverCard`.

## Purpose

`HoverCard` wraps the Radix hover-card parts with the design-system popover and animation tokens. `HoverCardContent` portals a fixed-width card that opens when the trigger is hovered or focused.

## Exports

- `HoverCard` — the root; controls open state and delays.
- `HoverCardTrigger` — the element that opens the card on hover.
- `HoverCardContent` — the portalled card surface; accepts `align` and `sideOffset`.

## Usage

```tsx
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@indiecrafts/packages-web-ui/web/hover-card";

export function Preview() {
  return (
    <HoverCard>
      <HoverCardTrigger>@handle</HoverCardTrigger>
      <HoverCardContent>Profile preview</HoverCardContent>
    </HoverCard>
  );
}
```

## Source

`code/packages/web/ui/src/web/hover-card.tsx`
