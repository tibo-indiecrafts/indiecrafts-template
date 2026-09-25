---
title: "Persist locale hook"
description: "Mirrors a locale change to the signed-in user's Clerk unsafeMetadata.locale."
status: stable
---

# Persist locale hook

> Syncs an explicit language switch to the user's Clerk metadata.

## Purpose

Returns a callback that writes a locale change to the signed-in user's Clerk `unsafeMetadata.locale`. The api's `user.updated` webhook mirrors it to `user_profiles.locale`, so transactional and auth emails follow the user's current language.

## Exports

- `usePersistLocale()` — returns a `(locale: string) => void`. It no-ops when signed out or unchanged, and is best-effort (logs on failure).

## Usage

```tsx
import { usePersistLocale } from "@indiecrafts/packages-web-auth/persist-locale";

const persistLocale = usePersistLocale();
persistLocale("fr");
```

## Source

`code/packages/web/auth/src/persist-locale.tsx`
