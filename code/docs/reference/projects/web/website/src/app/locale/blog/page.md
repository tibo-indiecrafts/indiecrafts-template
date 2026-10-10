---
title: "Blog frontpage route"
description: "Renders the editor-composed blog frontpage modules, or the code default sections when none exist."
status: stable
---

# Blog frontpage route

> The `/[locale]/blog` index: editor modules or the code default.

## Purpose

The blog frontpage. It fetches the blog singleton, posts and taxonomies (authors, categories and tags, each behind its own feature flag), then renders either the editor's `frontpageModules` through `Modules`, or the `DefaultBlogFrontpage` sections — the choice made by `pickFrontpage`. `PageSidebar` puts the frontpage beside the cards set for page type `blogIndex` in Site web → Barre latérale. It advertises RSS and Atom alternates and honors the singleton's `noIndex` and `unpublished` flags.

## Exports

- `generateMetadata` — builds SEO metadata plus RSS/Atom alternates; honors the singleton `noIndex`.
- `BlogPage` (default) — renders the frontpage; `notFound()` when the singleton is unpublished.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/page.tsx`
