---
title: "Rich text block content"
description: "Reusable Sanity rich-text array with inline-embeddable modules."
status: stable
---

# Rich text block content

> The reusable `blockContent` rich-text field with inline-embeddable modules.

## Purpose

Defines the reusable rich-text field referenced as `type: "blockContent"` from post bodies, author bios, accordion items, and callout content. It provides standard block styles, lists, marks, images, and a code block, plus 12 inline-embeddable modules that editors can drop into a block array from the Studio "+" picker. Page-chrome and recursive modules are deliberately excluded from inline embedding. The runtime PortableText renderer maps each module `_type` to its React component.

## Exports

- `default` — the `defineType` array schema for `blockContent`, registered through the schema barrel.

## Usage

```ts
import blockContent from "@indiecrafts/packages-web-page-builder/sanity/schema/blockContent";

// referenced from another schema field
defineField({ name: "body", type: "blockContent" });
```

## Source

`code/packages/web/page-builder/src/sanity/schema/blockContent.ts`
