/**
 * Reusable rate-limit presets for the public API — the *defaults* a web surface
 * starts from. A surface still owns its per-route policy (bodyMax / turnstile),
 * but the rate tiers live here so a second app doesn't re-invent the numbers.
 * Consumed via `@/config`; see each app's `src/config/security.ts`.
 */

/** Fixed-window length for every rate limit (10 minutes). */
export const RATE_WINDOW_SEC = 600;

/** Named rate-limit tiers, all on the shared window. */
export const rateLimits = {
  /** Public unauthenticated forms (newsletter · waitlist · contact · data-request). */
  strict: { limit: 5, windowSec: RATE_WINDOW_SEC },
  /** Slightly looser — user-generated create paths (comments). */
  standard: { limit: 8, windowSec: RATE_WINDOW_SEC },
  /** Token-gated double opt-in confirm. */
  confirm: { limit: 10, windowSec: RATE_WINDOW_SEC },
  /** Token-gated one-click actions (email moderation) — rate limit is defence-in-depth. */
  lenient: { limit: 20, windowSec: RATE_WINDOW_SEC },
} as const;

export type RateLimitTier = keyof typeof rateLimits;
