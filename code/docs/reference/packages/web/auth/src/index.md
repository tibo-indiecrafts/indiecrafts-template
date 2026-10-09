---
title: "Auth package barrel"
description: "Public entry point for the web auth brick's provider, views, and helpers."
status: stable
---

# Auth package barrel

> The single import surface for the themed Clerk provider and its views.

## Purpose

Re-exports the web auth brick's public API — the provider, sign-in/up views, appearance, localization, redirect guards, and session logger — plus the Clerk UI control components, so app code imports auth from one place.

## Exports

- `AppClerkProvider` — the app-themed Clerk provider.
- `authAppearance` — the design-token `appearance` builder.
- `clerkLocalization` — locale to Clerk localization bundle.
- `SignInView` — the themed sign-in surface.
- `SignUpView` — the themed sign-up surface.
- `SessionLogger` — one log ping per Clerk session.
- `SignInButton`, `SignOutButton`, `UserButton`, `Show` — re-exported `@clerk/nextjs` UI controls (`Show` replaces the old `<SignedIn>` / `<SignedOut>`).

## Usage

```ts
import {
  AppClerkProvider,
  SignInView,
  UserButton,
} from "@indiecrafts/packages-web-auth";
```

## Source

`code/packages/web/auth/src/index.ts`
