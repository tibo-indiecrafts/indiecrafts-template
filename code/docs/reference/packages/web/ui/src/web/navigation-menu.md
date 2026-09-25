---
title: "Navigation menu"
description: "A site navigation bar with dropdown panels, built on the Radix NavigationMenu primitive."
status: stable
---

# Navigation menu

> A horizontal navigation bar whose items open animated dropdown panels.

## Purpose

A shadcn/ui primitive wrapping the Radix NavigationMenu. It renders a list of navigation items, each of which can open a content panel in a shared viewport (or inline when `viewport` is off), and styles triggers, links, and the active-item indicator.

## Exports

- `NavigationMenu` — the root container; takes `viewport` to render a shared dropdown viewport.
- `NavigationMenuList` — the list of top-level items.
- `NavigationMenuItem` — one navigation item.
- `NavigationMenuTrigger` — a button that opens a dropdown panel, with a chevron.
- `NavigationMenuContent` — the dropdown panel for an item.
- `NavigationMenuLink` — a styled navigation link, with an active state.
- `NavigationMenuIndicator` — an arrow that points at the open item.
- `NavigationMenuViewport` — the shared panel viewport.
- `navigationMenuTriggerStyle` — the `cva` style shared by triggers and plain links.

## Usage

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@indiecrafts/packages-web-ui/web/navigation-menu";

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

## Source

`code/packages/web/ui/src/web/navigation-menu.tsx`
