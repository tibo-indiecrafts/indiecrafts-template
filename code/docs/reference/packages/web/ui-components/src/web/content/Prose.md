---
title: "Prose"
description: "Renders a centered portable-text prose section."
status: stable
---

# Prose

> A portable-text prose section.

## Purpose

Renders a `module.prose` block: a centered portable-text column at normal or wide width. It is the base long-form text block of the page-builder. With `inline` set, it renders a bare `prose` column with no section, for a rich-text body or a card.

## Exports

- `Prose` — a centered portable-text section; `width` is normal or `wide`; `inline` renders it bare.

## Usage

```tsx
import { Prose } from "@indiecrafts/packages-web-ui-components/web/content/Prose";

<Prose {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/content/Prose.tsx`
