---
title: "Brand marks generator"
description: "Build script that generates the brands.ts data file from brands.json and simple-icons."
status: stable
---

# Brand marks generator

> Generate `src/shared/brands.ts` from `brands.json` plus the `simple-icons` package.

## Purpose

A Node build script for the `ui-icons` brick. It reads `src/shared/brands.json` (our name to a `simple-icons` slug, or an inline `{title, hex, path}` override for a mark `simple-icons` lacks) and writes a plain-data `src/shared/brands.ts`. The runtime stays dependency-free because the generated file is plain data. It mirrors the `tokens:build` / `tokens:check` pattern.

## Exports

No public exports (internal module). It runs as a CLI script.

## Usage

Edit `brands.json`, then regenerate or verify:

```json
{
  "scripts": {
    "brands:build": "node scripts/build-brands.mjs",
    "brands:check": "node scripts/build-brands.mjs --check"
  }
}
```

`--check` compares the current `brands.ts` against the freshly rendered output and exits non-zero when it is stale. CI runs it to guard drift. An unknown `simple-icons` slug in `brands.json` also fails the script.

## Source

`code/packages/web/ui-icons/scripts/build-brands.mjs`
