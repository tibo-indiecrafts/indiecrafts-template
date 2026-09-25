---
title: "PortableText to Markdown"
description: "Serializes PortableText blocks to Markdown for the .md post export."
status: stable
---

# PortableText to Markdown

> A minimal PortableText to Markdown serializer.

## Purpose

Serializes the block / span / image / link shapes used by the blog's `blockContent` schema into Markdown for the `/md` post export. Unknown block types are logged once and skipped rather than throwing, so the route always returns something even when an editor adds a new block type before the serializer is updated.

## Exports

- `portableTextToMarkdown(blocks)` — joins the serialized blocks into a Markdown string.

## Usage

```ts
import { portableTextToMarkdown } from "@indiecrafts/modules-web-blog/sanity/portable-to-markdown";

const markdown = portableTextToMarkdown(post.body);
```

## Source

`code/modules/web/blog/src/sanity/portable-to-markdown.ts`
