---
title: "Featured articles section"
description: "Homepage editor's-desk section: one lead article beside a compact list of runners-up."
status: stable
---

# Featured articles section

> A curated strip of featured articles, laid out as one lead pick beside a compact list of runners-up.

## Purpose

Pure display component in `src/user-interface/homepage/sections`. It shows a deliberately asymmetric "editor's desk" — a lead card next to up to three secondary rows — reading differently from the uniform `/blog` grid. The home page fetches `featuredPostsQuery` (gated behind `features.blog`), resolves the labels via i18n, and renders this only when at least one post is featured. It returns `null` when there is no lead post.

## Exports

- `FeaturedArticles` — React component; props `id`, `posts`, `locale`, `eyebrow`, `title`, `body`, `viewAllLabel`.

## Usage

```tsx
import { FeaturedArticles } from "@/user-interface/homepage/sections/FeaturedArticles";

<FeaturedArticles
  id="featured"
  posts={posts}
  locale={locale}
  eyebrow={eyebrow}
  title={title}
  body={body}
  viewAllLabel={viewAllLabel}
/>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/homepage/sections/FeaturedArticles.tsx`
