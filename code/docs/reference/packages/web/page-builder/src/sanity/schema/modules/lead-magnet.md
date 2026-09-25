---
title: "Lead Magnet module"
description: "Sanity schema for the lead-magnet capture page-builder module."
status: stable
---

# Lead Magnet module

> An email capture tied to a downloadable resource.

## Purpose

Defines the `module.lead-magnet` block: the same email and consent capture as the newsletter, plus a required `magnet` reference to the downloadable `leadMagnet` document the person receives after confirming their email. Every string is per-instance and per-locale. It submits to `/api/newsletter` with `source: "lead-magnet"` and the magnet id as a tag; `MODULES_FRAGMENT` dereferences the `magnet` reference to its `id`.

## Exports

- `default` — the `module.lead-magnet` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/lead-magnet.ts`
