---
title: "Consent toast"
description: 'Shows the shared consent "choice saved" toast with a "manage" action.'
status: stable
---

# Consent toast

> The shared consent "choice saved" toast.

## Purpose

Provides the single consent and legal "choice saved" toast used on every web surface. Copy is injected per surface, so each resolves its own i18n. The `onManage` callback opens that surface's cookie-preferences control.

## Exports

- `showConsentSavedToast` — shows a `sonner` success toast for a saved consent choice, with a "manage" action.

## Usage

```ts
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";

showConsentSavedToast({
  saved: "Choice saved",
  description: "You can change this anytime.",
  manage: "Manage",
  onManage: () => openCookiePreferences(),
});
```

## Source

`code/packages/web/ui-components/src/web/consent-toast.ts`
