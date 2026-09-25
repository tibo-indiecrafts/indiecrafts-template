---
title: "Feature Grid module"
description: "Sanity schema for the feature-grid page-builder module."
status: stable
---

# Feature Grid module

> A title and a grid of icon cards, each with a title and short body.

## Purpose

Defines the `module.feature-grid` block: an optional title (wrap a word in `[[ ]]` for the accent colour) and intro, plus an array of feature cards. Each card picks an icon from the fixed Lucide glyph set, and has a required title and a short body. Rendered by `FeatureGrid` in `@indiecrafts/packages-web-ui-components/web/collection`.

## Exports

- `default` — the `module.feature-grid` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/feature-grid.ts`
