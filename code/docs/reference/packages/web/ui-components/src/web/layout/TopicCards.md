---
title: "Topic cards"
description: "Renders one to three large image cards that link to a category or tag listing page."
status: stable
---

# Topic cards

> Large clickable image cards that point at blog taxonomy, not posts.

## Purpose

Renders the blog's `module.blog-topic-cards` block. It shows one to three
full-bleed image cards, each linking to a category or tag listing page. One item
fills the row; two or three split it evenly. The block renders nothing when
`items` is empty.

## Exports

- `TopicCardItem` — the shape of one card: `_key`, `title`, optional `blurb`, optional `image`, optional `alt`, and `href`.
- `TopicCards` — the component; takes `{ items: TopicCardItem[] }` and renders the responsive grid.

## Usage

```tsx
import {
  TopicCards,
  type TopicCardItem,
} from "@indiecrafts/packages-web-ui-components/web/layout/TopicCards";

const items: TopicCardItem[] = [
  { _key: "1", title: "Guides", href: "/guides", image: "/topic.jpg" },
];

<TopicCards items={items} />;
```

## Source

`code/packages/web/ui-components/src/web/layout/TopicCards.tsx`
