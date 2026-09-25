---
title: "Author detail section"
description: "The /author/[slug] page section — author hero plus a paginated grid of that author's posts."
status: stable
---

# Author detail section

> Author portrait, bio, social links, and a paged grid of their posts.

## Purpose

Renders the `/author/[slug]` page. A hero block shows the portrait, name, position, bio, post count, and social links; below it, a paginated grid of every published post by this author in the current locale. Posts and page data are prefetched by the route.

## Exports

- `AuthorDetail` — server component. Props include `author` (`Author`), `posts` (`PostListItem[]`), `total`, `locale`, `breadcrumbs`, page labels, `page`, `pageCount`, `basePath`, and `pagerLabels`.

## Usage

```tsx
import { AuthorDetail } from "@indiecrafts/modules-web-blog/user-interface/author/sections/AuthorDetail";

<AuthorDetail
  author={author}
  posts={posts}
  total={total}
  locale={locale}
  breadcrumbs={crumbs}
  breadcrumbsLabel={t("breadcrumbs")}
  noPostsLabel={t("noPosts")}
  socialLabels={socialLabels}
  page={page}
  pageCount={pageCount}
  basePath={`/author/${slug}`}
  pagerLabels={pagerLabels}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/author/sections/AuthorDetail.tsx`
