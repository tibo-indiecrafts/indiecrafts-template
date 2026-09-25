---
title: "Native card"
description: "Themed React Native surface using the card, border, and radius tokens."
status: stable
---

# Native card

> A themed surface with the `card` background, a `border`, and the themed radius.

## Purpose

Renders a themed React Native surface. It reads the `card` background, `border`
colour, and radius from the shared theme through `useTheme`, and applies default
padding and gap. An optional `style` overrides or extends the container.

## Exports

- `Card` — the component. Props: optional `children` and optional `style` (a `ViewStyle`).

## Usage

```tsx
import { Card, ThemedText } from "@indiecrafts/packages-mobile-ui-native";

<Card>
  <ThemedText>Card body</ThemedText>
</Card>;
```

## Source

`code/packages/mobile/ui-native/src/components/Card.tsx`
