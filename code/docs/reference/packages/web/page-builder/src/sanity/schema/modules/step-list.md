---
title: "Step-list module"
description: "Sanity schema for the step-list page-builder block — an ordered list of titled steps with rich content."
status: stable
---

# Step-list module

> A page-builder block that lays out a sequence of steps.

## Purpose

Defines the `module.step-list` page-builder block. An editor adds a title, an intro, and an array of steps, each with a required `title` and optional `blockContent` body. It is built with the shared `defineModule` helper.

## Exports

- `default` — the `module.step-list` schema object, added to the page-builder module list.

## Usage

```ts
import stepList from "@indiecrafts/packages-web-page-builder/sanity/schema/modules/step-list";

// Registered in the page-builder module array.
export const modules = [stepList /* , … */];
```

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/step-list.ts`
