---
title: "FAQ items resolver"
description: "Reads FAQ questions and answers from the homepage accordion-list page-builder block."
status: stable
---

# FAQ items resolver

> One source feeds both the visible FAQ section and its FAQPage JSON-LD.

## Purpose

FAQ content lives in the page-builder — the first `module.accordion-list` block on the home page. This module reads that block and flattens each item to a plain `{ question, answer }` pair, consumed by the visible accordion and by the FAQPage rich-result schema. Gated by `features.faq`.

## Exports

- `FaqItem` — type: `{ question: string; answer: string }`.
- `getFaqItems(locale, pageId)` — resolves the page's FAQ items; returns `[]` for any page other than `home`.

## Usage

```ts
import { getFaqItems } from "@/lib/faq";

const items = await getFaqItems("en", "home");
```

## Source

`code/projects/web/surfaces/website/src/lib/faq.ts`
