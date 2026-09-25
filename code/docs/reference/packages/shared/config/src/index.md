---
title: "Config entry"
description: "The root barrel of the shared config package, combining the platform-agnostic core and the web-only primitives."
status: stable
---

# Config entry

> One import surface for site technical config.

## Purpose

The single import surface for `@indiecrafts/packages-shared-config`, almost entirely data an operator edits. The root barrel re-exports `./shared` (platform-agnostic i18n, format, and types) plus `./web` (web-only site, env, SEO, and page-config primitives), so web apps keep one import. Mobile imports `/mobile` or `/shared` to avoid the web slice.

## Exports

- Re-exports everything from `./shared` — the platform-agnostic core.
- Re-exports everything from `./web` — the web-only primitives.

## Usage

```ts
import { i18n, site, isPageVisible } from "@indiecrafts/packages-shared-config";
```

## Source

`code/packages/shared/config/src/index.ts`
