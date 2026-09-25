---
title: "Brand icon (native)"
description: "React Native renderer that draws a brand or social mark by name from the shared path data."
status: stable
---

# Brand icon (native)

> Draws a brand or social mark by name on React Native.

## Purpose

The React Native renderer for brand marks. It looks up the named mark in the shared `BRANDS` data and draws it with `react-native-svg`. It shares one data source with the web `BrandIcon`.

## Exports

- `BrandIconProps` — type: `SvgProps` plus a required `name` of `BrandName`.
- `BrandIcon` — component that renders the named mark; tint it via the `color` prop.

## Usage

```tsx
import { BrandIcon } from "@indiecrafts/packages-shared-ui-icons/native";

<BrandIcon name="github" color="#333" width={24} height={24} />;
```

## Source

`code/packages/shared/ui-icons/src/native/BrandIcon.tsx`
