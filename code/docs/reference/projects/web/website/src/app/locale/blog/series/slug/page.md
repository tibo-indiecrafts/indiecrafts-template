---
title: "Series detail page"
description: "Lists a blog series' paginated posts with breadcrumbs and BreadcrumbList JSON-LD."
status: stable
---

# Series detail page

> The `/[locale]/blog/series/<slug>` route: one series' posts in order.

## Purpose

Renders one blog series and its paginated posts. It sits behind the series feature gate (`isSeriesEnabled`) and emits BreadcrumbList JSON-LD. Each series document renders at its own locale only.

## Exports

- `generateStaticParams` — one route per (locale, slug) when the series feature is enabled.
- `generateMetadata` — series title and description with translation alternates.
- `SeriesDetailPage` (default) — renders `SeriesDetail`; `notFound()` when the series does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/series/[slug]/page.tsx`
