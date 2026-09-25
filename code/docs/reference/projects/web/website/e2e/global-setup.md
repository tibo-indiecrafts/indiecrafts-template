---
title: "E2E global setup"
description: "Seeds the throwaway e2e Sanity dataset and fetches a Clerk testing token before Playwright journeys run."
status: stable
---

# E2E global setup

> Prepares the dataset and auth token once, before any app journey runs.

## Purpose

Playwright global-setup hook. It seeds the throwaway `e2e` Sanity dataset by reusing `scripts/seed-demo.mjs` (no bespoke fixture framework), refusing to touch `production` and forcing the dataset to `E2E_SANITY_DATASET`. When a Clerk test instance is wired (`CLERK_SECRET_KEY`), it also fetches a Clerk Testing Token so the auth journey can bypass bot detection — a no-op otherwise. `E2E_SKIP_SEED=1` reuses an already-seeded dataset for faster local re-runs. A seed failure is turned into a next-step message, since the `e2e` dataset is a one-time manual creation (a content write token cannot create datasets).

## Exports

- `default` — `globalSetup()`, the async Playwright global-setup hook (referenced from `playwright.config.ts`).

## Source

`code/projects/web/surfaces/website/e2e/global-setup.ts`
