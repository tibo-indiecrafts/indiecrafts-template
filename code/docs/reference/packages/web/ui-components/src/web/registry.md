---
title: "Block registry"
description: "The _type to component map for generic page-builder blocks, plus a render helper."
status: stable
---

# Block registry

> The single map from a block `_type` to its React renderer.

## Purpose

Holds the one `_type` to component map for the generic page-builder blocks, so
the app and the blog paint the same blocks. Two consumers derive from it: the
PortableText `types` map for inline blocks, and any page dispatcher that spreads
the map and adds its own modules. A `satisfies` clause forces exhaustiveness, so
a missing or drifting `_type` is a compile error.

## Exports

- `BLOCK_RENDERERS` — the `_type` to component map for the generic blocks.
- `renderBlock(module, components)` — renders one block by `_type`, warning and skipping an unknown type instead of throwing.

## Usage

```tsx
import { renderBlock } from "@indiecrafts/packages-web-ui-components/web/registry";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";

renderBlock(module, portableComponents);
```

## Source

`code/packages/web/ui-components/src/web/registry.tsx`
