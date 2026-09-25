---
title: "Author card"
description: "Author profile card linking to the author's detail page, used on the author index and Top Authors."
status: stable
---

# Author card

> A portrait-and-bio tile that links to an author's page.

## Purpose

Renders one author as a card: portrait (or an initial fallback), name, position, a clamped bio, and an optional post count. Used by the `/author` index and the home Top Authors section. Accepts either a full `Author` document or the lightweight `AuthorRef`.

## Exports

- `AuthorCard` — server component. Props: `author` (`AuthorRef | Author`) and optional `postsLabel` (a template string where `{count}` is replaced by the post count).

## Usage

```tsx
import { AuthorCard } from "@indiecrafts/modules-web-blog/user-interface/author/components/AuthorCard";

<AuthorCard author={author} postsLabel="{count} posts" />;
```

## Source

`code/modules/web/blog/src/user-interface/author/components/AuthorCard.tsx`
