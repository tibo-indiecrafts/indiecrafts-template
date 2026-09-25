---
title: "Prose"
description: "Renders a centered portable-text prose section."
status: stable
---

# Prose

> A portable-text prose section.

## Purpose

Renders a `module.prose` block: a centered portable-text column at normal or wide width. It is the base long-form text block of the page-builder.

## Exports

- `Prose` — a centered portable-text section; `width` is normal or `wide`.

## Usage

```tsx
import { Prose } from "@indiecrafts/packages-web-ui-components/web/content/Prose";

<Prose {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/content/Prose.tsx`
