---
title: "Popover"
description: "A floating panel anchored to a trigger, built on the Radix Popover primitive."
status: stable
---

# Popover

> A dismissible floating panel positioned against a trigger or anchor.

## Purpose

A shadcn/ui primitive wrapping the Radix Popover. It opens a portalled, animated content panel next to its trigger, with optional header, title, and description slots for structured content.

## Exports

- `Popover` — the root state container.
- `PopoverTrigger` — the element that toggles the panel.
- `PopoverContent` — the floating panel; takes `align` and `sideOffset`.
- `PopoverAnchor` — an alternate positioning anchor.
- `PopoverHeader` — a header wrapper inside the panel.
- `PopoverTitle` — the panel title.
- `PopoverDescription` — muted description text.

## Usage

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
} from "@indiecrafts/packages-web-ui/web/popover";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

export function InfoPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Shipping</PopoverTitle>
        Delivered in 3–5 business days.
      </PopoverContent>
    </Popover>
  );
}
```

## Source

`code/packages/web/ui/src/web/popover.tsx`
