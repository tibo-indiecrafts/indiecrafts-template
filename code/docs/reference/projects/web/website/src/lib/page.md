---
title: "Page-builder page fetcher"
description: "Fetches a generic page-builder page by slug and locale."
status: stable
---

# Page-builder page fetcher

> The runtime source for the `/[locale]/[...slug]` catch-all route.

## Purpose

Fetches a generic page-builder page by slug and locale from Sanity. It is wrapped in React `cache()` and returns `null` on error, so a Sanity hiccup 404s instead of throwing. Hidden sections are dropped in GROQ.

## Exports

- `getPage(slug, locale)` — cached fetch of one page-builder page, or `null`.

## Usage

```ts
import { getPage } from "@/lib/page";

const page = await getPage("about", "en");
```

## Source

`code/projects/web/surfaces/website/src/lib/page.ts`
