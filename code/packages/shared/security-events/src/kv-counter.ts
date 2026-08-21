/**
 * A tiny TTL counter over a KV-like store — the DB-free half of app-level detection.
 * Failed-login rates are counted in KV (cheap, ephemeral), NOT written per-request to
 * D1; only when a count crosses a threshold does one incident row reach the EU D1.
 * Structural `KvLike` keeps the brick Worker-agnostic and unit-testable with a fake.
 */

/** The subset of the Cloudflare KV binding this helper uses. */
export interface KvLike {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
}

/**
 * Increment a TTL-scoped counter and return the new value. Approximates a sliding
 * window: each hit re-arms `ttlSeconds`, so the key expires that long after the LAST
 * hit. Cloudflare KV enforces a 60-second floor on `expirationTtl`.
 *
 * ponytail: read-then-write, not atomic (KV has no INCR) — concurrent bumps can
 * undercount under a burst. Fine for low-volume failed-login counting; move to a
 * Durable Object counter only if exact counts ever matter.
 */
export async function bumpCounter(
  kv: KvLike,
  key: string,
  ttlSeconds: number,
): Promise<number> {
  const current = Number((await kv.get(key)) ?? 0) || 0;
  const next = current + 1;
  await kv.put(key, String(next), {
    expirationTtl: Math.max(60, ttlSeconds),
  });
  return next;
}
