---
title: "Category index page"
description: "Lists blog categories for the active locale under the categories taxonomy route."
status: stable
---

# Category index page

> The `/[locale]/blog/category` route: every category for the locale.

## Purpose

Lists the blog's categories for the active locale. It sits behind the `categories` taxonomy route gate and renders `CategoryListing` with heading and copy resolved from the Sanity taxonomy pages (`siteMeta.<locale>.taxonomyPages.category`), falling back to messages.

## Exports

- `generateMetadata` — builds SEO metadata for the category index from `pages.category`.
- `CategoryIndexPage` (default) — fetches categories and renders the listing.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/category/page.tsx`
