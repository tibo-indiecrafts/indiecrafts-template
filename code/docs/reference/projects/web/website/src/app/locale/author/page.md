---
title: "Author index page"
description: "Lists blog authors for the active locale under the authors taxonomy route."
status: stable
---

# Author index page

> The `/[locale]/author` route: every author for the locale.

## Purpose

Lists the blog's authors for the active locale. It sits behind the `authors` taxonomy route gate and renders `AuthorListing` with heading and copy resolved from the Sanity taxonomy pages, falling back to messages.

## Exports

- `generateMetadata` — builds SEO metadata for the author index from `pages.author`.
- `AuthorIndexPage` (default) — fetches authors and renders the listing.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/author/page.tsx`
