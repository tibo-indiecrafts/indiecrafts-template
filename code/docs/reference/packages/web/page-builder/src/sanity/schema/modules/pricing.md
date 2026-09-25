---
title: "Pricing module"
description: "Sanity schema for the pricing page-builder module."
status: stable
---

# Pricing module

> A title and a row of plan tiers with features and CTAs.

## Purpose

Defines the `module.pricing` block: an optional title (wrap a word in `[[ ]]` for the accent colour) and intro, plus an array of tiers. Each tier has a required name, a price, an optional period and description, a `highlighted` flag with an optional badge, a feature list, and a `cta`. Rendered by `Pricing` in `@indiecrafts/packages-web-ui-components/web/collection`.

## Exports

- `default` — the `module.pricing` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/pricing.ts`
