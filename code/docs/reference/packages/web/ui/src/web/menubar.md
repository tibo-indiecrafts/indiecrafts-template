---
title: "Menubar"
description: "A horizontal application menu bar built on the Radix Menubar primitive."
status: stable
---

# Menubar

> A desktop-style menu bar with menus, items, checkboxes, radios, and submenus.

## Purpose

A shadcn/ui primitive that composes the Radix Menubar into styled slots. It renders a top-level bar of triggers, each opening a dropdown of items, and supports checkbox items, radio groups, labels, separators, shortcuts, and nested submenus.

## Exports

- `Menubar` — the root bar container.
- `MenubarMenu` — one menu within the bar.
- `MenubarTrigger` — the button that opens a menu.
- `MenubarContent` — the dropdown panel for a menu.
- `MenubarItem` — a menu item; takes `inset` and a `variant` (`default` | `destructive`).
- `MenubarCheckboxItem` — a toggleable item with a check indicator.
- `MenubarRadioGroup` / `MenubarRadioItem` — a mutually exclusive item set.
- `MenubarLabel` — a non-interactive section label.
- `MenubarSeparator` — a divider between items.
- `MenubarShortcut` — right-aligned shortcut text.
- `MenubarGroup` — groups related items.
- `MenubarPortal` — portals content out of the DOM flow.
- `MenubarSub` / `MenubarSubTrigger` / `MenubarSubContent` — a nested submenu.

## Usage

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@indiecrafts/packages-web-ui/web/menubar";

export function AppMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

## Source

`code/packages/web/ui/src/web/menubar.tsx`
