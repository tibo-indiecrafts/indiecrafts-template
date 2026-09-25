---
title: "Card list"
description: "Renders a centered title over a bordered grid of content cards."
status: stable
---

# Card list

> A bordered grid of content cards.

## Purpose

Renders a `module.card-list` block: a centered title over a bordered grid of content cards. Each card can carry an image, title, portable-text body, and a CTA. Column count keys off the container width, not the viewport.

## Exports

- `CardList` — renders a bordered grid of content cards from a `CardListModule` plus portable-text components.

## Usage

```tsx
import { CardList } from "@indiecrafts/packages-web-ui-components/web/collection/CardList";

<CardList {...module} components={portableTextComponents} />;
```

## Source

`code/packages/web/ui-components/src/web/collection/CardList.tsx`
