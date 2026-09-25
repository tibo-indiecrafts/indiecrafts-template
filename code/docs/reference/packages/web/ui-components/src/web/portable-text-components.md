---
title: "PortableText render map"
description: "Shared PortableText component map for rendering module bodies."
status: stable
---

# PortableText render map

> The `components` map that renders rich-text bodies and inline modules.

## Purpose

Builds the shared PortableText render map for module bodies. Base block, list,
and mark styling comes from the Tailwind typography plugin; this map overrides
only what markup cannot infer: headings get a slugified `id` for anchor links,
the `link` mark promotes external URLs to a new tab, and twelve inline module
types map to the same React components the layout renderer uses.

## Exports

- `portableComponents` — the `PortableTextComponents` map passed to `PortableText`.

## Usage

```tsx
import { PortableText } from "@portabletext/react";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";

<PortableText value={body} components={portableComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/portable-text-components.tsx`
