---
title: "Legal routes contract"
description: "One source of truth for the canonical legal pages and their per-locale slugs, plus the re-acceptance shape."
status: stable
---

# Legal routes contract

> The legal-page slugs the `app` surface links out to, plus the re-acceptance check.

## Purpose

One source of truth for the canonical legal pages, so the `app` surface can link out to the website's legal pages and the website's own `pages.ts` reads the same slugs. It also carries the legal re-acceptance shape used by every shell over its own store adapter. No re-hosting — the content stays Sanity-driven on the website.

## Exports

- `LEGAL_PAGES` — the compliance routes (5 legal pages + the data-request form) with per-locale slugs.
- `LEGAL_PAGE_KEYS` — the 5 legal pages (excludes the data-request form).
- `LegalPageKey` (type) — a key of `LEGAL_PAGES`.
- `legalUrl` — the absolute URL of a legal page on the website for a locale.
- `LegalAcceptanceRecord` (type) — the accepted policy version and timestamp.
- `needsReacceptance` — true when the visitor must (re-)accept the legal policies.
- `readLegalConsent` / `writeLegalConsent` — the signed-in user's server-recorded acceptance (`GET`/`POST /v1/consent/legal`); best-effort.
- `syncLegalConsent` — reconciles on load: true when the server holds the version; re-sends an acceptance made here that never landed; never accepts otherwise.

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
