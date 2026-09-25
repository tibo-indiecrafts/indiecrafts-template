---
title: "Build info stamp"
description: "Generated build metadata (version, branch, commit, build time) stamped at build time."
status: stable
---

# Build info stamp

> A generated placeholder that the build overwrites with real version metadata.

## Purpose

Holds the app's build identity — version, branch, commit, and build time. The committed file is a `0.0.0` / `local` / `dev` placeholder; real values are stamped during `build:cf` by the website `version` script. Do not edit by hand.

## Exports

- `buildInfo` — a `const` object with `version`, `branch`, `commit`, and `buildTime` string fields.

## Usage

```ts
import { buildInfo } from "@/lib/build-info";

console.log(buildInfo.version, buildInfo.commit);
```

## Source

`code/projects/web/surfaces/website/src/lib/build-info.ts`
