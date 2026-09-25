---
title: "App Playwright config"
description: "Playwright end-to-end config for the app surface, running journeys against a built app on a dedicated port."
status: stable
---

# App Playwright config

> The `app` surface's e2e config — real journeys against `next build && next start` on a dedicated port (3011).

## Purpose

Configures Playwright for `@indiecrafts/web-surfaces-app`. It runs the journey specs under `e2e/journeys/` against a built-and-started app on port 3011, so it never collides with the website's e2e server on 3000. Unlike the website, the app has no seeded-content dependency, so `global-setup` only fetches a Clerk Testing Token when the auth keys are wired.

## Exports

- `default` — the Playwright config from `defineConfig(...)`.

Key settings:

- `webServer.command` — `pnpm build && pnpm exec next start --port 3011`.
- `globalSetup` — `./e2e/global-setup.ts` (Clerk Testing Token when keys are set).
- `webServer.env` — passes `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`; empty values run the app anonymous and the sign-in spec self-skips.

## Source

`code/projects/web/surfaces/app/playwright.config.ts`
