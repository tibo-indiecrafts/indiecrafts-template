---
title: "Consent banner"
description: "The shared shadcn cookie-consent banner with accept, reject, and customize choices."
status: stable
---

# Consent banner

> Accept all, reject, or customize — one Next-free banner.

## Purpose

The shared cookie-consent banner (web, shadcn), Next-free so plain-React surfaces can use it. Mount it at the shell root only when consent is needed. Copy and `categories` are injected — no next-intl or Sanity inside. Three one-tap choices (Accept all, Reject, Customize); Customize expands the per-category toggles; its Save records every optional category, an untouched one as an explicit `false`. An optional `copy.learnMore` (`{ label, href }`) adds a cookie-policy link after the body, opened in a new tab (the app passes the website's policy).

## Exports

- `ConsentBanner` — the banner component (`categories`, `copy`, `initialChoices`, `onAccept`, `onReject`, `onSave`).

## Usage

```tsx
import { ConsentBanner } from "@indiecrafts/packages-shared-compliance/web";

<ConsentBanner
  categories={categories}
  copy={copy}
  onAccept={acceptAll}
  onReject={rejectAll}
  onSave={saveChoices}
/>;
```

## Source

`code/packages/shared/compliance/src/web/ConsentBanner.tsx`
