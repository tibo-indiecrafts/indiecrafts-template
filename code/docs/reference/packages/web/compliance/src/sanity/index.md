---
title: "Compliance Sanity module"
description: "The barrel that assembles the compliance brick's whole legal and consent Sanity contribution."
status: stable
---

# Compliance Sanity module

> One SanityModule for the legal pages, cookie consent, re-acceptance, and GDPR requests.

## Purpose

Assembles the compliance brick's `complianceSanity` `SanityModule` — the whole legal and consent surface. It bundles the `cookieConsent` singleton and its category/entry objects, the `legalConsent` re-acceptance singleton, the `legalPage` documents with their per-language desk sections and i18n templates, the `dataRequest` records, and the `dataRequestOwner` email group. Activate it by adding it to `sharedModules` in the `composeStudio([...])` call in `sanity.config.ts`.

## Exports

- `complianceSanity` — the `SanityModule` object: `schemaTypes`, `structure`, `emailGroups`, `i18nSchemaTypes`, and the per-locale `legalPage` templates.

## Usage

```ts
import { complianceSanity } from "@indiecrafts/packages-web-compliance/sanity";

composeStudio([complianceSanity /* , ...other modules */]);
```

## Source

`code/packages/web/compliance/src/sanity/index.ts`
