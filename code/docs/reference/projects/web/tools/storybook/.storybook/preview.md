---
title: "Storybook preview config"
description: "The gallery's global Storybook preview: a data-theme toolbar bridged to the native design system plus a token wrapper."
status: stable
---

# Storybook preview config

> The gallery-wide theme toolbar, native theme bridge, and token wrapper.

## Purpose

Defines the global Storybook `Preview` for the whole gallery. The theme toolbar sets `data-theme` on `<html>`, which the token system keys on, so one switch flips every color, the sidebar palette, shiki, and typeset. A second decorator bridges the toolbar to the native design system: it pushes the scheme into react-native-web's `Appearance` and wraps stories in the `ui-native` `ThemeProvider`, covering both native theming paths.

## Exports

- `default` — the Storybook `Preview` object: centered layout, expanded controls, disabled backgrounds addon, the `withThemeByDataAttribute` decorator (Light/Dark on `data-theme`), the native theme bridge, and a `bg-background text-foreground` wrapper.

## Source

`code/projects/web/tools/storybook/.storybook/preview.tsx`
