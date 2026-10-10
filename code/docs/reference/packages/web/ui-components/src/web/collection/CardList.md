---
title: "Card list"
description: "Renders a centered title over a bordered grid of content cards."
status: stable
---

# Card list

> A bordered grid of content cards.

## Purpose

Renders a `module.card-list` block: a centered title over a bordered grid of content cards. Each card can carry an image, title, portable-text body, and a CTA. Column count and padding key off the container width, not the viewport. With `inline` set, `ModuleSection` renders it bare (`not-prose`, no gutters) for a rich-text body or a sidebar card. Without it, the block is a full-width section.

## Exports

- `CardList` — renders a bordered grid of content cards from a `CardListModule` plus portable-text components and an optional `inline`.

## Usage

```tsx
import { CardList } from "@indiecrafts/packages-web-ui-components/web/collection/CardList";

<CardList {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/CardList.tsx`
