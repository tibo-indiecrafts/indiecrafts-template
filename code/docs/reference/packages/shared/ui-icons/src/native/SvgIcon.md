---
title: "Custom SVG icon (native)"
description: "React Native renderer that draws a registered custom SVG mark by name."
status: stable
---

# Custom SVG icon (native)

> Draws a registered custom SVG mark by name on React Native.

## Purpose

The React Native renderer for the custom-SVG registry. It reads a `SvgName` entry from the shared `SVGS` data and draws its `viewBox` and `path` with `react-native-svg`. Tint it via the `color` prop.

## Exports

- `SvgIconProps` — type: `SvgProps` plus a required `name` of `SvgName`.
- `SvgIcon` — component that renders the named custom mark.

## Usage

```tsx
import { SvgIcon } from "@indiecrafts/packages-shared-ui-icons/native";

<SvgIcon name="logo-mark" color="#0a0a0a" width={32} height={32} />;
```

## Source

`code/packages/shared/ui-icons/src/native/SvgIcon.tsx`
