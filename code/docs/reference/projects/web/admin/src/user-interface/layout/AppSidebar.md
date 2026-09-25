---
title: "Admin app sidebar"
description: "The dashboard's collapsible left navigation rail, driven by the NAV config."
status: stable
---

# Admin app sidebar

> The dashboard's left navigation rail.

## Purpose

The dashboard's left rail: a brand link, the grouped navigation from `NAV`, and the user menu in the footer. Icon-collapsible. It marks the active item by matching the current pathname with `activeKey`.

## Exports

- `AppSidebar` — client component; takes no props.

## Usage

```tsx
import { AppSidebar } from "@/user-interface/layout/AppSidebar";

<AppSidebar />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/AppSidebar.tsx`
