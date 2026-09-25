---
title: "Frontpage selector"
description: "Chooses between editor-composed modules and the code default for the blog frontpage."
status: stable
---

# Frontpage selector

> One pure helper: editor modules, or the code default?

## Purpose

A small pure helper for the blog frontpage route. It returns `"modules"` when the editor has stacked any blog frontpage modules in the Studio, and `"default"` otherwise, so the route can pick the editor layout or the code default.

## Exports

- `pickFrontpage(modules)` — returns `"modules"` when the array has entries, else `"default"`.

## Usage

```ts
import { pickFrontpage } from "./frontpage-select";

const layout = pickFrontpage(blog?.frontpageModules); // "modules" | "default"
```

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/frontpage-select.ts`
