---
title: "Native theme colors hook"
description: "React Native hook returning the active theme's token colours for the status pages."
status: stable
---

# Native theme colors hook

> The colour source for the native status pages — follows the OS light/dark scheme.

## Purpose

Returns the active theme's colours (hex) for the native status pages. It follows the OS scheme via `useColorScheme`. Because these pages are `shared/` scope, they cannot depend on the mobile `ui-native` brick, so they read the token values directly.

## Exports

- `useColors` — a hook returning the current scheme's colour map from the shared tokens.

## Usage

```ts
import { useColors } from "@indiecrafts/packages-shared-system-pages/native";

const c = useColors();
// c.background, c.foreground, c.primary, ...
```

## Source

`code/packages/shared/system-pages/src/native/theme.ts`
