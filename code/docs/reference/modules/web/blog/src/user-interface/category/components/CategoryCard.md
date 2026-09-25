---
title: "Category card"
description: "A single category card linking to its detail page, with title, post count, and description."
status: stable
---

# Category card

> A clickable category tile with title, post count, and optional description.

## Purpose

Renders one category as a card for the `/blog/category` index: title, a post-count badge, and an optional clamped description. The whole card links to `/blog/category/<slug>`. Returns `null` when the category has no slug.

## Exports

- `CategoryCard` — server component. Props: `category` (`Category`) and `postsLabel` (a template string where `{count}` is replaced by the post count).

## Usage

```tsx
import { CategoryCard } from "@indiecrafts/modules-web-blog/user-interface/category/components/CategoryCard";

<CategoryCard category={category} postsLabel="{count} posts" />;
```

## Source

`code/modules/web/blog/src/user-interface/category/components/CategoryCard.tsx`
