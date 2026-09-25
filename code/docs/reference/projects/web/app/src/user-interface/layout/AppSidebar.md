---
title: "App sidebar"
description: "The app surface's collapsible left rail — brand link, flat nav, and the user footer menu."
status: stable
---

# App sidebar

> The app shell's left rail: brand link, flat `NAV`, and the user footer.

## Purpose

Renders the app surface's left sidebar. It shows the brand link, the flat `NAV` items from `nav.ts` with the active item highlighted, and the `NavUser` footer menu. The rail is icon-collapsible.

## Exports

- `AppSidebar` — the collapsible sidebar component. Takes no props; reads the active route from the router and labels from `messages.app`.

## Usage

```tsx
import { AppSidebar } from "@/user-interface/layout/AppSidebar";

<AppSidebar />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/AppSidebar.tsx`
