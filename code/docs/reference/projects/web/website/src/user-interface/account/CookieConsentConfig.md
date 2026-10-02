---
title: "Cookie consent config context"
description: "Shares the banner's Sanity cookie categories and version with the account widget's Privacy tab."
status: stable
---

# Cookie consent config context

> One source of cookie categories + version for the banner and the account Privacy tab.

## Purpose

`[locale]/layout.tsx` loads the cookie-consent document from Sanity (`getCookieConsent`) for the banner. This context hands the same categories and version to `AccountControl`, so the account widget's Privacy tab shows the banner's categories and saves the banner's version. A different version would make the banner ask again; missing categories would drop an editor-added category from the saved choices.

## Exports

- `CookieConsentConfig({ value, children })` — the provider, set once in the locale layout.
- `useCookieConsentConfig()` — `{ categories, version }`, or `null` outside the provider (then `AccountControl` falls back to the message-based default categories).

## Source

`code/projects/web/surfaces/website/src/user-interface/account/CookieConsentConfig.tsx`
