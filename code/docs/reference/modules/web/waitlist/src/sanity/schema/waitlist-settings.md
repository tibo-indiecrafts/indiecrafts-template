---
title: "Waitlist settings schema"
description: "Sanity singleton for the editor toggle and per-locale waitlist form copy."
status: stable
---

# Waitlist settings schema

> The editor-configurable layer over the `features.waitlist` code flag.

## Purpose

Defines the `waitlistSettings` singleton. The code flag `features.waitlist` is the hard on/off; this document adds an `enabled` toggle plus per-locale form copy (heading, description, email placeholder, labels, consent text, success and error messages) and an SEO block. Off hides the page and every waitlist block (`MODULES_FRAGMENT` carries the switch). The join emails live on the shared `emailStrings` singleton, not here. Read via `getWaitlistSettings()`.

## Exports

- `default` — the `defineType` document definition for `waitlistSettings`.

## Usage

```ts
import waitlistSettings from "@indiecrafts/modules-web-waitlist/sanity/schema/waitlist-settings";
```

## Source

`code/modules/web/waitlist/src/sanity/schema/waitlist-settings.ts`
