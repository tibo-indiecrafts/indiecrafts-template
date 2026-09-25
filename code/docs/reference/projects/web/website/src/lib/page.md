---
title: "Page-builder page fetcher"
description: "Fetches a generic page-builder page by slug and locale, plus every page's static params."
status: stable
---

# Page-builder page fetcher

> The runtime source for the `/[locale]/[...slug]` catch-all route.

## Purpose

Fetches a generic page-builder page by slug and locale from Sanity, and the full list of published page params for `generateStaticParams`. Both are wrapped in React `cache()`; the by-slug fetch returns `null` on error (so a Sanity hiccup 404s instead of throwing) and the params fetch returns `[]`. Hidden sections are dropped in GROQ.

## Exports

- `getPage(slug, locale)` — cached fetch of one page-builder page, or `null`.
- `getAllPageParams()` — cached list of every published `{ slug, locale }` pair.

## Usage

```ts
import { getPage, getAllPageParams } from "@/lib/page";

export async function generateStaticParams() {
  return getAllPageParams();
}

const page = await getPage("about", "en");
```

## Source

`code/projects/web/surfaces/website/src/lib/page.ts`
