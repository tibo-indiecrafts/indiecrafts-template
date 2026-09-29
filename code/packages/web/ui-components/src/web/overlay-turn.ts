"use client";

/**
 * Let the fixed overlays take turns: one on screen at a time, in priority order.
 *
 * @see docs/reference/packages/web/ui-components/src/web/overlay-turn.md
 */
import { useLayoutEffect, useSyncExternalStore } from "react";

/** Highest priority first: required notices, then the site's own prompts, then promotions. */
export const OVERLAY_ORDER = [
  "consent",
  "legal",
  "update",
  "nudge",
  "announcement",
] as const;
export type OverlayKey = (typeof OVERLAY_ORDER)[number];

// One queue per page (module scope). A count per key, so two mounts of the same
// overlay (e.g. a signed-in and a signed-out variant) cannot drop each other's wish.
const waiting = new Map<OverlayKey, number>();
const listeners = new Set<() => void>();
let current: OverlayKey | null = null;

function update(key: OverlayKey, delta: 1 | -1) {
  const n = (waiting.get(key) ?? 0) + delta;
  if (n > 0) waiting.set(key, n);
  else waiting.delete(key);
  const next = OVERLAY_ORDER.find((k) => waiting.has(k)) ?? null;
  if (next === current) return;
  current = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * `true` when this overlay wants to show and no higher-priority overlay is waiting.
 * Nothing shows on the server or during hydration; the wish registers in a layout
 * effect, so every overlay of one render queues before the first paint.
 */
export function useOverlayTurn(key: OverlayKey, wants: boolean): boolean {
  useLayoutEffect(() => {
    if (!wants) return;
    update(key, 1);
    return () => update(key, -1);
  }, [key, wants]);
  const turn = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  return wants && turn === key;
}
