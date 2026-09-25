---
title: "useConsent hook"
description: "React hook that reads the visitor's cookie consent choices reactively."
status: stable
---

# useConsent hook

> Re-renders when consent changes, so features can gate on a category.

## Purpose

Reads the visitor's cookie-consent choices reactively through `useSyncExternalStore`. The component re-renders when consent changes (accept, reject, save, or another tab). Use it to gate features by category, or reach for `ConsentGate` for the common render-when-consented case.

## Exports

- `useConsent()` — returns `{ choices, has, decided, openPreferences }`.

## Usage

```tsx
import { useConsent } from "@indiecrafts/packages-web-compliance/consent/useConsent";

const { has, openPreferences } = useConsent();
if (has("marketing")) {
  // load a pixel
}
```

## Source

`code/packages/web/compliance/src/consent/useConsent.ts`
