---
title: "Tag detail section"
description: "Tag archive page with a header card and a paginated, locale-filtered post grid."
status: stable
---

# Tag detail section

> The `/blog/tag/[slug]` page — tag header plus every post carrying the tag.

## Purpose

`TagDetail` renders the tag archive page at `/blog/tag/[slug]`. The header shows the tag label, post count, and description. Below it is a paginated grid of every post carrying the tag, locale-filtered. It composes `Breadcrumbs`, `BlogCard`, and `Pager`, and shows `noPostsLabel` when the tag has no posts.

## Exports

- `TagDetail` — component taking `{ tag, posts, locale, breadcrumbs, breadcrumbsLabel, postsLabel? ((count) => string), noPostsLabel, page, pageCount, basePath, pagerLabels }`.

## Usage

```tsx
import { TagDetail } from "@indiecrafts/modules-web-blog/user-interface/tag/sections/TagDetail";

<TagDetail
  tag={tag}
  posts={posts}
  locale={locale}
  breadcrumbs={breadcrumbs}
  breadcrumbsLabel={t("breadcrumbs")}
  noPostsLabel={t("empty")}
  page={page}
  pageCount={pageCount}
  basePath={`/blog/tag/${tag.slug}`}
  pagerLabels={pagerLabels}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/tag/sections/TagDetail.tsx`
