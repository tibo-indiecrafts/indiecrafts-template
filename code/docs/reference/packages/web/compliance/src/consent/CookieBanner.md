---
title: "Cookie banner"
description: "GDPR cookie consent banner and preferences dialog."
status: stable
---

# Cookie banner

> First-visit consent banner with equal Reject / Customize / Accept.

## Purpose

The GDPR cookie banner plus preferences dialog. It shows on first visit, or when the consent `version` changes, offering Reject all / Customize / Accept all on equal terms. Choices persist in `localStorage` and push a Consent-Mode update. With `decided` (server-read from the consent cookie), an undecided visitor gets the banner in the first HTML rather than after hydration; without it the banner decides on the client only. A visitor whose stored decision predates the cookie gets the cookie written. Mounted by `[locale]/layout.tsx` when Sanity `requireCookieConsent` is on.

## Exports

- `CookieBanner({ categories, version, title?, body?, respectGpc?, gpcSignal?, mode? })` — the banner and preferences dialog. `mode` `opt-in` blocks with the banner and never decides for the visitor — even with GPC/DNT (Brave sends GPC by default); `opt-out` / `none` auto-seed a default (reject when GPC/DNT is on) and rely on the dialog.

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
