---
title: "Category listing section"
description: "The /blog/category index — a grid of category cards sorted by post count."
status: stable
---

# Category listing section

> The `/blog/category` index: a hero plus a grid of category cards.

## Purpose

Renders the `/blog/category` index page: breadcrumbs, a `PageHero`, and a grid of `CategoryCard`s sorted by post count descending so the most active topics lead. An empty list shows the empty-state label.

## Exports

- `CategoryListing` — server component. Props: `categories` (`Category[]`), `breadcrumbs`, `breadcrumbsLabel`, `heading`, `subheading`, `emptyLabel`, `postsLabel`, and optional `pills`.

## Usage

```tsx
import { CategoryListing } from "@indiecrafts/modules-web-blog/user-interface/category/sections/CategoryListing";

<CategoryListing
  categories={categories}
  breadcrumbs={crumbs}
  breadcrumbsLabel={t("breadcrumbs")}
  heading={t("heading")}
  subheading={t("subheading")}
  emptyLabel={t("empty")}
  postsLabel="{count} posts"
/>;
```

## Source

`code/modules/web/blog/src/user-interface/category/sections/CategoryListing.tsx`
