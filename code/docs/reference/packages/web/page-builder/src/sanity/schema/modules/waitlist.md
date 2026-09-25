---
title: "Waitlist module"
description: "Sanity schema for the waitlist page-builder block — an email capture form with GDPR consent."
status: stable
---

# Waitlist module

> A page-builder block that captures email sign-ups for early access.

## Purpose

Defines the `module.waitlist` page-builder block. Every string is per-instance and per-locale, because the block lives inside a language-tagged document. The rendered form submits to `/api/waitlist`, which writes a `waitlistEntry` document. The block carries no references or images, so it passes straight through `MODULES_FRAGMENT`.

## Exports

- `default` — the `module.waitlist` schema object, added to the page-builder module list.

## Usage

```ts
import waitlist from "@indiecrafts/packages-web-page-builder/sanity/schema/modules/waitlist";

// Registered in the page-builder module array.
export const modules = [waitlist /* , … */];
```

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/waitlist.ts`
