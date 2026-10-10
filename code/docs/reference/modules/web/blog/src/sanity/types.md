---
title: "Blog content types"
description: "Shared TypeScript types for blog documents, post fragments, display settings, and page-builder modules."
status: stable
---

# Blog content types

> The type surface for every blog document, GROQ projection shape, and module.

## Purpose

Central type declarations for the blog. It re-exports the generic block and presentational types from `@indiecrafts/packages-web-ui-components` so existing importers keep resolving them, and adds the blog-specific document, fragment, settings, and module types.

## Exports

- Re-exports from `@indiecrafts/packages-web-ui-components/shared/types` — `ImageRef`, `ResolvedLink`, `Cta`, `GalleryImage`, `BlockModule`, and the generic module types (`CalloutModule`, `GalleryModule`, `ProseModule`, and more).
- `SeoMeta` — slug-less SEO and visibility override (`noIndex`, `hideFromDiscovery`, `unpublished`).
- `AuthorRef`, `Author`, `AuthorSocial` — author fragment, full author document, and one profile link.
- `CategoryRef`, `Category`, `TagRef`, `Tag`, `Series`, `SeriesRef` — taxonomy and series references and full documents.
- `PostMetadata`, `PostListItem`, `Post`, `Heading`, `PostSlug`, `RssPost` — post shapes for cards, the post page, the RSS feed, and the table of contents. `Post.sidebar` holds the post's own sidebar choice.
- `SidebarField` — a projected `sidebar` field: an alias of `SidebarChoice<AnyModule>` (its `mode` and its visible `blocks`).
- `BlogIndexModule`, `BlogPostContentModule`, `BlogPostListModule`, `BlogHeroModule`, `BlogFeaturedModule`, `BlogExploreModule`, `BlogCategorySpotlightModule`, `BlogCollectionModule`, `BlogTrendingModule`, `BlogTopicCardsModule`, `BlogTocModule`, `BlogRelatedModule` — the blog's page-builder modules. `BlogFeaturedModule` has a `layout` (`grid` or `editorial`), `eyebrow`, `intro` and `viewAll`. `BlogTocModule` and `BlogRelatedModule` are sidebar cards for posts only.
- `AnyModule` — union of every module a blog page can hold.
- `BlogSingleton`, `BlogDisplayRaw`, `BlogDisplay` — the singleton shape and the raw vs. resolved display toggles. `BlogDisplay.post` has no `tableOfContents` toggle: the `blog-toc` sidebar card replaces it.
- `Comment`, `LocaleString`, `CommentsCopy` — a public comment, a per-locale value, and the editable comment-section copy.

## Source

`code/modules/web/blog/src/sanity/types.ts`
