---
title: "App e2e global setup"
description: "Playwright global setup for the app surface that fetches a Clerk Testing Token when auth keys are present."
status: stable
---

# App e2e global setup

> The `app` surface's Playwright global setup — a Clerk Testing Token when auth keys are wired, otherwise a no-op.

## Purpose

The Playwright `globalSetup` for `@indiecrafts/web-surfaces-app`. The app e2e run has no seeded-content dependency, because the home welcome falls back to a message-file string. So the only setup is `clerkSetup()` to fetch a Clerk Testing Token, and it runs only when `CLERK_SECRET_KEY` is set. A run without Clerk keys is unaffected.

## Exports

- `default` — an async `globalSetup()` function invoked by the Playwright config.

## Source

`code/projects/web/surfaces/app/e2e/global-setup.ts`
