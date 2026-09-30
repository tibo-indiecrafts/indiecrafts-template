---
title: "Site SEO read path"
description: "The sole runtime source for the site's SEO surface, reading Sanity siteMeta and siteSettings with per-request caching."
status: stable
---

# Site SEO read path

> Sanity-only fetchers for site-wide and per-page SEO — no config fallback.

## Purpose

Reads the SEO surface from Sanity (`siteMeta.<locale>` plus `siteSettings`). This is the sole runtime source — there is no config or messages fallback. A field absent in Sanity is empty, and on any fetch error the fetchers return the empty shape instead of throwing. Every fetcher is wrapped in React `cache()` so metadata generation, the page schemas, the layout, and the llms routes share one fetch per request.

## Exports

- `GlobalSchemaEntry` — type for one editor-picked JSON-LD entity.
- `PageSeo` — type for one page's resolved `seoMeta`.
- `SiteSeo` — type for the site-wide SEO (tagline, description, OG card, llms block).
- `SiteSettings` — type for the `siteSettings` singleton (brand, social, business, robots, share, theme, maker credit).
- `DEFAULT_SITE_NAME` — fallback brand name used when `siteName` is empty.
- `getSiteSeo(locale)` — fetch the site-wide SEO for a locale.
- `getPageSeo(pageId, locale)` — resolve one static route's SEO from the doc it renders (home · blog + taxonomy index · legal pages · waitlist · contact; `undefined` for a doc-less route).
- `getSiteSettings()` — fetch the `siteSettings` singleton; audits a missing production `siteName`.

## Usage

```ts
import { getPageSeo, getSiteSettings } from "@/lib/seo/site-seo";

const seo = await getPageSeo("home", locale);
const settings = await getSiteSettings();
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/site-seo.ts`
