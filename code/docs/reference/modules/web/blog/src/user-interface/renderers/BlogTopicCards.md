---
title: "Topic cards renderer"
description: "Frontpage block showing up to three category or tag cards linking to listing pages."
status: stable
---

# Topic cards renderer

> Maps resolved taxonomy targets onto the generic `TopicCards` primitive.

## Purpose

`BlogTopicCards` renders the frontpage "Topic Cards" block. Unlike every other frontpage block, it points at taxonomy, not posts: each card's `target` and `image` are already resolved by the blog's `MODULES_FRAGMENT`, so this just builds the link (category or tag listing page) and maps onto `TopicCards`. Cards whose target did not resolve (for example a deleted category) are skipped; `TopicCards` renders nothing once the list is empty.

## Exports

- `BlogTopicCards` — component; takes `module` (`BlogTopicCardsModule`) and `locale` (`Locale`).

## Usage

```tsx
import { BlogTopicCards } from "@indiecrafts/modules-web-blog/user-interface/renderers/BlogTopicCards";

<BlogTopicCards module={m} locale={locale} />;
```

## Source

`code/modules/web/blog/src/user-interface/renderers/BlogTopicCards.tsx`
