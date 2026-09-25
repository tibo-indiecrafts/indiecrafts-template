---
title: "Themed text"
description: "Themed React Native text with body, title, eyebrow, and muted variants."
status: stable
---

# Themed text

> Themed native text that reads its colour from the active theme.

## Purpose

Renders themed React Native text. It reads the `foreground` colour from the
active theme, or `muted-foreground` for `variant="muted"`, and applies the type
scale for the chosen variant. A `title` defaults to the `header` accessibility
role so screen readers announce it as a heading.

## Exports

- `ThemedText` — the component. Props: optional `variant` (`"body"`, `"title"`, `"eyebrow"`, `"muted"`), optional `style`, optional `children`, and optional `accessibilityRole`.

## Usage

```tsx
import { ThemedText } from "@indiecrafts/packages-mobile-ui-native";

<ThemedText variant="title">Welcome</ThemedText>;
```

## Source

`code/packages/mobile/ui-native/src/components/ThemedText.tsx`
