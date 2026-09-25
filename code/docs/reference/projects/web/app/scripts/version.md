---
title: "App build-info stamper"
description: "Build script that writes src/lib/build-info.ts with the app version, git branch, commit, and build time."
status: stable
---

# App build-info stamper

> Stamps the `app` surface's `build-info.ts` with version and git provenance during `build:cf`.

## Purpose

A Node build script for `@indiecrafts/web-surfaces-app`. It reads the package version, resolves the git branch and short commit (falling back to `"unknown"` when git is absent), and overwrites `src/lib/build-info.ts` with a generated `buildInfo` constant. It runs inside `build:cf`, so every deployed Worker carries its provenance. The version check polls `/api/version` and compares against this baked `commit`. The committed source file holds dev placeholders.

## Exports

No public exports (internal module). It runs as a script via `node scripts/version.mjs`.

## Source

`code/projects/web/surfaces/app/scripts/version.mjs`
