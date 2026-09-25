---
title: "Per-page llms route"
description: "Route that returns a single page's content as Markdown for LLM ingestion."
status: stable
---

# Per-page llms route

> The `/llms/<id>` route — one page's Markdown companion for direct LLM ingestion.

## Purpose

Locale-aware GET route for `/<locale>/llms/<id>`. It looks up the route by `id`, then renders the page's content as Markdown built Sanity-only from the rendering doc's `.seo` (title, description, and the editor-authored `llmsFull` body). An empty body falls back to title plus description. An unknown id, a non-llms page, or an editor `noIndex` returns 404. Gated by `features.llms.pages`. Response is `text/markdown` with a one-hour cache.

## Exports

- `GET` — the route handler; returns the page Markdown or a 404.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/llms/[id]/route.ts`
