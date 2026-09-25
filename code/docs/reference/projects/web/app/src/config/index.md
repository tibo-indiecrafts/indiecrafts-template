---
title: "App config"
description: "The app surface's config home: shared WEB config primitives plus app-owned instance config."
status: stable
---

# App config

> The `@/config` home: shared primitives plus this app's instance config.

## Purpose

This app's config home. It re-exports the shared WEB config primitives from `@indiecrafts/packages-shared-config` (i18n, format, env/CSP, site env, logging, the page-config contract) and adds this app's instance config. App code imports from `@/config`; packages and modules import the shared package directly.

## Exports

- `features` — instance feature flags: `requireConsent`, `deleteAccount`, `exportAccount`.
- `consent` — the geo consent config (`ConsentConfig`): named `regulations` and country `overrides`.
- `policyVersion` — the current compliance-document version string.
- Re-exports everything from `@indiecrafts/packages-shared-config`.

## Usage

```ts
import { features, consent, policyVersion } from "@/config";

if (features.deleteAccount) {
  // render the self-service delete control
}
```

## Source

`code/projects/web/surfaces/app/src/config/index.ts`
