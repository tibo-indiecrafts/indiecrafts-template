---
title: "Storybook preview config"
description: "The gallery's global Storybook preview: a data-theme toolbar, the sidebar order, and a token wrapper."
status: stable
---

# Storybook preview config

> The gallery-wide theme toolbar, sidebar order, and token wrapper.

## Purpose

Defines the global Storybook `Preview` for the whole gallery. The theme toolbar sets `data-theme` on `<html>`, which the token system keys on, so one switch flips every color, the sidebar palette, shiki, and typeset. `storySort` sets one sidebar tree: Introduction, Design Tokens, then the domain components, UI atoms last.

## Exports

- `default` — the Storybook `Preview` object: centered layout, expanded controls, disabled backgrounds addon, the `storySort` sidebar order, the `withThemeByDataAttribute` decorator (Light/Dark on `data-theme`), and a `bg-background text-foreground` wrapper.

## Source

`code/projects/web/tools/storybook/.storybook/preview.tsx`
