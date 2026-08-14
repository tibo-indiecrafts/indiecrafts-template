/**
 * Overlay `over` (Sanity `uiMessages`) onto `base` (the bundled
 * `messages/<locale>.json` fallback). Sanity wins where it has a non-empty
 * value; a blank/missing Sanity field keeps the fallback, so a half-filled
 * document never ships empty chrome. Recurses into nested groups. Pure — no
 * Sanity imports — so it stays unit-testable in isolation.
 */
export function overlayMessages(base: unknown, over: unknown): unknown {
  if (over === null || over === undefined) return base;
  if (typeof over === "string") return over.trim() === "" ? base : over;
  if (
    typeof over === "object" &&
    !Array.isArray(over) &&
    typeof base === "object" &&
    base !== null &&
    !Array.isArray(base)
  ) {
    const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
      merged[k] = overlayMessages((base as Record<string, unknown>)[k], v);
    }
    return merged;
  }
  return over;
}
