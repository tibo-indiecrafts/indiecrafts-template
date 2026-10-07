---
title: "Overlay turn"
description: "The queue that lets fixed overlays show one at a time, in priority order."
status: stable
---

# Overlay turn

> One overlay on screen at a time: required notices first, promotions last.

## Purpose

Several fixed overlays can want the screen at once on first visit: the cookie banner, the legal banner, the update prompt, the marketing nudge and the announcement card. Stacked overlays hide the page, worst on a phone. Each overlay calls `useOverlayTurn(key, wants)`; the hook returns `true` only for the highest-priority overlay that wants to show. When that overlay is done, the next one in `OVERLAY_ORDER` takes the turn.

A wish registers in a layout effect, so every overlay of one render queues before the first paint, and the others show only after hydration. The head of the order (consent) never waits: it can render from the server's first HTML, and every other overlay still waits behind it. The queue lives in module scope (one per page) and counts wishes per key, so two mounts of one overlay cannot drop each other's wish.

## Exports

- `OVERLAY_ORDER` — the priority order: `consent` · `legal` · `update` · `nudge` · `announcement`.
- `OverlayKey` (type) — one of `OVERLAY_ORDER`.
- `useOverlayTurn(key, wants)` — `true` when `wants` and no higher-priority overlay is waiting.

## Usage

```tsx
import { useOverlayTurn } from "@indiecrafts/packages-web-ui-components/web/overlay-turn";

const turn = useOverlayTurn("legal", needsReacceptance(record, version));
if (!turn) return null;
```

## Source

`code/packages/web/ui-components/src/web/overlay-turn.ts`
