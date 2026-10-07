---
title: "App Clerk provider"
description: "Wraps ClerkProvider with the design-token appearance and locale bundle."
status: stable
---

# App Clerk provider

> The app-themed, opt-in Clerk provider for the root layout.

## Purpose

Wraps `<ClerkProvider>` with `authAppearance()` and the resolved locale bundle so `auth()` and the hosted sign-in/up components work app-wide. Auth is opt-in: with no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` bound, it renders children unchanged.

## Exports

- `AppClerkProvider({ children, nonce?, locale?, signUpPath? })` — the themed provider. `nonce` forwards the per-request CSP nonce; `locale` selects the Clerk UI language bundle; `signUpPath` (e.g. `"/sign-up"`) becomes Clerk's `signUpUrl`, localized, so Clerk's "Sign up" links open the app's own page. Admin, which has no sign-up page, omits it. Server-component compatible.

## Usage

```tsx
import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

<AppClerkProvider nonce={nonce} locale="fr">
  {children}
</AppClerkProvider>;
```

## Source

`code/packages/web/auth/src/provider.tsx`
