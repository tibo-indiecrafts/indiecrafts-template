---
title: "Admin navigation config"
description: "The admin sidebar navigation groups and the active-item resolver."
status: stable
---

# Admin navigation config

> The sidebar's grouped nav and its active-item lookup.

## Purpose

Defines the admin sidebar navigation as grouped items (`NAV`) and resolves which item is active for a pathname. `activeKey` strips the optional locale prefix — built from the registered locale codes, so a new locale needs no change — then picks the item whose href is the longest matching prefix.

## Exports

- `NAV` — the grouped navigation config (`NavGroup[]`).
- `activeKey(pathname)` — the key of the active nav item, or `undefined`.
- `NavItem` — a single nav-item type.
- `NavGroup` — a nav-group type.

## Usage

```ts
import { NAV, activeKey } from "@/user-interface/lib/nav";

const current = activeKey(pathname);
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/lib/nav.ts`
