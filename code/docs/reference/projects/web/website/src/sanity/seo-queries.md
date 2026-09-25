---
title: "Core SEO queries"
description: "Feature-independent GROQ queries for site-wide SEO, per-page seoMeta, system-page copy, and site settings."
status: stable
---

# Core SEO queries

> The core GROQ queries that survive with the blog removed — site-wide SEO defaults, the shared `seoMeta` projection, system-page copy, and the site settings singleton.

## Purpose

Holds the core SEO GROQ queries, kept out of `features/blog` so site-wide SEO survives with the blog removed. `defineQuery` flags each for `sanity typegen`. The queries are consumed by `src/lib/seo/site-seo.ts` and `src/lib/system-pages.ts`. A shared `seoMeta` projection is reused across the home, blog, legal, and waitlist per-page SEO queries.

## Exports

- `siteSeoQuery` — per-locale site-wide SEO defaults (`siteMeta.<lang>`), param `id`.
- `homeSeoQuery` — the home `page` doc's `.seo` for one locale.
- `blogSeoQuery` — the `/blog` frontpage SEO plus taxonomy list-page overrides.
- `legalSeoQuery` — one legal page's SEO by `pageKey` + locale.
- `waitlistSeoQuery` — the waitlist landing SEO from `waitlistSettings`.
- `systemPagesQuery` — maintenance + 404 copy for one locale.
- `taxonomyPagesQuery` — category/tag/author listing-page copy for one locale.
- `versionPromptQuery` — version-update banner copy for one locale.
- `siteSettingsQuery` — the language-independent `siteSettings` singleton.

## Usage

```ts
import { siteSeoQuery } from "@/sanity/seo-queries";
import { sanityFetch } from "@/sanity/live";

const seo = await sanityFetch({
  query: siteSeoQuery,
  params: { id: "siteMeta.en" },
});
```

## Source

`code/projects/web/surfaces/website/src/sanity/seo-queries.ts`
