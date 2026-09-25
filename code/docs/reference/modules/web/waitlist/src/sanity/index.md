---
title: "Waitlist Sanity module"
description: "SanityModule factory that contributes the waitlist's schema, desk, and email groups to the Studio."
status: stable
---

# Waitlist Sanity module

> One-line activation of the waitlist's full Studio contribution.

## Purpose

Builds the waitlist module's Sanity contribution — the `waitlistSettings` singleton, the `waitlistEntry` document, the desk section, and its two `emailStrings` groups — as a `SanityModule`. Passing `enabled` false hides the desk section while the schema and email groups still register.

## Exports

- `waitlistSanity(enabled)` — returns the `SanityModule` barrel; add it to the `appModules` array in `sanity.config.ts`.

## Usage

```ts
import { waitlistSanity } from "@indiecrafts/modules-web-waitlist/sanity";

composeStudio([waitlistSanity(features.waitlist)]);
```

## Source

`code/modules/web/waitlist/src/sanity/index.ts`
