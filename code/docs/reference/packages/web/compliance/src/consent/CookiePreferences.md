---
title: "Cookie preferences dialog"
description: "Per-category consent toggles in a dialog."
status: stable
---

# Cookie preferences dialog

> The per-category consent toggle dialog.

## Purpose

A dialog of per-category consent toggles. Required categories are locked on; optional categories default off. Saving applies the choices through the consent store and shows a saved toast. Mounted by `CookieBanner` and `CookiePreferencesHost`.

## Exports

- `CookiePreferences({ categories, version, open, onOpenChange, current })` — controlled dialog. `current` pre-fills the toggles from the stored choices.

## Usage

```tsx
import { CookiePreferences } from "@indiecrafts/packages-web-compliance/consent/CookiePreferences";

<CookiePreferences
  categories={categories}
  version={version}
  open={open}
  onOpenChange={setOpen}
  current={current}
/>;
```

## Source

`code/packages/web/compliance/src/consent/CookiePreferences.tsx`
