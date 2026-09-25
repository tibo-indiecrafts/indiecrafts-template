---
title: "Web consent store"
description: "A localStorage-backed, synchronous Store adapter for the plain-React compliance shells."
status: stable
---

# Web consent store

> The minimal `localStorage` store the shared web UI needs.

## Purpose

Creates a `localStorage`-backed, synchronous `Store` adapter for the plain-React shells (the `app` web surface). It serves both the consent record and the legal-acceptance record, each under its own `storageKey`, namespaced by `${site.prefix}`. The website keeps its own richer store in `@indiecrafts/packages-web-compliance`; this is the minimal one.

## Exports

- `createWebStore(storageKey)` — returns a `Store` with `get`, `save`, and `subscribe`. It caches the parsed record for a stable reference (required for `useSyncExternalStore`) and dispatches a per-key change event so a same-tab `save` re-notifies subscribers.

## Usage

```ts
import { createWebStore } from "@indiecrafts/packages-shared-compliance/web";

type ConsentRecord = { analytics: boolean; marketing: boolean };
const store = createWebStore<ConsentRecord>("indiecrafts_consent");
const record = store.get();
```

## Source

`code/packages/shared/compliance/src/web/store.ts`
