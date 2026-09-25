---
title: "Compliance desk sections"
description: "The Studio desk structure builders for the compliance singletons, GDPR requests, and legal pages."
status: stable
---

# Compliance desk sections

> The Studio desk items for cookie consent, legal re-acceptance, GDPR requests, and legal pages.

## Purpose

Builds the compliance brick's desk sections for the Sanity Studio. Each function returns a `ListItemBuilder` used by `complianceSanity.structure`. Together they surface the two editable singletons, the GDPR request list, and the legal pages grouped by language.

## Exports

- `cookieStructureItem(S)` — the "Cookies & consentement" editor for the `cookieConsent` singleton.
- `legalConsentStructureItem(S)` — the "Mise à jour des documents légaux" editor for the `legalConsent` singleton.
- `dataRequestStructureItem(S)` — the "Demandes RGPD" list, newest first.
- `legalStructureItem(S)` — the "Pages légales" section: the `legalPage` documents grouped by language, with i18n templates.

## Usage

```ts
import { cookieStructureItem } from "@indiecrafts/packages-web-compliance/sanity/structure";

structure: (S) => [cookieStructureItem(S) /* , ... */];
```

## Source

`code/packages/web/compliance/src/sanity/structure.ts`
