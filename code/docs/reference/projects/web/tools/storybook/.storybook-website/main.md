---
title: "Website Storybook config"
description: "The composed Storybook config for the website surface, run with the website app's @/ alias."
status: stable
---

# Website Storybook config

> A composition-ref Storybook that resolves the website surface's own `@/` imports.

## Purpose

Configures the website surface's own Storybook, composed into the main gallery via `refs`. It runs with the website app's `@/` alias pointed at that app's `src/`, so surface components resolve their app-internal imports for real, with no cross-app collision with the main bricks gallery. It also aliases `next-intl` to a mock and adds the Tailwind Vite plugin. Stories are colocated in the website app as `.stories.tsx` files.

## Exports

- `default` — the `StorybookConfig` object Storybook loads. No importable API.

## Source

`code/projects/web/tools/storybook/.storybook-website/main.ts`
