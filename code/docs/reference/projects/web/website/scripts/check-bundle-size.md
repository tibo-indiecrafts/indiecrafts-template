---
title: "Bundle-size budget"
description: "Measures the landing route's gzipped First-Load JS after a production build and reports it against a budget."
status: stable
---

# Bundle-size budget

> Tracks the marketing landing route's First-Load JS against a size ceiling.

## Purpose

Runs after a production build, reads `.next/app-build-manifest.json`, picks the landing route, and sums its gzipped JS chunks — excluding the embedded Sanity Studio, whose client bundle would make an all-chunks budget meaningless. Reports the number against `BUDGET_KB` (220 kB default). Report-only by default so the first CI runs establish the real size; pass `--enforce` (or `BUNDLE_ENFORCE=1`) to make it a hard gate once the budget is calibrated. Never blocks on a missing or dev build.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm size             # report the number, exit 0
pnpm size --enforce   # fail the build when over budget
```

## Source

`code/projects/web/surfaces/website/scripts/check-bundle-size.mjs`
