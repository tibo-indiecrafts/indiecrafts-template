---
title: "Author detail page"
description: "Blog author profile with the author's paginated posts, breadcrumbs and Person JSON-LD."
status: stable
---

# Author detail page

> The `/[locale]/author/<slug>` route: one author's profile and their posts.

## Purpose

Renders a single blog author's profile and paginated posts. It sits behind the `authors` taxonomy route gate (`requireTaxonomyRoute`) and emits Person plus BreadcrumbList JSON-LD. Authors are translated, so each document renders at its own locale only.

## Exports

- `generateStaticParams` — emits each author's (locale, slug) pair, but only when the authors route is enabled.
- `generateMetadata` — author-specific title, description and profile OpenGraph, with translation alternates.
- `AuthorDetailPage` (default) — renders `AuthorDetail` with the posts, pagination and social labels; `notFound()` when the author does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/author/[slug]/page.tsx`
