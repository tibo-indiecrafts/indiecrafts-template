---
title: "Post list renderer"
description: "Server module that fetches filtered posts and renders them as a BlogCard grid."
status: stable
---

# Post list renderer

> Fetches posts by the module's filters and renders the shared `BlogCard` grid.

## Purpose

`BlogPostList` is a server component that fetches its own posts using the module's filters (categories, limit, featured-only) via `moduleBlogPostListQuery` and renders them with the shared `BlogCard`, so every post grid on the site looks the same. Null category refs (deleted or private) are filtered before the query. It shows an optional title/intro header and an empty-state message when no post matches.

## Exports

- `BlogPostList` — async server component; takes `module` (`BlogPostListModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogPostList } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogPostList";

<BlogPostList module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogPostList.tsx`
