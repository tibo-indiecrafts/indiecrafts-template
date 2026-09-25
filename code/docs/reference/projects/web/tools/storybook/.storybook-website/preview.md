---
title: "Website surface preview config"
description: "Storybook preview config for the website-surface gallery, adding a data-theme toolbar and a token wrapper."
status: stable
---

# Website surface preview config

> The lean Storybook preview for the composed website surface.

## Purpose

Defines the global Storybook `Preview` for the website-surface gallery (the composition ref). It adds a light/dark theme toolbar that sets `data-theme`, and wraps every story in a token-styled container. It is a leaner variant of the root `.storybook/preview.tsx` without the native-theme bridge.

## Exports

- `default` — the Storybook `Preview` object: centered layout, expanded controls, disabled backgrounds addon, a `withThemeByDataAttribute` decorator (Light/Dark on `data-theme`), and a `bg-background text-foreground` wrapper.

## Source

`code/projects/web/tools/storybook/.storybook-website/preview.tsx`
