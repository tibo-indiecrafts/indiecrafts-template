---
title: "Tag detail page"
description: "Lists a blog tag's paginated posts with breadcrumbs and BreadcrumbList JSON-LD."
status: stable
---

# Tag detail page

> The `/[locale]/blog/tag/<slug>` route: one tag's posts.

## Purpose

Renders one blog tag and its paginated posts. It sits behind the `tags` taxonomy route gate. The GROQ filter 404s mismatched locale/slug combinations, so `generateStaticParams` emits one route per (locale, slug). It emits BreadcrumbList JSON-LD.

## Exports

- `generateStaticParams` — one route per (locale, slug) when tags are enabled.
- `generateMetadata` — tag title and description with translation alternates.
- `TagDetailPage` (default) — renders `TagDetail`; `notFound()` when the tag does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/tag/[slug]/page.tsx`
