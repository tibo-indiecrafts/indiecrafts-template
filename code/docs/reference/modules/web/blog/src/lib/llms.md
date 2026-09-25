---
title: "Blog LLM endpoint lines"
description: "Builds the blog and taxonomy Markdown lines for /llms.txt and /llms-full.txt."
status: stable
---

# Blog LLM endpoint lines

> The blog's contribution to the LLM endpoints.

## Purpose

Produces the Markdown lines the blog adds to `/llms.txt` and `/llms-full.txt`. The post section lists every published, indexable post for the locale, each linking to its `/md` export. The taxonomy section adds `## Categories` / `## Tags` / `## Authors`, gated by the feature flags and each doc's noindex. Both return `[]` when the blog surface is off or there is no content, so the endpoints stay blog-agnostic.

## Exports

- `getBlogLlmsLines(locale)` — the `## Blog` post lines, or `[]`.
- `getTaxonomyLlmsLines(locale, { full? })` — the taxonomy section lines; `full` inlines each doc's `llmsFull` body.

## Usage

```ts
import {
  getBlogLlmsLines,
  getTaxonomyLlmsLines,
} from "@indiecrafts/modules-web-blog/lib/llms";

const lines = [
  ...(await getBlogLlmsLines(locale)),
  ...(await getTaxonomyLlmsLines(locale, { full: true })),
];
```

## Source

`code/modules/web/blog/src/lib/llms.ts`
