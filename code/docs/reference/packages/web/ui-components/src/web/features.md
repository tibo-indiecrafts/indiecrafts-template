---
title: "Block feature gates"
description: "Holds the app-injected newsletter, waitlist, and contact feature flags for page-builder block renderers."
status: stable
---

# Block feature gates

> App-owned feature flags for the newsletter, waitlist, and contact blocks, injected once at boot.

## Purpose

The `module.newsletter`, `module.waitlist`, and `module.contact` renderers self-hide when their feature is off. The flags live in the app (`@/config`), but this package stays app-agnostic, so the app injects the booleans once via `configureBlocks()` (from its `instrumentation.ts`). Defaults ship all-on, so a single app renders correctly before configure runs. The gates live on `globalThis`, because `instrumentation.ts` and the routes load separate copies of this module.

## Exports

- `BlockFeatures` — type: the three boolean gates `newsletter`, `waitlist`, `contact`.
- `configureBlocks(flags)` — called once by the app at boot to set the gates.
- `blockFeatures()` — reads the current gates for this app.

## Usage

```ts
import { configureBlocks } from "@indiecrafts/packages-web-ui-components/web/features";

// app instrumentation.ts, once at boot
configureBlocks({ newsletter: true, waitlist: false, contact: true });
```

## Source

`code/packages/web/ui-components/src/web/features.ts`
