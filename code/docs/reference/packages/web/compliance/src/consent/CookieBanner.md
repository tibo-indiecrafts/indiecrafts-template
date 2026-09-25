---
title: "Cookie banner"
description: "GDPR cookie consent banner and preferences dialog."
status: stable
---

# Cookie banner

> First-visit consent banner with equal Reject / Customize / Accept.

## Purpose

The GDPR cookie banner plus preferences dialog. It shows on first visit, or when the consent `version` changes, offering Reject all / Customize / Accept all on equal terms. Choices persist in `localStorage` and push a Consent-Mode update. Mounted by `[locale]/layout.tsx` when Sanity `requireCookieConsent` is on.

## Exports

- `CookieBanner({ categories, version, title?, body?, respectGpc?, gpcSignal?, mode? })` — the banner and preferences dialog. `mode` `opt-in` blocks with the banner; `opt-out` / `none` auto-seed a default and rely on the dialog.

## Usage

```tsx
import { CookieBanner } from "@indiecrafts/packages-web-compliance/consent/CookieBanner";

<CookieBanner
  categories={categories}
  version={version}
  title={title}
  body={body}
  mode="opt-in"
/>;
```

## Source

`code/packages/web/compliance/src/consent/CookieBanner.tsx`
