---
title: "Async storage wrapper"
description: "Never-throw persistence for the mobile app's non-secret prefs over AsyncStorage."
status: stable
---

# Async storage wrapper

> The never-throw store for non-secret prefs, over AsyncStorage.

## Purpose

Provides never-throw persistence for the mobile app's own prefs over `AsyncStorage`. AsyncStorage rejects when the device store is full, disabled, or corrupt, so the try/catch lives once here. A failed read returns `null`; a failed write is swallowed. Scope is non-secret prefs — a runtime session token belongs in `@/lib/secure-storage`. Keys come from `STORAGE_KEYS`.

## Exports

- `storage` — an object with `get(key)` and `set(key, value)`.

## Usage

```ts
import { storage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/config";

await storage.set(STORAGE_KEYS.locale, "en");
const locale = await storage.get(STORAGE_KEYS.locale);
```

## Source

`code/projects/mobile/surfaces/main/lib/storage.ts`
