---
title: "Token swatch helpers"
description: "MDX helper components that render design-token color chips, including live CSS-var chips and literal-hex native chips."
status: stable
---

# Token swatch helpers

> Color chips for the token documentation pages.

## Purpose

Helper components for the token doc MDX pages. CSS-var chips paint with `background: var(--token)`, so they update live when the `data-theme` toolbar flips. A literal-hex variant serves the native token page, where React Native ships resolved hex with no live CSS var. Inline styles keep the chips self-contained inside MDX.

## Exports

- `Swatch({ token, name? })` — a live chip painted from `var(--token)`, with the token name shown as code.
- `HexSwatch({ hex, name })` — a literal-hex chip for the native tokens, showing the name and its hex.
- `NativePalette({ colors, names })` — renders a named subset of a native theme's hex color map as a swatch grid.
- `SwatchGrid({ children })` — an auto-fill responsive grid wrapper for chips.

## Usage

```tsx
import { Swatch, HexSwatch, NativePalette } from "./_swatch";

<Swatch token="--primary" name="Primary" />
<HexSwatch hex="#0a0a0a" name="background" />
<NativePalette colors={darkColors} names={["background", "foreground"]} />
```

## Source

`code/projects/web/tools/storybook/stories/_swatch.tsx`
