---
title: "Native screen"
description: "Full-bleed themed page root that wraps a React Native screen."
status: stable
---

# Native screen

> The full-bleed themed root every native screen wraps.

## Purpose

Renders a full-bleed page root with the theme's `background` colour, read through
`useTheme`. It fills the available space (`flex: 1`), and an optional `style`
extends the container. Wrap every native screen with it.

## Exports

- `Screen` — the component. Props: optional `children` and optional `style` (a `ViewStyle`).

## Usage

```tsx
import { Screen, ThemedText } from "@indiecrafts/packages-mobile-ui-native";

<Screen>
  <ThemedText variant="title">Home</ThemedText>
</Screen>;
```

## Source

`code/packages/mobile/ui-native/src/components/Screen.tsx`
