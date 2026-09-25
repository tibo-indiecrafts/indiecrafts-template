---
title: "Dropdown menu"
description: "A styled dropdown menu built on the Radix dropdown-menu primitive."
status: stable
---

# Dropdown menu

> Click-triggered menu with items, checkboxes, radios, submenus, labels, and separators.

## Purpose

`DropdownMenu` wraps the Radix dropdown-menu parts with the design-system popover, item, and animation tokens. It opens below its trigger and supports the full menu vocabulary, including a `destructive` item variant and nested submenus.

## Exports

- `DropdownMenu` — the root.
- `DropdownMenuTrigger` — the element that opens the menu.
- `DropdownMenuContent` — the portalled menu surface; accepts `sideOffset`.
- `DropdownMenuPortal` — portals the content.
- `DropdownMenuItem` — one action; accepts `inset` and `variant` (`default` or `destructive`).
- `DropdownMenuCheckboxItem` — a checkable item with an indicator.
- `DropdownMenuRadioGroup` — groups radio items.
- `DropdownMenuRadioItem` — a radio item with an indicator.
- `DropdownMenuLabel` — a non-interactive label; accepts `inset`.
- `DropdownMenuSeparator` — a divider.
- `DropdownMenuShortcut` — a right-aligned shortcut label.
- `DropdownMenuGroup` — groups items.
- `DropdownMenuSub` — a submenu root.
- `DropdownMenuSubTrigger` — opens a submenu; accepts `inset`.
- `DropdownMenuSubContent` — the submenu surface.

## Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@indiecrafts/packages-web-ui/web/dropdown-menu";

export function Actions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Source

`code/packages/web/ui/src/web/dropdown-menu.tsx`
