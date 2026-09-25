---
title: "Custom HTML module"
description: "Sanity schema for the raw-HTML page-builder module."
status: stable
---

# Custom HTML module

> A raw HTML escape hatch for trusted editors only.

## Purpose

Defines the `module.custom-html` block: a required `html` text field and a `width` option (`contained` or `full`). The HTML is rendered with `dangerouslySetInnerHTML`, so any markup or `<script>` runs with the site's privileges. Keep the field role-gated to trusted editors.

## Exports

- `default` — the `module.custom-html` schema built with `defineModule`.

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/custom-html.ts`
