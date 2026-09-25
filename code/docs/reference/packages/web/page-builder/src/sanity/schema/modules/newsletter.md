---
title: "Newsletter module"
description: "Sanity schema for the newsletter capture page-builder module."
status: stable
---

# Newsletter module

> An email newsletter capture block.

## Purpose

Defines the `module.newsletter` block: heading, body, email field, button label, consent text, status messages, and a layout `variant`. Every string is per-instance and per-locale. It submits to `/api/newsletter`; the destination is set by `newsletter.destination` in `@indiecrafts/packages-shared-config`.

## Exports

- `default` — the `module.newsletter` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/newsletter.ts`
