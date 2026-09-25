---
title: "List marker"
description: "A labelled marker row with icon and content slots and layout variants."
status: stable
---

# List marker

> A single marker row that pairs an icon slot with content, in three layout variants.

## Purpose

A shadcn/ui primitive for a muted, left-aligned marker line. It splits into an icon slot and a content slot, and offers `default`, `separator`, and `border` variants for how the row sits among siblings.

## Exports

- `Marker` — the row container; takes a `variant` (`default` | `separator` | `border`) and `asChild`.
- `MarkerIcon` — a fixed-size icon slot, marked `aria-hidden`.
- `MarkerContent` — the wrapping text content slot.
- `markerVariants` — the `cva` variant definition for the row.

## Usage

```tsx
import {
  Marker,
  MarkerIcon,
  MarkerContent,
} from "@indiecrafts/packages-web-ui/web/marker";
import { InfoIcon } from "lucide-react";

export function Note() {
  return (
    <Marker variant="border">
      <MarkerIcon>
        <InfoIcon />
      </MarkerIcon>
      <MarkerContent>Draft saved a moment ago.</MarkerContent>
    </Marker>
  );
}
```

## Source

`code/packages/web/ui/src/web/marker.tsx`
