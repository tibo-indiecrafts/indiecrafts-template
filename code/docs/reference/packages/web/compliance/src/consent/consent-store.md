---
title: "Consent store"
description: "Framework-free client store for the visitor's per-category cookie choices."
status: stable
---

# Consent store

> The single source of truth for cookie consent, backed by localStorage and a window event.

## Purpose

The client-side consent store. It holds the visitor's per-category cookie choices in `localStorage` and broadcasts changes through a custom window event, so every consumer (`CookieBanner`, `useConsent`, `ConsentGate`) stays in sync across tabs and in-page changes. It is pure and framework-free, so it can back a `useSyncExternalStore` snapshot without a hydration effect. It also detects legally recognised opt-out signals (GPC / Do-Not-Track) and pushes Google Consent-Mode updates to `dataLayer`.

## Exports

- `STORAGE_KEY` — the `localStorage` key, namespaced by `site.prefix`.
- `CONSENT_EVENT` — window event name fired after the stored record changes.
- `OPEN_PREFERENCES_EVENT` — window event name that opens the preferences dialog.
- `consentStore` — object with `get`, `subscribe`, and `save` for reactive reads.
- `openPreferences()` — dispatches the open-preferences event.
- `browserSignalsDeny()` — true when the browser sends GPC or legacy Do-Not-Track.
- `signalsDeny(gpcSignal)` — union of the server-detected GPC header and the browser signals.
- `applyConsent(categories, choices, version, source?)` — persists the choices, pushes the Consent-Mode update, and reports the decision.
- `ConsentRecord`, `grantedKeys`, `consentUpdate` — re-exported from the shared brick.

## Usage

```ts
import { applyConsent } from "@indiecrafts/packages-web-compliance/consent/consent-store";

applyConsent(categories, { analytics: true, marketing: false }, "2", "banner");
```

## Source

`code/packages/web/compliance/src/consent/consent-store.ts`
