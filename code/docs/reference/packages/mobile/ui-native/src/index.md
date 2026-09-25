---
title: "Native UI entry"
description: "Package entry that re-exports the native theme runtime and shell components."
status: stable
---

# Native UI entry

> The barrel for `@indiecrafts/packages-mobile-ui-native` — theme runtime plus shell components.

## Purpose

The package entry for the native design system. It re-exports the theme runtime
(`ThemeProvider`, `useTheme`, `useColor` and their types) and the shell
components (`Screen`, `ThemedText`, `Button`, `Card`). These StyleSheet
components sit over the shared `ui-tokens` palette, so native and web share one
palette.

## Exports

- `ThemeProvider`, `useTheme`, `useColor` — the theme runtime, re-exported from `./theme`.
- `Theme`, `ThemeName`, `ColorToken` — theme types, re-exported from `./theme`.
- `Screen`, `ThemedText`, `Button`, `Card` — the shell components.

## Usage

```tsx
import {
  ThemeProvider,
  Screen,
  ThemedText,
} from "@indiecrafts/packages-mobile-ui-native";

<ThemeProvider>
  <Screen>
    <ThemedText variant="title">Home</ThemedText>
  </Screen>
</ThemeProvider>;
```

## Source

`code/packages/mobile/ui-native/src/index.ts`
