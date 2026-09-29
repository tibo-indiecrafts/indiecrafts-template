---
title: "Article OpenGraph helper"
description: "Builds the article:* OpenGraph fields for a blog post — type: article plus published/modified time, authors, and section."
status: stable
---

# Article OpenGraph helper

> Makes a blog post announce itself as an article to social + search crawlers, not a generic web page.

## Purpose

Returns the `article:*` OpenGraph fields for a blog post: `type: "article"` plus `publishedTime`, `modifiedTime`, `authors`, and `section`, derived from the post's own fields. Pure and structurally typed, so it unit-tests without a Sanity fetch. Spread into the post page's `generateMetadata` `openGraph`.

`modifiedTime` falls back to `publishedTime` when a post has no update date; `authors` and `section` are omitted when empty rather than emitted blank.

## Exports

- `articleOpenGraph(post)` — takes a post with optional `publishedAt`, `updatedAt`, `authors[].name`, and `categories[].title`; returns the OpenGraph article fragment.

## Usage

```ts
import { articleOpenGraph } from "@/lib/seo/article-og";

openGraph: {
  ...articleOpenGraph(post),
  // …title, description, images
}
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/article-og.ts`
