---
title: "Compliance GROQ queries"
description: "The GROQ queries for cookie consent, legal re-acceptance, legal pages, and the consent policy version."
status: stable
---

# Compliance GROQ queries

> The typed GROQ queries behind the compliance read paths.

## Purpose

Holds the compliance brick's GROQ queries, each wrapped in `defineQuery` so `sanity typegen` picks it up. They back the cookie-consent, legal re-acceptance, legal-page, and consent-policy read paths. Locale labels stay as `localeString` objects and are resolved per-request in the readers.

## Exports

- `cookieConsentQuery` — the `cookieConsent` singleton: banner copy, consent categories with their signals, and the cookie inventory.
- `cookiePolicyVersionQuery` — the cookie-policy page's last-updated date, folded into the effective consent version.
- `legalAcceptanceQuery` — the `legalConsent` copy plus the last-updated date of each contract document.
- `legalPageQuery` — one legal page's editable content for a `pageKey` and locale.
- `consentPolicyVersionQuery` — the privacy page's last-updated date, stamped on opt-ins.

## Usage

```ts
import { cookieConsentQuery } from "@indiecrafts/packages-web-compliance/sanity/queries";

const data = await client.fetch(cookieConsentQuery);
```

## Source

`code/packages/web/compliance/src/sanity/queries.ts`
