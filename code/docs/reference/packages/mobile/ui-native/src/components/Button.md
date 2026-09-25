---
title: "Native button"
description: "Themed React Native button with shadcn-style variants over the shared tokens."
status: stable
---

# Native button

> A themed native button with primary, secondary, outline, and destructive variants.

## Purpose

Renders a themed React Native button using the shared `ui-tokens` palette through
`useTheme`. It ships the accessibility baseline: a 44 pt target, `button` role,
label and hint, and a `selected` state announced through
`accessibilityState.selected` so selection is never signalled by colour alone.

## Exports

- `Button` — the component. Props: `label`, optional `variant` (`"primary"`, `"secondary"`, `"outline"`, `"destructive"`), optional `onPress`, `disabled`, `selected`, and `accessibilityHint`.

## Usage

```tsx
import { Button } from "@indiecrafts/packages-mobile-ui-native";

<Button label="Continue" onPress={handlePress} />;
```

## Source

`code/packages/mobile/ui-native/src/components/Button.tsx`
