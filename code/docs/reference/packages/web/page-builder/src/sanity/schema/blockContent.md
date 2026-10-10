---
title: "Rich text block content"
description: "Reusable Sanity rich-text array with inline-embeddable modules."
status: stable
---

# Rich text block content

> The reusable `blockContent` rich-text field with inline-embeddable modules.

## Purpose

Defines the reusable rich-text field referenced as `type: "blockContent"` from post bodies, author bios, accordion items, and callout content. It provides standard block styles, lists, marks, images, and a code block. It also accepts the 13 inline-embeddable modules in `INLINE_MODULES`. Editors drop them into a block array from the Studio "+" picker. `hero`, `feature-grid`, `pricing`, `prose` and every `blog-*` block are section-only. The runtime PortableText renderer maps each module `_type` to its React component. A test keeps `INLINE_MODULES` equal to the renderer's `INLINE_TYPES`.

## Exports

- `default` — the `defineType` array schema for `blockContent`, registered through the schema barrel.
- `INLINE_MODULES` — the 13 `module.*` types that editors can embed in rich text.
- `headingSkip(blocks)` — the first heading that skips a level (H2 → H4) as an editor message, or `null`. The array's validation shows it as a Studio warning.

## Usage

```ts
import blockContent from "@indiecrafts/packages-web-page-builder/sanity/schema/blockContent";

// referenced from another schema field
defineField({ name: "body", type: "blockContent" });
```

## Source

`code/packages/web/page-builder/src/sanity/schema/blockContent.ts`
