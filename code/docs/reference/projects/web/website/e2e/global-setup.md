---
title: "E2E global setup"
description: "Seeds the throwaway tests-e2e Sanity dataset and fetches a Clerk testing token before Playwright journeys run."
status: stable
---

# E2E global setup

> Prepares the dataset and auth token once, before any app journey runs.

## Purpose

Playwright global-setup hook. It seeds the throwaway `tests-e2e` Sanity dataset by running `scripts/seed.mjs --demo --force` (no bespoke fixture framework), forcing the dataset to `E2E_SANITY_DATASET` (default `tests-e2e`) and refusing any name that does not start with `tests-`. When a Clerk test instance is wired (`CLERK_SECRET_KEY`), it also fetches a Clerk Testing Token so the auth journey can bypass bot detection — a no-op otherwise. `E2E_SKIP_SEED=1` reuses an already-seeded dataset for faster local re-runs. `--force` skips the seeder's live-dataset guard, which a re-seeded throwaway dataset trips. A seed failure is turned into a next-step message: create the `tests-e2e` dataset once with `pnpm sanity:setup` (it needs a `sanity login`; a content write token cannot create datasets).

## Exports

- `default` — `globalSetup()`, the async Playwright global-setup hook (referenced from `playwright.config.ts`).

## Source

`code/projects/web/surfaces/website/e2e/global-setup.ts`
