/**
 * Shared reorder for the frontpage blocks' pinned/trending posts. GROQ only
 * filters by `_id in $ids` — it does not preserve the array's order — so the
 * renderer re-sorts client-side to respect the editor's/popularity's order.
 * An item whose `_id` is not in `ids` gets `indexOf === -1` and sorts first
 * (current behavior, preserved as-is).
 */
export function reorderByIds<T extends { _id: string }>(
  items: T[],
  ids: string[],
): T[] {
  return [...items].sort((a, b) => ids.indexOf(a._id) - ids.indexOf(b._id));
}

/**
 * `BlogTrending`'s merge: reorder the pinned posts by `pinnedIds` and the
 * fallback (trending/recent) posts by `fallbackIds`, drop any fallback post
 * already pinned, then concat pinned-first and cap to `count`.
 */
export function mergePinnedWithFallback<T extends { _id: string }>(
  pinned: T[],
  pinnedIds: string[],
  fallback: T[],
  fallbackIds: string[],
  count: number,
): T[] {
  const orderedPinned = reorderByIds(pinned, pinnedIds);
  const orderedFallback = reorderByIds(fallback, fallbackIds);
  const pinnedIdSet = new Set(orderedPinned.map((item) => item._id));
  return [
    ...orderedPinned,
    ...orderedFallback.filter((item) => !pinnedIdSet.has(item._id)),
  ].slice(0, count);
}
