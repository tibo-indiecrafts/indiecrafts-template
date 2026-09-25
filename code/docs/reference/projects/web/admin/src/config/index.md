---
title: "Admin config home"
description: "The admin app's config barrel: re-exports the shared web config primitives and hosts admin-owned instance config."
status: stable
---

# Admin config home

> The `@/config` entry point for the admin app.

## Purpose

This barrel is the admin app's config home. It re-exports the shared web config primitives (i18n, format, env/CSP, site env, logging, the page-config contract) from `@indiecrafts/packages-shared-config`, and is where admin-owned instance config (feature flags, nav, theme) is added. App code imports from `@/config`; packages and modules import the shared package directly.

## Exports

- Re-exports everything from `@indiecrafts/packages-shared-config` (via `export *`).

## Usage

```ts
import { localeDir, type Locale } from "@/config";
```

## Source

`code/projects/web/surfaces/admin/src/config/index.ts`
