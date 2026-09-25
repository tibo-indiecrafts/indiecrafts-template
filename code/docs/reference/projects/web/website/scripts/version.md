---
title: "Build-info stamper"
description: "Generates src/lib/build-info.ts with the app version, git branch, commit, and build time during build:cf."
status: stable
---

# Build-info stamper

> Stamps `src/lib/build-info.ts` with version and git provenance at build time.

## Purpose

This CLI script writes `src/lib/build-info.ts` with the app version (from `package.json`), the git branch, the short commit sha, and the build timestamp. It runs inside `build:cf`, so every deployed Worker carries its provenance (for a footer, cache-busting, or support). The committed `build-info.ts` holds dev placeholders; git lookups fall back to `unknown` when they fail.

## Exports

No public exports (CLI script; runs inside `build:cf`).

## Usage

```bash
pnpm --filter @indiecrafts/web-surfaces-website version
```

## Source

`code/projects/web/surfaces/website/scripts/version.mjs`
