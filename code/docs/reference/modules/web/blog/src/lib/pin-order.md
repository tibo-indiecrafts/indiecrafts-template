---
title: "Pinned-post reorder helpers"
description: "Re-sorts and merges pinned and fallback posts for the frontpage blocks."
status: stable
---

# Pinned-post reorder helpers

> Restore the editor's pin order that GROQ's `_id in $ids` does not preserve.

## Purpose

GROQ filters by `_id in $ids` but does not keep the array's order, so the frontpage renderers re-sort client-side. These helpers restore the editor's (or popularity's) order and merge pinned posts ahead of the rule-filled fallback.

## Exports

- `reorderByIds(items, ids)` — re-sorts `items` by the order of `ids`.
- `mergePinnedWithFallback(pinned, pinnedIds, fallback, fallbackIds, count)` — reorders both lists, drops fallback posts already pinned, concatenates pinned-first, and caps to `count`.

## Usage

```ts
import { mergePinnedWithFallback } from "@indiecrafts/modules-web-blog/lib/pin-order";

const posts = mergePinnedWithFallback(
  pinned,
  pinnedIds,
  fallback,
  fallbackIds,
  6,
);
```

## Source

`code/modules/web/blog/src/lib/pin-order.ts`
