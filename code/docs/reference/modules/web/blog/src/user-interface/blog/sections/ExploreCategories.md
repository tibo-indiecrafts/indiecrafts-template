---
title: "Explore categories section"
description: "Frontpage category explorer — category chips over a six-post preview grid."
status: stable
---

# Explore categories section

> Category chips and a six-post preview for the `/blog` frontpage.

## Purpose

Server-rendered category explorer for the `/blog` frontpage. Each chip links to `/blog/category/<slug>` — no client-side filtering. Below the chips it shows a six-post preview of the latest articles, plus a "view all" link when there are more than six posts. Categories are sorted by post count descending. The whole section hides when there are no categories and no posts.

## Exports

- `ExploreCategories` — server component. Props: `categories` (`Category[]`), `posts` (`PostListItem[]`), `locale`, `heading`, `subheading`, `viewAllLabel`, and `allHref` (`"/blog" | "/blog/category"`).

## Usage

```tsx
import { ExploreCategories } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/ExploreCategories";

<ExploreCategories
  categories={categories}
  posts={posts}
  locale={locale}
  heading={t("categories.heading")}
  subheading={t("categories.subheading")}
  viewAllLabel={t("categories.viewAll")}
  allHref="/blog/category"
/>;
```

## Source

`code/modules/web/blog/src/user-interface/blog/sections/ExploreCategories.tsx`
