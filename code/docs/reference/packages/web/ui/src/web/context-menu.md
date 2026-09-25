---
title: "Context menu"
description: "A styled right-click menu built on the Radix context-menu primitive."
status: stable
---

# Context menu

> Right-click menu with items, checkboxes, radios, submenus, labels, and separators.

## Purpose

`ContextMenu` wraps the Radix context-menu parts with the design-system popover, item, and animation tokens. It opens on right-click of its trigger and supports the full menu vocabulary, including a `destructive` item variant and nested submenus.

## Exports

- `ContextMenu` — the root.
- `ContextMenuTrigger` — the element that opens the menu on right-click.
- `ContextMenuContent` — the portalled menu surface.
- `ContextMenuItem` — one action; accepts `inset` and `variant` (`default` or `destructive`).
- `ContextMenuCheckboxItem` — a checkable item with an indicator.
- `ContextMenuRadioItem` — a radio item with an indicator.
- `ContextMenuLabel` — a non-interactive label; accepts `inset`.
- `ContextMenuSeparator` — a divider.
- `ContextMenuShortcut` — a right-aligned shortcut label.
- `ContextMenuGroup` — groups items.
- `ContextMenuPortal` — portals the content.
- `ContextMenuSub` — a submenu root.
- `ContextMenuSubContent` — the submenu surface.
- `ContextMenuSubTrigger` — opens a submenu; accepts `inset`.
- `ContextMenuRadioGroup` — groups radio items.

## Usage

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@indiecrafts/packages-web-ui/web/context-menu";

export function CardMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Source

`code/packages/web/ui/src/web/context-menu.tsx`
