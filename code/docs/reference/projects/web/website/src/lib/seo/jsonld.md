---
title: "Core JSON-LD components"
description: "React components that auto-emit WebPage and FAQPage JSON-LD per page and render the ld+json script tag."
status: stable
---

# Core JSON-LD components

> The auto-emitted schema components, gated by `features.structuredData`.

## Purpose

The React components for JSON-LD that every page auto-emits (schema builders live in `jsonld-core`, on-demand factories in `jsonld-factories`). `<PageSchemas>` emits the WebPage schema, a FAQPage when the page has FAQ content, and anything in `page.seo.structuredData`. `<JsonLdScript>` renders the `<script type="application/ld+json">` tag, HTML-escaping the JSON so CMS-authored text cannot break out of the script context.

## Exports

- `PageSchemas({ page, locale, pathname? })` — async server component that emits the per-page schema graph, or `null` when structured data is disabled.
- `JsonLdScript({ data })` — renders one schema or an array (wrapped in `@graph`) as an escaped ld+json script.

## Usage

```tsx
import { PageSchemas } from "@/lib/seo/jsonld";

<PageSchemas page={pages.home} locale={locale} />;
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/jsonld.tsx`
