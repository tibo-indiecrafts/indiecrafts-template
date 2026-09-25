---
title: "llms-full.txt route"
description: "Route that emits the whole site's content as one Markdown document for LLM ingestion."
status: stable
---

# llms-full.txt route

> The `/llms-full.txt` route — every page's Markdown concatenated for one-fetch LLM ingestion.

## Purpose

Locale-aware GET route for `/<locale>/llms-full.txt`. It renders the same Markdown that `/llms/<id>` returns for every visible route, joined with `---` separators, then appends a `## Blog` directory and taxonomy sections with each doc's `llmsFull` body inlined. It skips dynamic routes, `noindex`, and disabled pages, and prepends a site-level intro when set. Gated by `features.llms.full` (404 when off). Response is `text/plain` with a one-hour cache.

## Exports

- `GET` — the route handler; returns the concatenated Markdown or a 404.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/llms-full.txt/route.ts`
