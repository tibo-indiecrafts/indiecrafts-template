---
title: "Series detail page"
description: "The /blog/series/[slug] landing page listing a series' posts in reading order."
status: stable
---

# Series detail page

> Series header plus a paginated grid of its posts in reading order.

## Purpose

`SeriesDetail` renders the series landing page at `/blog/series/[slug]`. The header shows the series title, part count, and description, above the series' posts in reading order (`seriesOrder`, then date). Posts render in the shared `BlogCard` grid with `Pager` pagination, matching the taxonomy listings, and an empty-state message shows when the series has no posts.

## Exports

- `SeriesDetail` — component; takes `series` (`Series`), `posts` (`PostListItem[]`), `total`, `locale`, `breadcrumbs`, pagination props (`page`, `pageCount`, `basePath`, `pagerLabels`), and label strings.

## Usage

```tsx
import { SeriesDetail } from "@indiecrafts/modules-web-blog/user-interface/series/sections/SeriesDetail";

<SeriesDetail
  series={series}
  posts={posts}
  total={total}
  locale={locale}
  breadcrumbs={breadcrumbs}
  breadcrumbsLabel={t("breadcrumbsLabel")}
  noPostsLabel={t("noPosts")}
  page={page}
  pageCount={pageCount}
  basePath={basePath}
  pagerLabels={pagerLabels}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/series/sections/SeriesDetail.tsx`
