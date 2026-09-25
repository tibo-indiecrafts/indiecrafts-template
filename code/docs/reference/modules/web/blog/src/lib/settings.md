---
title: "Blog display settings"
description: "Resolves the editor's blog.display toggles against the feature flags."
status: stable
---

# Blog display settings

> The editor's display toggles, folded into the feature flags.

## Purpose

Reads the blog singleton's `display` toggles and folds them into the compiled feature flags. Taxonomy is two-tier: a listing shows only when the code capability AND the editor toggle are both on. Everything else is editor-only (an unset toggle defaults to on). The read is request-deduped via React `cache`, so any server component, route, or sitemap can call it freely.

## Exports

- `getBlogSettings()` — the resolved `BlogDisplay`, request-deduped.
- `resolveBlogDisplay(raw)` — pure folder of raw toggles into `BlogDisplay`.

## Usage

```ts
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";

const display = await getBlogSettings();
if (display.taxonomy.categoryNav) {
  // render the category bar
}
```

## Source

`code/modules/web/blog/src/lib/settings.ts`
