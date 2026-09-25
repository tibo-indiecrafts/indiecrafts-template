---
title: "Legal page document"
description: "The Sanity document for one client-editable legal page, translated per locale."
status: stable
---

# Legal page document

> One editable body per legal page and locale, with its own SEO.

## Purpose

Defines the `legalPage` Sanity document — the client-editable body for one of the site's legal pages (legal notice, privacy, cookies, terms of use, terms of sale). There is one document per `pageKey` and locale, translated via `@sanity/document-internationalization`. SEO lives on the doc's `seo` field (the shared `seoMeta`), so each legal page is self-contained; the `title` field is the on-page H1.

## Exports

- `default` — the `legalPage` `SchemaTypeDefinition` (a Sanity document): `pageKey`, `title`, `lastUpdated`, a Portable Text `body`, and `seo`.

## Usage

```ts
import legalPage from "@indiecrafts/packages-web-compliance/sanity/legal-page";

// Registered in the compliance SanityModule schemaTypes.
schemaTypes: [legalPage];
```

## Source

`code/packages/web/compliance/src/sanity/legal-page.ts`
