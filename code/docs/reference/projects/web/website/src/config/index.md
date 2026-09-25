---
title: "Config barrel"
description: "The single @/config import surface for shared primitives and app config."
status: stable
---

# Config barrel

> One import home — shared platform primitives plus this app's instance config.

## Purpose

`@/config` is the app's single config import surface. It re-exports the shared platform primitives (i18n, format, env, CSP, logging, site env, and the generic `PageConfig` contract) from `@indiecrafts/packages-shared-config`, and it adds this app's own instance config: `surface`, `theme`/`themeConfig`, `fonts`, `features`, `security`, `consent`, and `pages`. App code imports from `@/config`; packages and modules import the shared primitives directly.

## Exports

- Re-exports everything from `@indiecrafts/packages-shared-config`.
- `surface` — the surface audit id.
- `theme`, `themeConfig` — design identity and theme availability.
- `fonts` — the active font pairing.
- `features` — the feature flags.
- `security` — the per-route API guard policy.
- `consent` — the geo consent config.
- `pages` — the route map.
- `StaticAppPathname`, `AppRoute` — route types (type-only).

## Usage

```ts
import { features, pages, theme } from "@/config";
```

## Source

`code/projects/web/surfaces/website/src/config/index.ts`
