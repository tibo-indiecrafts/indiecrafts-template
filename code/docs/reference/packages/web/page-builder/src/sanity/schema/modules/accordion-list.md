---
title: "Accordion List module"
description: "Sanity schema for the accordion-list page-builder module."
status: stable
---

# Accordion List module

> A titled, expandable list of question-and-answer items.

## Purpose

Defines the `module.accordion-list` block: an optional title and intro, plus an array of items, each with a required title and rich `blockContent`. Used inside the page-builder to render FAQ-style accordions.

## Exports

- `default` — the `module.accordion-list` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/accordion-list.ts`
