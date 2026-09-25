---
title: "Drawer"
description: "A styled edge drawer built on the vaul primitive."
status: stable
---

# Drawer

> Slide-in panel from any screen edge, built on `vaul`, with a drag handle on the bottom variant.

## Purpose

`Drawer` wraps the `vaul` drawer parts with the design-system overlay and content tokens. `DrawerContent` portals a panel that anchors to the top, bottom, left, or right edge based on the drawer direction, and shows a drag handle when opened from the bottom.

## Exports

- `Drawer` — the root; controls open state.
- `DrawerTrigger` — opens the drawer.
- `DrawerClose` — closes the drawer.
- `DrawerPortal` — portals the content.
- `DrawerOverlay` — the dimming backdrop.
- `DrawerContent` — the edge-anchored panel.
- `DrawerHeader` — the header layout slot.
- `DrawerFooter` — the footer layout slot.
- `DrawerTitle` — the accessible title.
- `DrawerDescription` — the accessible description.

## Usage

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@indiecrafts/packages-web-ui/web/drawer";

export function Menu() {
  return (
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
```

## Source

`code/packages/web/ui/src/web/drawer.tsx`
