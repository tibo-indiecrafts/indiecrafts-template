---
title: "Category detail page"
description: "Lists a blog category's paginated posts with breadcrumbs and BreadcrumbList JSON-LD."
status: stable
---

# Category detail page

> The `/[locale]/blog/category/<slug>` route: one category's posts.

## Purpose

Renders one blog category and its paginated posts. It sits behind the `categories` taxonomy route gate. The GROQ query 404s mismatched locale/slug combinations, so `generateStaticParams` can emit one route per (locale, slug) without fanning out to every locale. It emits BreadcrumbList JSON-LD.

## Exports

- `generateStaticParams` — one route per (locale, slug) when categories are enabled.
- `generateMetadata` — category title and description with translation alternates.
- `CategoryDetailPage` (default) — renders `CategoryDetail`; `notFound()` when the category does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/category/[slug]/page.tsx`
