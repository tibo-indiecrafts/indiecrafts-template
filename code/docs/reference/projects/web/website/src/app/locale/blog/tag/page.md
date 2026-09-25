---
title: "Tag index page"
description: "Lists blog tags for the active locale under the tags taxonomy route."
status: stable
---

# Tag index page

> The `/[locale]/blog/tag` route: every tag for the locale.

## Purpose

Lists the blog's tags for the active locale. It sits behind the `tags` taxonomy route gate and renders `TagListing` with heading and copy resolved from the Sanity taxonomy pages, falling back to messages.

## Exports

- `generateMetadata` — builds SEO metadata for the tag index from `pages.tag`.
- `TagIndexPage` (default) — fetches tags and renders the listing.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/tag/page.tsx`
