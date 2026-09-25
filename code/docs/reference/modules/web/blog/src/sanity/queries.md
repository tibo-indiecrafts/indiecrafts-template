---
title: "Blog GROQ queries"
description: "The blog's GROQ queries plus the shared post-card and module projections."
status: stable
---

# Blog GROQ queries

> Every read the blog makes, plus the shared projections.

## Purpose

Defines the blog's GROQ queries with `defineQuery` (typegen-ready). Every post / category / tag read filters by `$locale` with no cross-locale fallback, and every public listing filters out noindex, unpublished, and future-dated posts. It also exports the shared post-card and module projections that the listings and renderers reuse.

## Exports

- `POST_CARD_PROJECTION` — the shared post-card field shape for every listing.
- `MODULES_FRAGMENT` — the generic page-builder projection plus the blog-specific module fields.
- Post reads — `allPostsQuery`, `featuredPostsQuery`, `postBySlugQuery`, `relatedPostsQuery`, `allPostSlugsQuery`, `rssPostsQuery`, `searchPostsQuery`.
- Series reads — `seriesBySlugQuery`, `postsBySeriesSlugQuery`, `postsBySeriesCountQuery`, `allSeriesSlugsQuery`.
- Blog singleton — `blogSingletonQuery`, `blogDisplayQuery`.
- Comments — `approvedCommentsQuery` (never projects `authorEmail`).
- Category reads — `categoriesForLocaleQuery`, `categoryNavQuery`, `categoryBySlugQuery`, `postsByCategorySlugQuery`, `postsByCategoryCountQuery`, `allCategorySlugsQuery`.
- Tag reads — `tagsForLocaleQuery`, `tagBySlugQuery`, `postsByTagSlugQuery`, `postsByTagCountQuery`, `allTagSlugsQuery`.
- Author reads — `authorsForLocaleQuery`, `authorBySlugQuery`, `postsByAuthorSlugQuery`, `postsByAuthorCountQuery`, `allAuthorSlugsQuery`.
- LLM and module reads — `taxonomyForLlmsQuery`, `moduleBlogPostListQuery`, `blogHeroQuery`, `blogFeaturedQuery`, `blogCategorySpotlightQuery`, `blogCollectionQuery`.

## Usage

```ts
import { allPostsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";

const posts = await sanityFetchLive({
  query: allPostsQuery,
  params: { locale },
});
```

## Source

`code/modules/web/blog/src/sanity/queries.ts`
