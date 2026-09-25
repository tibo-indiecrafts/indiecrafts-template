---
title: "Legal re-acceptance singleton"
description: "The Sanity singleton holding the copy for the 'we updated our policies' banner."
status: stable
---

# Legal re-acceptance singleton

> A language-independent singleton for the legal-document re-acceptance banner.

## Purpose

Defines the `legalConsent` Sanity document — a single, language-independent singleton holding the copy for the "we updated our policies" banner. It is the sibling of `cookieConsent`, but for the contract documents (privacy, terms, terms of sale) rather than cookies. It is the sole runtime source (no message fallback), read by `getLegalAcceptance`. The banner re-shows whenever any tracked legal page's last-updated date changes, so an editor normally never touches the optional `version` field.

## Exports

- `default` — the `legalConsent` `SchemaTypeDefinition` (a Sanity document): an optional `version` string plus a `banner` object with translated `message`, `reviewLabel`, and `acceptLabel`.

## Usage

```ts
import legalConsent from "@indiecrafts/packages-web-compliance/sanity/legal-consent";

// Registered in the compliance SanityModule schemaTypes.
schemaTypes: [legalConsent];
```

## Source

`code/packages/web/compliance/src/sanity/legal-consent.ts`
