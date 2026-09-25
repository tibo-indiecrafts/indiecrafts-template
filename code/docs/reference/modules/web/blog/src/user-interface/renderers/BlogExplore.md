---
title: "Explore renderer"
description: "Frontpage block that picks the categories, tags, or top-authors explorer by variant."
status: stable
---

# Explore renderer

> Thin wrapper choosing one of the code-default explore sections by `m.variant`.

## Purpose

`BlogExplore` renders the frontpage "Explore" block. It reads `m.variant` and delegates to one of the code-default explorer sections: `ExploreCategories`, `ExploreTags`, or `TopAuthors`, fetching that variant's list first. It returns `null` when the variant's taxonomy is off (code flag or editor toggle, via `getBlogSettings`); the wrapped section itself renders nothing when its list is empty. Headings fall back to translated defaults when the editor leaves them blank.

## Exports

- `BlogExplore` — async server component; takes `module` (`BlogExploreModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogExplore } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogExplore";

<BlogExplore module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogExplore.tsx`
