---
title: "Blog post page"
description: "Renders a single blog post with its layout, related posts, comments and Article/Breadcrumb JSON-LD."
status: stable
---

# Blog post page

> The `/[locale]/blog/<slug>` route: one article with its chrome.

## Purpose

Renders a single blog post. One `Promise.all` fetches the post, the blog singleton, the settings, and the `post` sidebar settings (`getSidebarSettings`). `pageSidebar` returns the post's sidebar cards: the post's own `sidebar` choice, else the `post` entry in Site web → Barre latérale. The route fetches the related posts once (`relatedPostsQuery`). The limit is the larger of 3 (the default layout's grid) and the related card's `limit`. The route then renders either the editor-composed `postModules` (through `Modules`) or the `DefaultPostLayout` with the first three related posts. `postSidebar` builds the aside and the mobile table of contents from the cards and the related posts. `DefaultPostLayout` takes them as `aside` and `mobileToc`. `Modules` gets them as `postSidebar` in its context. `PostViewBeacon` counts one anonymous view for the Trending block. Comments render when enabled, inside `<Suspense>`: the article streams first and the thread (its own read) follows. It advertises Markdown, RSS and Atom alternates, and emits Article plus BreadcrumbList JSON-LD (the category crumb appears only when categories are enabled).

## Exports

- `generateStaticParams` — pairs each post slug with its own locale so a post renders at one locale only.
- `generateMetadata` — post title, description and OpenGraph, plus the markdown/RSS/atom alternates.
- `BlogPostPage` (default) — renders the post; `notFound()` when the slug does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/[slug]/page.tsx`
