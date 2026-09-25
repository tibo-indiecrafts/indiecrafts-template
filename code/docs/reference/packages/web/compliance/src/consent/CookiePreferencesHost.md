---
title: "Cookie preferences host"
description: "Mounts the preferences dialog and its open-event listener without a banner."
status: stable
---

# Cookie preferences host

> A standalone preferences entry point with no blocking banner.

## Purpose

Mounts the preferences dialog and its `OPEN_PREFERENCES_EVENT` listener on their own, with no blocking banner. It covers the case where `requireCookieConsent` is off but a visitor still needs a working "manage preferences" entry point, such as a CCPA/opt-out visitor clicking the footer "Do Not Sell" link.

## Exports

- `CookiePreferencesHost({ categories, version })` — mounts the dialog; opened via `openPreferences()`.

## Usage

```tsx
import { CookiePreferencesHost } from "@indiecrafts/packages-web-compliance/consent/CookiePreferencesHost";

<CookiePreferencesHost categories={categories} version={version} />;
```

## Source

`code/packages/web/compliance/src/consent/CookiePreferencesHost.tsx`
