---
title: "Comment moderation"
description: "Runs one-click comment moderation from a single-use email token."
status: stable
---

# Comment moderation

> Token-driven approve / spam / delete for a comment.

## Purpose

Backs the email moderation buttons and their confirm page. A comment carries a `moderationToken`; the lookup reads the comment behind a token, and the action applies it. Each action is single-use — the token is cleared (or the doc deleted), so the link cannot be replayed.

## Exports

- `getModerationComment(token)` — the comment behind a token, or `null` when invalid or already used.
- `moderateComment(token, action)` — applies the action; returns `"done"` or `"invalid"`.
- `isModerationAction(value)` — type guard for a `ModerationAction`.
- `ModerationAction` — `"approve" | "spam" | "delete"`.
- `ModerationComment` — the read-only comment shape for the confirm page.

## Usage

```ts
import { moderateComment } from "@indiecrafts/modules-web-blog/lib/moderate";

const outcome = await moderateComment(token, "approve");
```

## Source

`code/modules/web/blog/src/lib/moderate.ts`
