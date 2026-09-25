---
title: "Theme preference logic"
description: "Pure, React-free helpers that validate a theme preference and resolve it to a theme name."
status: stable
---

# Theme preference logic

> The pure, unit-testable core behind the theme preference provider.

## Purpose

Holds the pure theme-preference logic — no React, no React Native, no storage. It is kept apart from `theme-preference.tsx` (which imports the `ui-native` `ThemeProvider`) so it is unit-testable without a native host.

## Exports

- `ThemePreference` — the preference type (`"light" | "dark" | "system"`).
- `THEME_PREFERENCES` — the ordered list of valid preferences.
- `isThemePreference(value)` — type guard for a stored string.
- `resolveThemeName(preference)` — the forced theme name, or `undefined` for `"system"`.

## Usage

```ts
import { isThemePreference, resolveThemeName } from "@/lib/theme-resolve";

if (isThemePreference(stored)) {
  const name = resolveThemeName(stored);
}
```

## Source

`code/projects/mobile/surfaces/main/lib/theme-resolve.ts`
