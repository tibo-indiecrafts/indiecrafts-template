---
title: "Version check hook"
description: "Client hook that polls a version endpoint and reports when a newer build is deployed."
status: stable
---

# Version check hook

> Polls the version endpoint and flags when the live deploy differs from this bundle.

## Purpose

Polls a version endpoint and reports when the deployed build differs from the one
this bundle was built with. There is no service worker (the app runs on
OpenNext and Cloudflare), so detection is a small `no-store` poll: on mount, on a
gentle interval, and whenever the tab regains focus or the network comes back.

## Exports

- `useVersionCheck(options)` — the `"use client"` hook; takes `{ current, endpoint?, intervalMs? }` and returns `{ updateAvailable, latest }`.
- `isUpdateAvailable` — re-exported string-identity compare from `./version`.

## Usage

```tsx
import { useVersionCheck } from "@indiecrafts/packages-web-version/use-version-check";

const { updateAvailable } = useVersionCheck({ current: buildInfo.commit });
```

## Source

`code/packages/web/version/src/use-version-check.ts`
