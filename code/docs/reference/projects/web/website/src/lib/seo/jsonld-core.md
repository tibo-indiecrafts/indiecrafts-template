---
title: "JSON-LD schema builders"
description: "The non-component core of the SEO layer — Organization, WebSite, and WebPage schema builders plus shared primitives."
status: stable
---

# JSON-LD schema builders

> The auto-emitted schema builders and the `compact` primitive, kept apart from the React components.

## Purpose

Holds the JSON-LD schema builders and shared primitives that back the SEO layer. It lives apart from `jsonld.tsx` so that file exports only React components (Fast Refresh safety) and so `jsonld-factories.tsx` can share `compact` / `SchemaObject` without an import cycle. Includes the business schema that upgrades an `Organization` to a LocalBusiness subtype when configured.

## Exports

- `SchemaObject` — type: a record with a required `@type` string.
- `JsonLdOrganization` — type: the Organization shape.
- `JsonLdWebSite` — type: the WebSite shape.
- `compact(obj)` — strips empty-string, null / undefined, and empty-object keys.
- `buildBusinessSchema(settings, overrides?)` — Organization or LocalBusiness subtype from `settings.business`.
- `buildWebSiteSchema(options)` — WebSite schema with an optional sitelinks SearchAction.
- `buildWebPageSchema(args)` — per-page WebPage schema.
- `buildSiteSchemas(settings, options?, extraSchemas?)` — bundles business + website + extras for the layout.

## Usage

```ts
import { buildSiteSchemas } from "@/lib/seo/jsonld-core";

const schemas = buildSiteSchemas(settings, { description, searchUrlTemplate });
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/jsonld-core.ts`
