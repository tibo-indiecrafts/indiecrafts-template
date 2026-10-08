---
title: "Admin Playwright config"
description: "Playwright end-to-end config for the admin surface, running the auth-gate journeys against a built admin on a dedicated port."
status: stable
---

# Admin Playwright config

> The `admin` surface's e2e config — gate journeys against `next build && next start` on a dedicated port (3012).

## Purpose

Configures Playwright for `@indiecrafts/web-surfaces-admin`. It runs the journey specs under
`e2e/journeys/` against a built-and-started admin on port 3012, so it never collides with the
website (3000) or app (3011) e2e servers. The admin needs no seeded content and no api for
these journeys: the gate journeys run without credentials and prove the gate fails closed.

## Exports

- `default` — the Playwright config from `defineConfig(...)`.

Key settings:

- `webServer.command` — `pnpm build && pnpm exec next start --port 3012`; readiness probe `/sign-in`.
- `globalSetup` — `./e2e/global-setup.ts` (a Clerk Testing Token when keys are set).
- `webServer.env` — passes `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Empty
  values run the admin with Clerk unconfigured; the gate journeys still pass and the signed-in
  journeys self-skip.

## Source

`code/projects/web/surfaces/admin/playwright.config.ts`
