---
title: "Category nav builder"
description: "Server helper that fetches blog categories and returns the CategoryNav node."
status: stable
---

# Category nav builder

> The blog category bar as a ready-to-render node, or `null`.

## Purpose

A server helper (not a component) for the app layout's `subnav` slot. It reads the editor's `categoryNav` toggle, fetches the locale's top-level categories plus sub-categories, resolves their `/blog/category/<slug>` hrefs, and returns the presentational `CategoryNav` from `ui-components`. It returns `null` when the toggle is off or there are no categories.

## Exports

- `getCategoryNav(locale)` — resolves to a `ReactNode` (the nav), or `null`.

## Usage

```tsx
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";

const subnav = await getCategoryNav(locale);
```

## Source

`code/modules/web/blog/src/lib/category-nav.ts`
