---
title: "System page copy"
description: "Fetches editor copy for the maintenance, 404, taxonomy-index, and version-update pages from the per-locale Sanity singleton."
status: stable
---

# System page copy

> Sanity copy for the site's failure and taxonomy pages, with a messages fallback.

## Purpose

Reads editor copy from `siteMeta.<locale>` for the system pages (maintenance and 404), the taxonomy-index pages, and the version-update banner. Unlike the SEO surface, the maintenance, 404, and taxonomy fields keep `messages/<locale>.json` as a guaranteed fallback, so the caller uses `sanity ?? t(key)` per field. The version banner has no fallback — unset means off. Every fetcher returns an empty shape on any error and never throws.

## Exports

- `SystemPages` — type for the maintenance and 404 copy.
- `getSystemPages(locale)` — fetch the maintenance and 404 copy.
- `TaxonomyPageCopy` — type for one taxonomy-index page (heading, subheading, empty state).
- `TaxonomyPages` — type grouping the category, tag, and author copy.
- `getTaxonomyPages(locale)` — fetch the taxonomy-index copy.
- `VersionPrompt` — type for the version-update banner copy.
- `getVersionPrompt(locale)` — fetch the version-update banner copy.

## Usage

```ts
import { getSystemPages } from "@/lib/system-pages";

const { maintenance, notFound } = await getSystemPages(locale);
```

## Source

`code/projects/web/surfaces/website/src/lib/system-pages.ts`
