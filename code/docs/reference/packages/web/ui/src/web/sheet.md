---
title: "Sheet"
description: "A slide-in panel from any edge, built on the Radix Dialog primitive."
status: stable
---

# Sheet

> A dialog that slides in from the top, right, bottom, or left edge.

## Purpose

A shadcn/ui primitive that composes the Radix Dialog into an edge-anchored panel. It renders an overlay and a content panel that slides in from the chosen `side`, with header, footer, title, and description slots and an optional close button.

## Exports

- `Sheet` — the root state container.
- `SheetTrigger` — the element that opens the sheet.
- `SheetClose` — an element that closes the sheet.
- `SheetContent` — the sliding panel; takes `side` and `showCloseButton`.
- `SheetHeader` — the header region.
- `SheetFooter` — the footer region, pinned to the bottom.
- `SheetTitle` — the accessible title.
- `SheetDescription` — the accessible description.

## Usage

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@indiecrafts/packages-web-ui/web/sheet";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

export function FiltersSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
```

## Source

`code/packages/web/ui/src/web/sheet.tsx`
