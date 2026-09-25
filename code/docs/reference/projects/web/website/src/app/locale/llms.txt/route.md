---
title: "llms.txt route"
description: "Route that emits a locale-aware plain-text site summary for LLM crawlers."
status: stable
---

# llms.txt route

> The `/llms.txt` route — a locale-aware site summary following the llmstxt.org spec.

## Purpose

Locale-aware GET route for `/<locale>/llms.txt`. It builds a plain-text summary from the per-locale Sanity `siteMeta` singleton: an H1 site name, a blockquote tagline, a description paragraph, a "Last reviewed" line, and H2 sections grouping the visible routes by each page's `.seo.llmsSection` in editor-defined order. It appends published blog posts, taxonomy sections, and optional external resource links. SEO copy is Sanity-only. Gated by `features.llms.index` (404 when off). Response is `text/plain` with a one-hour cache.

## Exports

- `GET` — the route handler; returns the summary or a 404.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/llms.txt/route.ts`
