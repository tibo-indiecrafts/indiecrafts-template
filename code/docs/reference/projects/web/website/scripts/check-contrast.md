---
title: "Contrast checker"
description: "Checks WCAG AA contrast for the theme's OKLCH color tokens and fails when a text pair drops below AA."
status: stable
---

# Contrast checker

> Gates the design tokens on WCAG 2.1 AA contrast, in light and dark modes.

## Purpose

Parses the generated `tokens.css`, reads each `oklch(...)` token from the light, explicit-dark, and `prefers-color-scheme: dark` blocks, converts it to sRGB, and computes the WCAG 2.1 relative luminance and contrast ratio for a fixed list of foreground/background pairs. Exits 1 when a declared text pair drops below its AA threshold; non-text pairs (for example `border`) only warn. Keep the `PAIRS` array in sync when adding new semantic tokens.

## Exports

No public exports (CLI script).

## Usage

```bash
node scripts/check-contrast.mjs   # or: pnpm verify:contrast
```

## Source

`code/projects/web/surfaces/website/scripts/check-contrast.mjs`
