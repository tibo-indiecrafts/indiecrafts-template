---
title: "LLM page Markdown"
description: "Renders each static page to Markdown for the llms.txt and per-page LLM endpoints, from Sanity SEO only."
status: stable
---

# LLM page Markdown

> Turns a page plus its Sanity SEO into the Markdown the LLM endpoints serve.

## Purpose

Builds the Markdown body for `/llms-full.txt` and the per-page `/llms/<id>` endpoints. The source is Sanity only — there is no auto-generation from `messages`. A page's Markdown is a head (title, URL, description from the Sanity `pageSeo` entry) plus the editor-authored `llmsFull` body when set.

## Exports

- `PageMarkdownSeo` — type for one page's SEO copy, including the `llmsFull` body and `noIndex`.
- `isLlmsPage(page)` — whether a page appears in the LLM endpoints (real static route, enabled, indexable, not opted out via `seo.llms`).
- `renderPageMarkdown(page, locale, seo?)` — render one page to Markdown (head plus optional body).
- `renderAllPagesMarkdown(pages, locale, seoByPage?)` — concatenate every visible page's Markdown for the full dump.

## Usage

```ts
import { isLlmsPage, renderAllPagesMarkdown } from "@/lib/seo/page-markdown";

const visible = pages.filter(isLlmsPage);
const body = renderAllPagesMarkdown(visible, locale, seoByPage);
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/page-markdown.ts`
