---
title: "Cookie declaration table"
description: "Server component rendering the cookie inventory on the cookie-policy page."
status: stable
---

# Cookie declaration table

> The cookie-policy table, grouped by consent category, built from Sanity.

## Purpose

An async server component that renders the cookie declaration table on the cookie-policy page. It reads the Sanity `cookieConsent.cookies` inventory through `getCookieConsent`, groups the cookies by consent category, and renders each as a card so the layout reflows on mobile. It appends a `ManagePreferencesButton` at the end.

## Exports

- `CookieDeclaration({ locale })` — async server component; returns `null` when the inventory is empty.

## Usage

```tsx
import { CookieDeclaration } from "@indiecrafts/packages-web-compliance/pages/CookieDeclaration";

<CookieDeclaration locale={locale} />;
```

## Source

`code/packages/web/compliance/src/pages/CookieDeclaration.tsx`
