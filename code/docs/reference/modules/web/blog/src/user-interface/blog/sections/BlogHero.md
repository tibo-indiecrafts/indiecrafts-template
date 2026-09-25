---
title: "Blog hero grid"
description: "The five-card mosaic hero for the /blog frontpage, with a featured lead card."
status: stable
---

# Blog hero grid

> A five-card "à la une" mosaic; the first card is the featured post.

## Purpose

Renders the frontpage hero mosaic for `/blog`. It takes up to five prefetched posts and lays them out as a grid — the first two cards tall, the bottom three short, the first card spanning two columns for emphasis. Each card shows the cover image (or video play affordance), an optional category badge, the title, author, and date. Returns `null` when there are no posts.

## Exports

- `BlogHero` — server component. Props: `posts` (`PostListItem[]`), `locale`, and `label` (the section's accessible label). The internal `HeroCard` is not exported.

## Usage

```tsx
import { BlogHero } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/BlogHero";

<BlogHero posts={posts} locale={locale} label={t("heroLabel")} />;
```

## Source

`code/modules/web/blog/src/user-interface/blog/sections/BlogHero.tsx`
