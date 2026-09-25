---
title: "Comment submission"
description: "Validates and creates an unapproved blog comment document in Sanity."
status: stable
---

# Comment submission

> The single runtime write path for reader comments.

## Purpose

Validates a comment submission, then creates a `comment` document with `approved: false` (invisible until an editor approves). Fields are whitelisted and `_type` is hard-coded — the request body is never spread into the mutation. A honeypot field and a too-fast-submit heuristic drop bot submissions as spam.

## Exports

- `validateComment(input)` — pure validator; returns a `CommentResult`.
- `createComment(input, createdAt, policyVersion?)` — validates, checks the target post exists, resolves an optional parent, writes the document, and fires a best-effort owner alert.
- `CommentInput` — the submission input type.
- `CommentResult` — `{ ok: true }` or `{ ok: false; error: "invalid" | "spam" | "server" }`.

## Usage

```ts
import { createComment } from "@indiecrafts/modules-web-blog/lib/comments";

const result = await createComment(
  input,
  new Date().toISOString(),
  "2025-01-01",
);
if (!result.ok) return respondWith(result.error);
```

## Source

`code/modules/web/blog/src/lib/comments.ts`
