---
title: "Cookie-consent read path"
description: "Fetches the cookieConsent singleton and resolves its banner copy, categories, and cookie inventory for one locale."
status: stable
---

# Cookie-consent read path

> The single runtime source for the cookie banner, consent categories, and cookie table.

## Purpose

`cookies.ts` reads the Sanity `cookieConsent` singleton and shapes it into a locale-resolved `CookieConsent` object for the consent runtime. It is the SOLE source for banner copy, consent categories, and the cookie inventory — there is no config fallback. Any fetch error returns the empty shape instead of throwing.

## Exports

- `getCookieConsent(locale)` — React-`cache`d async reader. Returns the resolved `CookieConsent`, or an empty shape on error. The effective `version` combines the manual `cookieConsent.version` with the cookie policy's last-updated date, so editing the policy re-prompts every visitor.
- Re-exports everything from `../consent/consent-signals` (the client-safe signal constants and types).

## Usage

```ts
import { getCookieConsent } from "@indiecrafts/packages-web-compliance/sanity/cookies";

const consent = await getCookieConsent("fr");
// consent.version, consent.banner, consent.categories, consent.cookies
```

## Source

`code/packages/web/compliance/src/sanity/cookies.ts`
