---
title: "Clerk localization map"
description: "Maps an app locale to the matching Clerk UI localization bundle."
status: stable
---

# Clerk localization map

> App locale to Clerk UI language bundle.

## Purpose

Resolves the app's active locale to a Clerk localization bundle for `<ClerkProvider localization>`, so Clerk's sign-in/up, user button, and account modal render in the visitor's language.

## Exports

- `clerkLocalization(locale)` — returns `frFR` for `fr`, otherwise `enUS` (the `en` default). Non-`en-US` bundles are Clerk community locales, so some strings may stay English.

## Usage

```ts
import { clerkLocalization } from "@indiecrafts/packages-web-auth";

<ClerkProvider localization={clerkLocalization("fr")}>{children}</ClerkProvider>;
```

## Source

`code/packages/web/auth/src/localization.ts`
