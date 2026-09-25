---
title: "Playwright config"
description: "Playwright config with app-journey and Storybook-visual test targets selected by E2E_TARGET."
status: stable
---

# Playwright config

> Two browser-test flavours — real app journeys and Storybook visuals — one config.

## Purpose

Defines two browser-test targets, selected by the `E2E_TARGET` env var. The `app` target runs real user journeys (`e2e/journeys/`) against a built Next app served on a throwaway Sanity `e2e` dataset seeded by `global-setup`. The `visual` target screenshots every Storybook story from the static `storybook-static` build. Because a `webServer` cannot be scoped to one project, `E2E_TARGET` gates both the project and its server — so a visual-only run never builds the app, and an app-only run never needs Storybook. No target runs both.

## Exports

- `default` — the resolved Playwright test configuration.

## Source

`code/projects/web/surfaces/website/playwright.config.ts`
