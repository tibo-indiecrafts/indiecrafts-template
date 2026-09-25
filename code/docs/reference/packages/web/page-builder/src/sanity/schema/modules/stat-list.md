---
title: "Stat-list module"
description: "Sanity schema for the stat-list page-builder block — a titled grid of value/label statistics."
status: stable
---

# Stat-list module

> A page-builder block that shows a set of headline statistics.

## Purpose

Defines the `module.stat-list` page-builder block. An editor adds a title, an intro, and an array of statistics, each with a required `value` and an optional `label`. It is built with the shared `defineModule` helper.

## Exports

- `default` — the `module.stat-list` schema object, added to the page-builder module list.

## Usage

```ts
import statList from "@indiecrafts/packages-web-page-builder/sanity/schema/modules/stat-list";

// Registered in the page-builder module array.
export const modules = [statList /* , … */];
```

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/stat-list.ts`
