---
title: "Home page route"
description: "The production home page — the editor-composed home page blocks beside its sidebar."
status: stable
---

# Home page route

> The `/[locale]` index: the editor-composed home blocks.

## Purpose

The production home page for the website surface. It reads the home `page` document with `getHomePage`. The blog's `Modules` renders its blocks, so the home holds the generic blocks and the blog blocks. The featured strip is a `module.blog-featured` block with `layout: "editorial"` in the home `page`. `PageSidebar` puts the blocks beside the cards set for « Accueil » in Site web → Barre latérale, or the page's own `sidebar` choice.

## Exports

- `generateMetadata` — builds SEO metadata for the home page from `pages.home`.
- `HomePage` (default) — async server component that renders the home route; `notFound()` when the page is hidden.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/(home)/page.tsx`
