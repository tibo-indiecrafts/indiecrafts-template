---
title: "Shared config entry"
description: "The platform-agnostic config core barrel: locales, format defaults, settings, and shared types."
status: stable
---

# Shared config entry

> The `./shared` platform-agnostic config core.

## Purpose

The `/shared` barrel of `@indiecrafts/packages-shared-config`. It is pure TypeScript with zero web-runtime coupling (no `next`, no DOM, no `NEXT_PUBLIC_` env), so it is safe to import from any platform, including Expo / React Native. The web-only primitives live in `../web`.

## Exports

- Values and functions: `i18n`, `locales`, `defaultLocale`, `localeCodes`, `localeMap`, `localePrefix`, `localizedPathname`, `localeDir`, `isLocale`, `pickSuggestedLocale`, `pickLocale`, `flattenMessages`, `formatDefaults`, `localeFormat`, and everything from `./settings`.
- Types: `Locale`, `ThemeName`, `ThemeMode`, `FontKey`, `FontRoles`, `Environment`, `LogLevel`.

## Usage

```ts
import {
  defaultLocale,
  localeFormat,
} from "@indiecrafts/packages-shared-config/shared";
```

## Source

`code/packages/shared/config/src/shared/index.ts`
