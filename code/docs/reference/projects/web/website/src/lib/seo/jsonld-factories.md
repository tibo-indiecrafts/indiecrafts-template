---
title: "On-demand JSON-LD factories"
description: "Per-page JSON-LD builders (Article, FAQPage, Service, Product, LocalBusiness, Person, Breadcrumb) opted in via page config."
status: stable
---

# On-demand JSON-LD factories

> Not auto-emitted — add these to a page via `pageConfig.seo.structuredData[]`.

## Purpose

On-demand JSON-LD builders imported only from pages that use the relevant schema. None are auto-emitted by the layout or `<PageSchemas>`. Their `@id` fields chain into `Organization` / `WebSite` so Google sees one connected entity graph. Also maps the Studio-authored `siteSettings.globalSchemas[]` entries to schema.

## Exports

- `buildBreadcrumbSchema(items)` — BreadcrumbList from `{ name, url }` items.
- `buildArticleSchema(args)` — Article / BlogPosting with author fallback to the org.
- `buildFAQPageSchema(items)` — FAQPage from `{ question, answer }` pairs.
- `buildServiceSchema(args)` — Service with an optional Offer.
- `buildProductSchema(args)` — Product with optional Offer and AggregateRating.
- `buildLocalBusinessSchema(args)` — LocalBusiness per location.
- `buildGlobalSchemas(entries)` — maps `siteSettings.globalSchemas[]` to Service / Product / Person / Event.
- `buildPersonSchema(args)` — Person for team pages.

## Usage

```ts
import { buildFAQPageSchema } from "@/lib/seo/jsonld-factories";

const structuredData = [buildFAQPageSchema([{ question: "…", answer: "…" }])];
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/jsonld-factories.tsx`
