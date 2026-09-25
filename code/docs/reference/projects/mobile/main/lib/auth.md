---
title: "Mobile Clerk auth config"
description: "The mobile Clerk publishable key and the keychain-backed token cache; auth is opt-in."
status: stable
---

# Mobile Clerk auth config

> Clerk's publishable key and token cache for the mobile app, opt-in by env.

## Purpose

Holds the mobile Clerk config. Auth is opt-in: with no `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` the app runs exactly as before, because the provider is not mounted. The token cache stores the session on `expo-secure-store` (OS keychain), never AsyncStorage.

## Exports

- `CLERK_PUBLISHABLE_KEY` — the publishable key from env, or `""`.
- `hasClerk` — `true` when the publishable key is set.
- `tokenCache` — Clerk's `tokenCache` contract, backed by the OS keychain.

## Usage

```tsx
import { CLERK_PUBLISHABLE_KEY, hasClerk, tokenCache } from "@/lib/auth";

{
  hasClerk ? (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      {children}
    </ClerkProvider>
  ) : (
    children
  );
}
```

## Source

`code/projects/mobile/surfaces/main/lib/auth.ts`
