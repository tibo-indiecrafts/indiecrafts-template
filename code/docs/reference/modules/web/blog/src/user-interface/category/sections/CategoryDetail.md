---
title: "Category detail section"
description: "The /blog/category/[slug] page — category header over a paginated grid of its posts."
status: stable
---

# Category detail section

> Category header plus a paged grid of that category's posts.

## Purpose

Renders the `/blog/category/[slug]` page. The header shows the post count, category name, and optional description; below it, a paginated grid of posts in that category. An empty post list shows the no-posts label.

## Exports

- `CategoryDetail` — server component. Props: `category` (`Category`), `posts` (`PostListItem[]`), `locale`, `breadcrumbs`, `breadcrumbsLabel`, optional `postsLabel` (`(count) => string`), `noPostsLabel`, `page`, `pageCount`, `basePath`, and `pagerLabels`.

## Usage

```tsx
import { CategoryDetail } from "@indiecrafts/modules-web-blog/user-interface/category/sections/CategoryDetail";

<CategoryDetail
  category={category}
  posts={posts}
  locale={locale}
  breadcrumbs={crumbs}
  breadcrumbsLabel={t("breadcrumbs")}
  noPostsLabel={t("noPosts")}
  page={page}
  pageCount={pageCount}
  basePath={`/blog/category/${slug}`}
  pagerLabels={pagerLabels}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/category/sections/CategoryDetail.tsx`
