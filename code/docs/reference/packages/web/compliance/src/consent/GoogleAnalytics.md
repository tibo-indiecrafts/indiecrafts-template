---
title: "Google Analytics (basic consent mode)"
description: "Loads Google Analytics only once the visitor has granted analytics, with the stored choice restored before the first hit."
status: stable
---

# Google Analytics (basic consent mode)

> No script and no ping reach Google before the visitor grants analytics.

## Purpose

The website mounts this client component when a GA id is set in Sanity (`siteSettings.analytics.googleAnalyticsId`). When consent is required, it renders nothing until the stored consent record is for the current policy `version` **and** grants a category whose Consent-Mode signals include `analytics_storage` (read from the categories, not a hard-coded key). Then it loads gtag.js and the init script: Consent-Mode default denied, the stored choice restored (`consentRestoreScript`), then `config` — so the first hit is already consented. It re-renders on a new choice: accepting loads GA at once; a withdrawal sends a "denied" update (`applyConsent`) and GA is gone from the next page. When consent is not required it loads GA as a plain tag. The id is JSON-encoded with `<` escaped inside the inline script.

## Exports

- `GoogleAnalytics({ id, version, categories, requireConsent, nonce? })` — the two `next/script` tags, or `null`.

## Usage

```tsx
<GoogleAnalytics
  id={gaId}
  version={cookieConsent.version}
  categories={cookieConsent.categories}
  requireConsent
  nonce={nonce}
/>
```

## Source

`code/packages/web/compliance/src/consent/GoogleAnalytics.tsx`
