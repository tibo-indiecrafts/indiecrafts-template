---
title: "Token swatch helpers"
description: "MDX helper components that render design-token color chips, as live CSS-var chips."
status: stable
---

# Token swatch helpers

> Color chips for the token documentation pages.

## Purpose

Helper components for the token doc MDX pages. CSS-var chips paint with `background: var(--token)`, so they update live when the `data-theme` toolbar flips. Inline styles keep the chips self-contained inside MDX.

## Exports

- `Swatch({ token, name? })` — a live chip painted from `var(--token)`, with the token name shown as code.
- `SwatchGrid({ children })` — an auto-fill responsive grid wrapper for chips.

## Usage

```tsx
import { Swatch, SwatchGrid } from "./_swatch";

<SwatchGrid>
  <Swatch token="--primary" name="Primary" />
</SwatchGrid>;
```

## Source

`code/projects/web/tools/storybook/stories/_swatch.tsx`
