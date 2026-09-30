---
title: "Story test config"
description: "Vitest config that runs every gallery story as a component and a11y test in a real headless browser."
status: stable
---

# Story test config

> Runs the colocated stories as the browser component suite.

## Purpose

Vitest config for the main story suite. It runs every Storybook story as a component test in a real headless Chromium via Playwright, covering interaction (`play`) and a11y (addon-a11y). The colocated stories are the suite, so there is no separate test authoring. It runs the suite as two projects — `storybook` (Light, `vitest.setup.ts`) and `storybook-dark` (Dark, `vitest.setup.dark.ts`) — because contrast differs per theme. Tests time out at 30 s.

## Exports

- `default` — the Vitest config: two projects (`storybook`, `storybook-dark`), each with the `storybookTest` plugin pointed at `.storybook`, its setup file, and a Playwright Chromium browser instance (headless).

## Source

`code/projects/web/tools/storybook/vitest.config.ts`
