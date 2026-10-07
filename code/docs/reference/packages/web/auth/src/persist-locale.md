---
title: "Persist locale hook"
description: "Mirrors a locale change to the signed-in user's Clerk unsafeMetadata.locale."
status: stable
---

# Persist locale hook

> Syncs an explicit language switch to the user's Clerk metadata.

## Purpose

Writes a locale change to the signed-in user's Clerk `unsafeMetadata.locale`. The api's `user.updated` webhook mirrors it to `user_profiles.locale`, so transactional and auth emails follow the user's current language. It reads the loaded ClerkJS global (`window.Clerk`), not a Clerk hook: the website's locale switcher renders for signed-out visitors without `ClerkProvider`, where a hook would throw and pull Clerk into every page's bundle.

## Exports

- `persistLocale(locale)` — no-op when Clerk isn't loaded, no one is signed in, or the locale is unchanged; best-effort (logs on failure).

## Usage

```tsx
import { persistLocale } from "@indiecrafts/packages-web-auth/persist-locale";

persistLocale("fr");
```

## Source

`code/packages/web/auth/src/persist-locale.tsx`
