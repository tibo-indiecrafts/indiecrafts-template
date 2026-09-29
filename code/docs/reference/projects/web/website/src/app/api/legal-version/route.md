---
title: "Legal version endpoint"
description: "Exposes the effective legal version so the `app` surface shares the website's version string."
status: stable
---

# Legal version endpoint

> The one version source every surface compares against — bump Sanity once, re-prompt everywhere.

## Purpose

Returns the effective legal version — the **same** string the website's re-acceptance banner computes (`getLegalAcceptance(...).version`: an optional manual bump plus each **enabled** legal page's `lastUpdated` date). The `app` surface fetches it (via `fetchLegalVersion` in `@indiecrafts/packages-shared-compliance/shared`) so both surfaces re-prompt on one Sanity bump and compare the **same** version — a per-surface static `policyVersion` would never match the website's.

The version is locale-independent (dates, not copy), so the route reads the default locale. Served `no-store` (a CDN must not hand back a stale version — each Sanity edit shows at once) with `access-control-allow-origin: *`, since it is public, read-only, and non-credentialed (the cross-origin `app` surface fetches it, in a browser or inside the Capacitor shell).

## Exports

- `GET` — returns `{ version }`.

## Source

`code/projects/web/surfaces/website/src/app/api/legal-version/route.ts`
