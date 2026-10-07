---
title: "Bundle-size budget"
description: "Measures the landing route's gzipped First-Load JS after a production build and reports it against a budget."
status: stable
---

# Bundle-size budget

> Tracks the marketing landing route's First-Load JS against a size ceiling.

## Purpose

Runs after a production build and sums the gzipped JS a first-time visitor downloads on the landing route (`/[locale]/(home)/page`). Next 16 picks a page's scripts from two manifests, and the script reads the same ones: `build-manifest.json` (`rootMainFilesTree[page]`, else `rootMainFiles`) and the route's `page_client-reference-manifest.js` (`entryJSFiles` for each layer). The `nomodule` polyfills are left out: modern browsers skip them. The total is compared with `BUDGET_KB` (335 kB; measured ~292 kB on 2026-10-07, with Clerk loaded only for signed-in visitors).

`--enforce` (or `BUNDLE_ENFORCE=1`) fails over budget, and also when a build exists but its manifests can't be read, so a Next manifest change cannot switch the gate off. (Before Next 16 support, the script looked for the removed `app-build-manifest.json` and skipped every run.) No build at all is a skip: CI's `turbo --affected` may not build the website. CI runs it enforced.

## Exports

- `BUDGET_KB`, `LANDING_PAGE` — the ceiling and the measured route.
- `firstLoadFiles({ buildManifest, clientManifest, page })` — the `.js` files a first load downloads (unit-tested).

## Usage

```bash
pnpm size             # report the number, exit 0
pnpm size --enforce   # fail over budget or on an unreadable build (CI)
```

## Source

`code/projects/web/surfaces/website/scripts/check-bundle-size.mjs`
