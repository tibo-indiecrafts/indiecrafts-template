---
title: "Blog listing section"
description: "A titled two- or three-column grid of blog cards, used as the /blog empty-state fallback."
status: stable
---

# Blog listing section

> A heading plus a responsive grid of blog cards.

## Purpose

Renders a titled grid of posts. Defaults to three columns; pass `cols={2}` when each card needs more horizontal room (cards then render in the `wide` variant). Used as the empty-state fallback on `/blog`. An empty post list shows the no-posts label.

## Exports

- `BlogListing` — server component. Props: `posts` (`PostListItem[]`), `locale`, `heading`, `subheading`, `noPostsLabel`, and optional `cols` (`2 | 3`, default `3`).

## Usage

```tsx
import { BlogListing } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/BlogListing";

<BlogListing
  posts={posts}
  locale={locale}
  heading={t("heading")}
  subheading={t("subheading")}
  noPostsLabel={t("noPosts")}
  cols={3}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/blog/sections/BlogListing.tsx`
