---
title: "Editor-driven catch-all page"
description: "Resolves a Sanity page document by slug and locale and paints its sections beside its sidebar."
status: stable
---

# Editor-driven catch-all page

> The `/[locale]/<slug>` fallback: any editor-authored page, rendered from its blocks.

## Purpose

Handles the generic `/[locale]/<slug>` route. It resolves a page-builder `page` document by slug and locale, then renders its `sections[]` (generic and blog blocks) through the blog's `Modules`. `siteBlocks` drops the blog blocks when the blog is off. `PageSidebar` puts the sections beside the cards for page type `page`, or the page's own `sidebar` choice. It is a required catch-all (`[...slug]`) so it never shadows the `(home)` index; the static route folders resolve first and this is the fallback (an unknown path is a 404). The route has no `generateStaticParams`: the locale layout reads the per-request CSP nonce, so the route is dynamic, and a static render of an unknown slug answered 500 instead of 404. It also emits WebPage JSON-LD built from the page's own SEO, gated on the structured-data feature and the page's noindex.

## Exports

- `generateMetadata` — resolves the page and builds self-canonicalizing metadata with translation alternates; the page's own `seo` overrides the copy.
- `BuilderPage` (default) — renders the resolved page's sections; `notFound()` when the slug does not resolve.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/[...slug]/page.tsx`
