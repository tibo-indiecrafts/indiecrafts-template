---
title: "Quote document"
description: "Sanity document schema for a testimonial, referenced by the Quote List module."
status: stable
---

# Quote document

> A reusable testimonial record with author, role, and photo.

## Purpose

Defines the `quote` Sanity document: a testimonial with content, author name, role, and author photo. The `quote-list` module references it. The `language` field is managed by `@sanity/document-internationalization`.

## Exports

- `default` — the `quote` document schema built with `defineType`.

## Source

`code/packages/web/page-builder/src/sanity/schema/documents/quote.ts`
