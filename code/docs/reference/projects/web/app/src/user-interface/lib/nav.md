---
title: "Sidebar nav model"
description: "The app's flat sidebar nav list plus a helper that resolves the active item from a pathname."
status: stable
---

# Sidebar nav model

> The flat sidebar nav plus active-item resolution.

## Purpose

Defines the app surface's flat sidebar navigation. `NAV` is the ordered item list (Home, Account), each with a key, href, and Lucide icon. `activeKey` strips an optional locale prefix from a pathname and returns the key of the longest matching item, so the sidebar can highlight the current route.

## Exports

- `NAV` — the ordered array of `NavItem` entries.
- `activeKey(pathname)` — returns the active item's key, or `undefined` when none matches.
- `NavItem` — type: `{ key: string; href: string; icon: LucideIcon }`.

## Usage

```ts
import { NAV, activeKey } from "@/user-interface/lib/nav";

const current = activeKey("/en/account"); // "account"
```

## Source

`code/projects/web/surfaces/app/src/user-interface/lib/nav.ts`
