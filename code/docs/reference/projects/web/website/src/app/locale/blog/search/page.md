---
title: "Blog search page"
description: "Prefix-match search over blog posts for a query, gated by the search feature."
status: stable
---

# Blog search page

> The `/[locale]/blog/search` route: find posts by query.

## Purpose

Renders the blog search form and results for a `?q=` query. The search is a prefix match with GROQ params bound as values, so a query cannot inject. Results are capped at `SEARCH_LIMIT` with no pagination, and the page is `noindex, follow` (no lasting content, but crawlers still reach the linked posts). The route `notFound()`s when the search feature is off.

## Exports

- `SEARCH_LIMIT` — the result cap (30).
- `generateMetadata` — builds the search page's `noindex, follow` metadata.
- `BlogSearchPage` (default) — renders the form and results.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/search/page.tsx`
