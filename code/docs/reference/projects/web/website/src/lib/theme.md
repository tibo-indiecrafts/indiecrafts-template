---
title: "Theme resolution"
description: "Turns a resolved theme config into the values next-themes needs and whether the theme toggle should render."
status: stable
---

# Theme resolution

> Sanity theme modes over the code default, mapped to next-themes props.

## Purpose

Resolves which color modes the site offers — Sanity `siteSettings.themeModes` over the `themeConfig` code default — and derives the concrete values next-themes needs, plus whether the toggle should render. These are functions of a runtime config: the layout resolves it server-side and prop-feeds the client ThemeProvider, Header, and ThemeToggle, which cannot await Sanity.

## Exports

- `ThemeConfig` — type for the resolved theme availability (light, dark, forced).
- `resolveThemeConfig(modes)` — Sanity `themeModes` over the code default; unset returns the default.
- `themeModes(cfg)` — the user-selectable modes in menu order.
- `showThemeToggle(cfg)` — whether the toggle renders (hidden when forced or single-option).
- `themeProviderProps(cfg)` — props for the next-themes `<ThemeProvider>`.

## Usage

```ts
import { resolveThemeConfig, themeProviderProps } from "@/lib/theme";

const cfg = resolveThemeConfig(settings.themeModes);
const props = themeProviderProps(cfg);
```

## Source

`code/projects/web/surfaces/website/src/lib/theme.ts`
