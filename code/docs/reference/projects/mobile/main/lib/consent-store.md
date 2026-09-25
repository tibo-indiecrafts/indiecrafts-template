---
title: "Consent store"
description: "The single shared consent-record store for the mobile app, over the native storage backend."
status: stable
---

# Consent store

> One shared consent-record store every consumer imports.

## Purpose

Exposes THE single `consentStore` instance for `STORAGE_KEYS.cookieConsent`. `createNativeStore` is a plain in-memory closure, so two instances for the same key do not see each other's saves within a session. Every consumer (`ShellOverlays`, `app/account.tsx`) imports this one instance rather than creating its own.

## Exports

- `consentStore` — the shared `Store<ConsentRecord>` for the cookie-consent key.

## Usage

```ts
import { consentStore } from "@/lib/consent-store";

const record = consentStore.get();
consentStore.subscribe(listener);
```

## Source

`code/projects/mobile/surfaces/main/lib/consent-store.ts`
