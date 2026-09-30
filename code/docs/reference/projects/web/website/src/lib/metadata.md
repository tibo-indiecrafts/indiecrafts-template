---
title: "Per-page metadata builder"
description: "Composes Next.js Metadata for a page from Sanity SEO, config, and site-wide defaults."
status: stable
---

# Per-page metadata builder

> Builds the `<head>` tags — title, canonical, hreflang, robots, OpenGraph, Twitter.

## Purpose

Composes a Next.js `Metadata` object for a page from three sources: SEO copy (Sanity only — title, description, keywords, og:image), structural fields (canonical, hreflang, robots derived from config and routing), and site-wide defaults in `seoDefaults`. It resolves canonical precedence, builds the hreflang language set (full for static routes, translation-only for dynamic detail pages), and re-emits OpenGraph and Twitter blocks because Next replaces rather than merges them. With no Sanity title, description or keywords it leaves those keys out, so the layout defaults apply — a present-but-undefined key would erase them.

## Exports

- `buildMetadata({ page, locale, pathname?, translations? })` — returns a `Promise<Metadata>` for the page.

## Usage

```ts
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildMetadata({ page: pages.home, locale });
}
```

## Source

`code/projects/web/surfaces/website/src/lib/metadata.ts`
