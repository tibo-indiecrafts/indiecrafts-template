---
title: "Mobile config entry"
description: "The mobile (Expo / React Native) config entry point, re-exporting the shared portable core."
status: stable
---

# Mobile config entry

> The `/mobile` config surface for Expo / React Native.

## Purpose

The mobile config entry for `@indiecrafts/packages-shared-config/mobile`. It re-exports the shared portable core for now. Mobile-specific primitives (deep-link scheme, native env, screen registry) are added here as the app grows, so import sites will not change.

## Exports

- Re-exports everything from `../shared` — the platform-agnostic config core.

## Usage

```ts
import { i18n, pickLocale } from "@indiecrafts/packages-shared-config/mobile";
```

## Source

`code/packages/shared/config/src/mobile/index.ts`
