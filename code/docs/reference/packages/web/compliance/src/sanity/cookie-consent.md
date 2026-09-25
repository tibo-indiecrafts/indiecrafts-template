---
title: "Cookie consent document schema"
description: "Sanity singleton document driving the cookie banner, dialog, and policy table."
status: stable
---

# Cookie consent document schema

> One language-independent singleton holding all cookie-consent content.

## Purpose

The Sanity singleton document (`_id: cookieConsent`) that drives the cookie banner, the preferences dialog, and the cookie-policy table. The master on/off switch and the GA id live in `siteSettings.analytics`; this doc holds the content: the banner copy, the consent categories with their Consent-Mode signal mapping, and the cookie inventory. It is the sole runtime source, read by `getCookieConsent`; bump `version` to re-prompt every visitor.

## Exports

- `default` — the `cookieConsent` Sanity document type.

## Usage

```ts
import cookieConsent from "@indiecrafts/packages-web-compliance/sanity/cookie-consent";

export const schemaTypes = [cookieConsent];
```

## Source

`code/packages/web/compliance/src/sanity/cookie-consent.ts`
