---
title: "Mobile app config"
description: "The mobile app's config home: re-exports the portable config core and defines mobile-owned instance values."
status: stable
---

# Mobile app config

> The one `@/config` entry point for the mobile app — portable core plus instance values.

## Purpose

Re-exports the portable config core from `@indiecrafts/packages-shared-config/mobile` (i18n, format, types) and adds the mobile-owned instance config: the storage-key namespace, web hand-off origins, build id, Sanity ids, feature flags, consent geo config, and the policy version. Mobile app code imports from `@/config`; it never pulls the web config barrel.

## Exports

- `sitePrefix` — per-deployment namespace for browser-owned keys, from `EXPO_PUBLIC_SITE_PREFIX`.
- `STORAGE_KEYS` — every persisted key, namespaced once under `sitePrefix`.
- `websiteUrl` — the marketing-site origin (HTTPS-only); the legal link-out and version-poll target.
- `accountUrl` — the canonical web account entry point the app hands off to.
- `buildId` — the build id baked in at build (`EXPO_PUBLIC_BUILD_ID`, else `"dev"`).
- `sanityProjectId`, `sanityDataset` — public Sanity ids for the home welcome read.
- `features` — instance feature flags (`requireConsent`, off by default).
- `consent` — the consent geo config (`ConsentConfig`).
- `policyVersion` — the current compliance-document version.
- Re-exports everything from `@indiecrafts/packages-shared-config/mobile`.

## Usage

```ts
import { STORAGE_KEYS, websiteUrl, features, policyVersion } from "@/config";

const key = STORAGE_KEYS.cookieConsent;
```

## Source

`code/projects/mobile/surfaces/main/config/index.ts`
