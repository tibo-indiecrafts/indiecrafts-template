---
title: "Featured posts"
description: "Renders featured posts as a lead card over a grid, or a lead card beside a short list."
status: stable
---

# Featured posts

> Featured posts in a `grid` or `editorial` layout.

## Purpose

Renders the blog's `module.blog-featured` block under an optional header: eyebrow, heading, intro and a "view all" link. `layout` picks the body:

- `grid` (default) — an optional large `lead` card spans the grid, with compact `PostCard`s for the rest. With no `lead`, it is a plain grid.
- `editorial` — the lead card beside a short list of runners-up, through `FeaturedEditorial`.

All data is pre-resolved, so the component stays presentational: no i18n, no routing. The layout follows its container, so it fits a full-width section, a narrow column and a page with a sidebar. `anchor` sets the section id and the heading id. It renders nothing with no post.

## Exports

- `FeaturedPosts` — takes `layout`, `eyebrow`, `heading`, `intro`, `viewAll`, `lead`, `items`, `anchor`, and `playLabel` (the editorial lead's video play label, default `"Play video"`).

## Usage

```tsx
import { FeaturedPosts } from "@indiecrafts/packages-web-ui-components/web/collection/FeaturedPosts";

<FeaturedPosts
  layout="editorial"
  eyebrow="From the blog"
  heading="Featured"
  viewAll={{ label: "All posts", href: "/blog" }}
  lead={leadPost}
  items={posts}
  playLabel={t("play")}
/>;
```

## Source

`code/packages/web/ui-components/src/web/collection/FeaturedPosts.tsx`
