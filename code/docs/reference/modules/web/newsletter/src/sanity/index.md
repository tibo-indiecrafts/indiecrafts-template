---
title: "Newsletter Sanity barrel"
description: "Factory that assembles the newsletter module's Sanity contribution."
status: stable
---

# Newsletter Sanity barrel

> One call wires the newsletter schema, desk, and email groups into the Studio.

## Purpose

`newsletterSanity` returns the newsletter module's `SanityModule` — the `newsletterSettings` singleton and `subscriber` and `leadMagnet` schema, the desk sections, and the two `emailStrings` groups. It is called with the app's `features.newsletter` flag: when `enabled` is false the desk section is hidden while the schema and email groups still register. Add `newsletterSanity(features.newsletter)` to the modules array in `sanity.config.ts` to activate.

## Exports

- `newsletterSanity(enabled)` — returns a `SanityModule` (`name`, `schemaTypes`, `structure`, `emailGroups`).

## Usage

```ts
import { newsletterSanity } from "@indiecrafts/modules-web-newsletter/sanity";

const modules = [newsletterSanity(features.newsletter)];
```

## Source

`code/modules/web/newsletter/src/sanity/index.ts`
