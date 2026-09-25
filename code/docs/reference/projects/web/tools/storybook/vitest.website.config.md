---
title: "Website story test config"
description: "Vitest config that runs the website-surface stories as component and a11y tests in a headless browser."
status: stable
---

# Website story test config

> Runs the website-surface composition stories as the browser component suite.

## Purpose

Vitest config for the website-surface story suite (the composition ref). It has the same shape as `vitest.config.ts` but points at the `.storybook-website` config and its setup file. It runs the website-surface stories as component and a11y tests in a real headless Chromium via Playwright.

## Exports

- `default` — the Vitest config: the `storybookTest` plugin pointed at `.storybook-website`, the `storybook-website` test project, its setup file, and a Playwright Chromium browser instance (headless).

## Source

`code/projects/web/tools/storybook/vitest.website.config.ts`
