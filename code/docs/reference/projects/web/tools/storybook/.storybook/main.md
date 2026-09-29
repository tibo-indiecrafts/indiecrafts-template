---
title: "Storybook gallery config"
description: "The main Storybook config: story globs resolved by package name, plus Vite aliases that mock next-intl and shiki."
status: stable
---

# Storybook gallery config

> The single gallery's story discovery and Vite wiring.

## Purpose

The main `StorybookConfig` for the design-system gallery. It resolves each design-system brick by its package name (not a relative path) into a `configDir`-relative story glob, so discovery survives the package moving and works for both `storybook build` and the addon-vitest runner. In `viteFinal` it adds Tailwind, aliases `next-intl` / `next-intl/server` / `next-intl/navigation` and `shiki` to local mocks, and resolves `storybook/test` from this package for sibling-brick `play` functions.

## Exports

- `default` — the `StorybookConfig`: `@storybook/nextjs-vite` framework, the per-brick story globs, the `docs` / `themes` / `a11y` / `vitest` addons, `experimentalRSC`, optional composition `refs` (env-gated by `STORYBOOK_COMPOSE`), and the `viteFinal` alias setup.

## Source

`code/projects/web/tools/storybook/.storybook/main.ts`
