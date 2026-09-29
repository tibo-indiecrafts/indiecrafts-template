---
title: "Legal re-acceptance read path"
description: "Fetches the legalConsent singleton and composes the effective legal re-acceptance version from each tracked page's date."
status: stable
---

# Legal re-acceptance read path

> The runtime source for the "we updated our policies" banner.

## Purpose

Reads the Sanity `legalConsent` singleton for the banner copy and composes the effective version from the last-updated date of each tracked legal page (privacy, terms, terms of sale). It is the same recipe as the cookie re-consent version. There is no message fallback; any fetch error returns the empty shape instead of throwing. Cookies are handled by the cookie banner, and the legal notice (imprint) is informational and excluded.

## Exports

- `getLegalAcceptance(locale, flags)` — React-`cache`d async reader. Takes the locale and the app's `LegalFlags` (which tracked pages are enabled) and returns the resolved `LegalAcceptance`, or the empty shape on error. A disabled page's date is excluded from the version.
- `LegalAcceptance` — the resolved shape: `version` plus optional `message`, `acceptLabel` (the Privacy · Terms links are built by the app, not stored).
- `LegalFlags` — `{ privacy, terms, sales }`, the app-injected enable flags.

## Usage

```ts
import { getLegalAcceptance } from "@indiecrafts/packages-web-compliance/sanity/legal";

const legal = await getLegalAcceptance("fr", {
  privacy: true,
  terms: true,
  sales: false,
});
```

## Source

`code/packages/web/compliance/src/sanity/legal.ts`
