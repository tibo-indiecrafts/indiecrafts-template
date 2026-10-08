---
title: "Admin e2e global setup"
description: "Playwright global setup for the admin surface that fetches a Clerk Testing Token when auth keys are present."
status: stable
---

# Admin e2e global setup

> The `admin` surface's Playwright global setup — a Clerk Testing Token when auth keys are wired, otherwise a no-op.

## Purpose

The Playwright `globalSetup` for `@indiecrafts/web-surfaces-admin`. The admin e2e run has no
content to seed. The only setup is `clerkSetup()`, which fetches a Clerk Testing Token for the
signed-in journeys. It runs only when `CLERK_SECRET_KEY` is set, so a run without Clerk keys
is unaffected.

## Exports

- `default` — an async `globalSetup()` function invoked by the Playwright config.

## Source

`code/projects/web/surfaces/admin/e2e/global-setup.ts`
