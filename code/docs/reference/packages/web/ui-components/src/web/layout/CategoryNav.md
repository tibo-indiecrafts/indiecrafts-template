---
title: "Category nav bar"
description: "Horizontal category bar that opens a dropdown for any category with children."
status: stable
---

# Category nav bar

> A row of top-level categories; each one with children opens a keyboard-friendly dropdown.

## Purpose

`CategoryNav` renders a horizontal row of top-level categories. A category with children opens a dropdown (shadcn `NavigationMenu`, so keyboard and focus are handled); one without is a plain link. It is data-driven over resolved `{ title, href }` items and renders nothing when there are no items. Each dropdown leads with an "all of {category}" link built from `allLabel` plus the parent title.

## Exports

- `CategoryNavChild` — type: a leaf link (`title`, `href`, optional `_key`).
- `CategoryNavItem` — type: a top-level category, optionally with `children`.
- `CategoryNav({ items, label, allLabel })` — the nav-bar component.

## Usage

```tsx
import { CategoryNav } from "@indiecrafts/packages-web-ui-components/web/layout/CategoryNav";

<CategoryNav
  label="Categories"
  allLabel="All of"
  items={[
    {
      title: "Guides",
      href: "/guides",
      children: [{ title: "SEO", href: "/guides/seo" }],
    },
  ]}
/>;
```

## Source

`code/packages/web/ui-components/src/web/layout/CategoryNav.tsx`
