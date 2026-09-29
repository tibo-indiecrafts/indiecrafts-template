---
title: "Consent signals and categories"
description: "Pure Google Consent Mode signal constants and the consent category and cookie types."
status: stable
---

# Consent signals and categories

> The platform-agnostic consent-mode signals and cookie-consent shapes.

## Purpose

Defines the cookie-consent constants and types with no server, Sanity, or DOM imports. The web store and banner plus the web read path can import them without pulling a heavier graph. The web brick re-exports this file so its importers are unchanged.

## Exports

- `CONSENT_SIGNALS` / `ConsentSignal` — every Google Consent Mode signal a category can grant.
- `ConsentCategory` — a consent category: `key`, `title`, optional `description`, `required`, and its granted `signals`.
- `CookieRow` — one row in the cookie declaration table.
- `CookieConsent` — the full consent config: `version`, banner copy, `categories`, and `cookies`.

## Usage

```ts
import {
  CONSENT_SIGNALS,
  type ConsentCategory,
} from "@indiecrafts/packages-shared-compliance/shared";
```

## Source

`code/packages/shared/compliance/src/shared/consent-signals.ts`
