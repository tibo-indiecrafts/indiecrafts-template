---
title: "Topic cards module"
description: "Page-builder block that highlights one to three category or tag cards linking to their pages."
status: stable
---

# Topic cards module

> One to three large category or tag cards.

## Purpose

Defines the `module.blog-topic-cards` page-builder block. It holds a `cards` array of one to three cards; each card references a `category` or `tag` (its title is the default card title), with an optional background image and alt text, a title override, and a short blurb. Each card links to its category or tag page. It is the only frontpage block with no dynamic rule — it is pure taxonomy. Reference pickers are filtered to the document language.

## Exports

- `default` — the `module.blog-topic-cards` schema definition (built via `defineModule`).

## Usage

```ts
import blogTopicCards from "@indiecrafts/modules-web-blog/sanity/schema/modules/blog-topic-cards";
// Registered in schema/modules/index.ts; rendered as TopicCards by the blog ModuleRenderer.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/blog-topic-cards.ts`
