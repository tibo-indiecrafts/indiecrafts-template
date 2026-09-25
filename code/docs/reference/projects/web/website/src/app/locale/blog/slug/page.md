---
title: "Blog post page"
description: "Renders a single blog post with its layout, related posts, comments and Article/Breadcrumb JSON-LD."
status: stable
---

# Blog post page

> The `/[locale]/blog/<slug>` route: one article with its chrome.

## Purpose

Renders a single blog post. It fetches the post and the blog singleton, then renders either the editor-composed `postModules` (through `Modules`) or the `DefaultPostLayout` with related posts. Comments render when enabled. It advertises Markdown, RSS and Atom alternates, and emits Article plus BreadcrumbList JSON-LD (the category crumb appears only when categories are enabled).

## Exports

- `generateStaticParams` — pairs each post slug with its own locale so a post renders at one locale only.
- `generateMetadata` — post title, description and OpenGraph, plus the markdown/RSS/atom alternates.
- `BlogPostPage` (default) — renders the post; `notFound()` when the slug does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/[slug]/page.tsx`
