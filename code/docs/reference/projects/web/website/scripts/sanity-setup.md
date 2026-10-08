---
title: "Sanity project setup"
description: "One-time Sanity project setup: creates the datasets, adds the CORS origins, and checks the api worker's project id."
status: stable
---

# Sanity project setup

> Prepares a Sanity project for the website; it only adds what is missing, so a re-run is safe.

## Purpose

One-time setup for a new Sanity project. It needs a `sanity login` session, because dataset and CORS changes need project-admin rights that a content token lacks.

1. **Datasets** — creates the content dataset (`NEXT_PUBLIC_SANITY_DATASET`, default `production`) and the throwaway `tests-e2e` dataset. It asks for private visibility; Sanity's free plan makes them public. It warns when the project would hold more than the free plan's 2 datasets.
2. **CORS** — adds each missing website origin from `siteOrigins()` (`scripts/lib/site-origins.mjs`), with credentials, for the Studio and the preview.
3. **api worker** — checks that every `SANITY_PROJECT_ID` in `code/shared/api/wrangler.toml` matches the project id, and prints the fix when one does not.

Tokens, the publish webhook, and the hosted Studio stay manual (they need secrets or a browser step). The script prints these steps at the end. `--dry-run` prints the plan and changes nothing.

## Exports

- `listLines(stdout)` — splits the Sanity CLI's list output into one entry per line, with ANSI colours and blank lines removed. Pure.
- `plan({ datasets, origins, wanted })` — returns `{ missingDatasets, missingOrigins, warnings }` from what the project has now and what it needs. Pure.
- `apiProjectIds(toml)` — the `SANITY_PROJECT_ID` values in the api worker's `wrangler.toml`. Pure.

## Usage

```bash
pnpm sanity:setup              # apply
pnpm sanity:setup -- --dry-run # print the plan only
```

It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`. The root `pnpm sanity:setup` runs the website's script.

## Source

`code/projects/web/surfaces/website/scripts/sanity-setup.mjs`
