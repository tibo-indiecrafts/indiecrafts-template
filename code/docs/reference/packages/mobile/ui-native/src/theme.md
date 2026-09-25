---
title: "Native theme runtime"
description: "React context that resolves the shared design tokens to hex for React Native."
status: stable
---

# Native theme runtime

> The provider and hooks that give native components the same tokens as web.

## Purpose

The native theme runtime. It resolves the same design tokens as web to hex for
React Native. `ThemeProvider` follows the OS light or dark scheme unless a `name`
is forced, and `useTheme` and `useColor` read the resolved palette from
`packages-shared-ui-tokens/native`. This is the StyleSheet transport; NativeWind
is the drop-in upgrade.

## Exports

- `ThemeProvider` — provides the resolved theme; follows the OS scheme unless `name` forces one.
- `useTheme()` — returns the resolved theme and its name; throws outside a provider.
- `useColor(token)` — returns one token colour for the active theme.
- `Theme`, `ThemeName`, `ColorToken` — the theme types.

## Usage

```tsx
import {
  ThemeProvider,
  useColor,
} from "@indiecrafts/packages-mobile-ui-native/theme";

const brand = useColor("brand");
```

## Source

`code/packages/mobile/ui-native/src/theme.tsx`
