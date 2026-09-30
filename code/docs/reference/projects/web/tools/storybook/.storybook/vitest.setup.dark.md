---
title: "Gallery story test setup (dark)"
description: "Vitest setup that runs every gallery story as a component and a11y test in the Dark theme."
status: stable
---

# Gallery story test setup (dark)

> Runs the story suite a second time, in dark mode.

## Purpose

Vitest setup file for the `storybook-dark` project in `vitest.config.ts`. It applies the a11y addon annotations and the gallery `preview`, plus a decorator that sets `data-theme="dark"` on `<html>` — the attribute the token system keys on (the toolbar's theme decorator does not set it in the test runner). Contrast differs per theme, so axe must run in both.

## Exports

No public exports (internal module).

## Source

`code/projects/web/tools/storybook/.storybook/vitest.setup.dark.ts`
