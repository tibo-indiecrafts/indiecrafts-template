---
title: "Secure storage"
description: "Never-throw secret persistence over expo-secure-store (OS keychain) for runtime credentials."
status: stable
---

# Secure storage

> The keychain-backed, never-throw store for secrets like the Clerk session.

## Purpose

Provides never-throw secret persistence over `expo-secure-store` (OS Keychain / Keystore) — the secure sibling of `@/lib/storage`. Runtime credentials (the Clerk session and refresh tokens) live here, encrypted at rest, not in AsyncStorage. A failed read returns `null`; a failed write or delete is swallowed.

## Exports

- `secureStorage` — an object with `get(key)`, `set(key, value)`, and `remove(key)`.

## Usage

```ts
import { secureStorage } from "@/lib/secure-storage";

await secureStorage.set("session", token);
const value = await secureStorage.get("session");
```

## Source

`code/projects/mobile/surfaces/main/lib/secure-storage.ts`
