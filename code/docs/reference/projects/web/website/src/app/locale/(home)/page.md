---
title: "Home page route"
description: "The production home page — editor-composed page-builder blocks plus code-only template showcases and live featured posts."
status: stable
---

# Home page route

> The `/[locale]` index: editor blocks, template showcases, and live featured articles.

## Purpose

The production home page for the website surface. It renders the editor-composed home `page` document (its blocks painted by the shared `renderBlock` registry, read via `getHomePage`) and appends the template's code-only showcases (icons, morphicons, blocks). When the blog feature is on it also shows up to four live featured articles, fetched with `sanityFetchLive` so the page live-updates.

## Exports

- `generateMetadata` — builds SEO metadata for the home page from `pages.home`.
- `HomePage` (default) — async server component that renders the home route; `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/(home)/page.tsx`
