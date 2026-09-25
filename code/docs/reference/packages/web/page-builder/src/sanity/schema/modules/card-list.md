---
title: "Card List module"
description: "Sanity schema for the card-list page-builder module."
status: stable
---

# Card List module

> A responsive grid of cards, each with content, an image, and a CTA.

## Purpose

Defines the `module.card-list` block: an optional title and intro, a `columns` count (1 to 4, default 3), and an array of cards. Each card has a required title, optional rich `blockContent`, an image, and a `cta`.

## Exports

- `default` — the `module.card-list` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/card-list.ts`
