---
title: "SEO metadata field"
description: "The single per-page SEO, LLMs, and visibility Sanity object carried on every routed document."
status: stable
---

# SEO metadata field

> One field-set for search, social, structured data, LLM hints, and page visibility.

## Purpose

Defines the `seoMeta` Sanity object: the one per-page SEO model, carried as `.seo` on every document a route renders (`page`, `blog`, `post`, `author`, `category`, `tag`, `series`, `legalPage`, `waitlistSettings`). It merges what used to be three near-duplicate objects into one collapsible field-set.

## Exports

- `default` (`seoMeta`) — a collapsible Sanity object with fields for `title`, `description`, `keywords`, share `image`, `schemaImage`, `canonical`, `noIndex`, `hideFromDiscovery`, `unpublished`, `structuredData` (references `globalSchema`), and the `llmsSection` / `llmsSummary` / `llmsFull` LLM hints.

## Usage

```ts
import { defineField } from "sanity";

defineField({ name: "seo", title: "SEO & visibility", type: "seoMeta" });
```

## Source

`code/packages/web/schema/src/seo-meta.ts`
