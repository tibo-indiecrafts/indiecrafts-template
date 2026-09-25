---
title: "Category spotlight renderer"
description: "Frontpage block showing one category's pinned and latest posts as a spotlight row."
status: stable
---

# Category spotlight renderer

> Maps a category's pinned plus latest posts onto the generic `SpotlightRow` primitive.

## Purpose

`BlogCategorySpotlight` renders the frontpage "Category Spotlight" block. It fetches the editor's pinned posts plus the latest posts from one category (`blogCategorySpotlightQuery`), respects the manual pin order with `reorderByIds`, shapes each into a `PostCardItem`, and hands them to `SpotlightRow`. The heading defaults to the category title, and a "view all" link points at the category page. It returns `null` when the category is missing or no post matches.

## Exports

- `BlogCategorySpotlight` — async server component; takes `module` (`BlogCategorySpotlightModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogCategorySpotlight } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogCategorySpotlight";

<BlogCategorySpotlight module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogCategorySpotlight.tsx`
