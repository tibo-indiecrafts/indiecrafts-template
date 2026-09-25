---
title: "Blog page hero"
description: "Centered editorial header shared by every top-level blog listing page."
status: stable
---

# Blog page hero

> A centered editorial header — pill tag, balanced h1, subtitle, and an optional pill sub-nav.

## Purpose

`PageHero` is the shared header used by every top-level blog listing page (blog frontpage, authors, categories, tags). It renders an optional pill `tag` above the h1, a large balanced h1, an optional muted subtitle, and an optional pill-style sub-nav row for pages within the blog cluster. It has no card chrome — the visual rhythm comes from the type scale and the pill row.

## Exports

- `PageHero` — component taking `{ tag?, title, subtitle?, titleId?, pills?, pillsLabel? }`. `pillsLabel` falls back to `title` so the sub-nav label is never hard-coded.
- `PageHeroPill` — type `{ label: string; href: string; active?: boolean }`.

## Usage

```tsx
import {
  PageHero,
  type PageHeroPill,
} from "@indiecrafts/modules-web-blog/user-interface/shared/sections/PageHero";

const pills: PageHeroPill[] = [
  { label: t("all"), href: "/blog", active: true },
  { label: t("tags"), href: "/blog/tag" },
];

<PageHero
  titleId="tag-listing-title"
  title={heading}
  subtitle={subheading}
  pills={pills}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/shared/sections/PageHero.tsx`
