---
title: "Sidebar"
description: "A collapsible application sidebar with provider, menu, and slot parts."
status: stable
---

# Sidebar

> A full application sidebar: a provider, a collapsible container, and menu slots.

## Purpose

A shadcn/ui primitive that assembles a complete app sidebar. `SidebarProvider` holds open/collapsed state, persists it to a cookie, and binds a keyboard shortcut. `Sidebar` renders as an off-canvas, icon, or fixed panel on desktop, and as a `Sheet` on mobile. The remaining parts compose the header, content, footer, groups, and menu tree.

## Exports

- `SidebarProvider` — state provider; takes `defaultOpen`, `open`, `onOpenChange`.
- `Sidebar` — the container; takes `side`, `variant`, `collapsible`.
- `useSidebar` — hook for sidebar state, including `toggleSidebar`.
- `SidebarTrigger` / `SidebarRail` — controls that toggle the sidebar.
- `SidebarInset` — the main content area beside the sidebar.
- `SidebarHeader` / `SidebarContent` / `SidebarFooter` — the top, scrollable, and bottom regions.
- `SidebarInput` — a search input styled for the sidebar.
- `SidebarSeparator` — a divider inside the sidebar.
- `SidebarGroup` / `SidebarGroupLabel` / `SidebarGroupAction` / `SidebarGroupContent` — a labelled section with an optional action.
- `SidebarMenu` / `SidebarMenuItem` / `SidebarMenuButton` — the menu list, items, and buttons; the button takes `isActive`, `tooltip`, `variant`, `size`.
- `SidebarMenuAction` / `SidebarMenuBadge` / `SidebarMenuSkeleton` — a per-item action, badge, and loading placeholder.
- `SidebarMenuSub` / `SidebarMenuSubItem` / `SidebarMenuSubButton` — the nested submenu list, items, and buttons.

## Usage

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@indiecrafts/packages-web-ui/web/sidebar";

export function AppShell() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## Source

`code/packages/web/ui/src/web/sidebar.tsx`
