---
title: "Sitemap"
description: "Builds the sitemap of every route and locale with hreflang alternates."
status: stable
---

# Sitemap

> Every route by locale, static and Sanity-driven, with per-locale `hreflang` alternates.

## Purpose

The default export is Next.js's Metadata `sitemap` route. It emits every static route (from the `pages` map via `app/routes.ts`), every generic page-builder page, and — when `features.blog` is on — the Sanity-driven blog entries (posts, categories, tags, series, authors). Each entry carries `hreflang` alternates for the locales it exists in. Routes opt out via `seo.noindex`, `seo.robots.index = false`, or `enabled: false`; a per-locale `.seo.noIndex` drops single locales. The whole sitemap is empty when `features.sitemap` is off.

## Exports

- `default` (`sitemap`) — async; returns a `MetadataRoute.Sitemap`.

## Source

`code/projects/web/surfaces/website/src/app/sitemap.ts`
