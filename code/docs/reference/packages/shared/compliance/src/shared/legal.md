---
title: "Legal routes contract"
description: "One source of truth for the canonical legal pages and their per-locale slugs, plus the re-acceptance shape."
status: stable
---

# Legal routes contract

> The legal-page slugs shells link out to, plus the re-acceptance check.

## Purpose

One source of truth for the canonical legal pages, so a shell can link out to the website's legal pages and the website's own `pages.ts` reads the same slugs. It also carries the legal re-acceptance shape used by every shell over its own store adapter. No re-hosting — the content stays Sanity-driven on the website.

## Exports

- `LEGAL_PAGES` — the compliance routes (5 legal pages + the data-request form) with per-locale slugs.
- `LEGAL_PAGE_KEYS` — the 5 legal pages (excludes the data-request form).
- `LegalPageKey` (type) — a key of `LEGAL_PAGES`.
- `legalUrl` — the absolute URL of a legal page on the website for a locale.
- `LegalAcceptanceRecord` (type) — the accepted policy version and timestamp.
- `LegalReacceptanceCopy` (type) — the injected re-acceptance prompt copy.
- `needsReacceptance` — true when the visitor must (re-)accept the legal policies.

## Usage

```ts
import {
  legalUrl,
  needsReacceptance,
} from "@indiecrafts/packages-shared-compliance/shared";

const url = legalUrl(site.websiteUrl, "privacy", "fr");
const due = needsReacceptance(store.get(), currentVersion);
```

## Source

`code/packages/shared/compliance/src/shared/legal.ts`
