---
title: "Consent signals re-export"
description: "Compatibility shim re-exporting the consent constants and types from the shared brick."
status: stable
---

# Consent signals re-export

> Keeps the historical import path working after the constants moved to the shared brick.

## Purpose

A re-export shim. The pure consent constants and types moved to `@indiecrafts/packages-shared-compliance/shared` so the `app` surface can share them. This file keeps the historical import path working for every existing importer (`CookieBanner`, `CookiePreferences`, `CookieDeclaration`, the Sanity read path). New code should import from the shared brick directly.

## Exports

- `CONSENT_SIGNALS` — the Google Consent Mode signal list (re-exported).
- `ConsentSignal` — type of one signal (re-exported).
- `ConsentCategory` — type of one consent category (re-exported).
- `CookieRow` — type of one cookie declaration row (re-exported).
- `CookieConsent` — type of the resolved cookie-consent content (re-exported).

## Usage

```ts
import {
  CONSENT_SIGNALS,
  type ConsentCategory,
} from "@indiecrafts/packages-web-compliance/consent/consent-signals";
```

## Source

`code/packages/web/compliance/src/consent/consent-signals.ts`
