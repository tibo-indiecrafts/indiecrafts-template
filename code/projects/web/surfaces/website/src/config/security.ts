/**
 * Per-route request-boundary policy for the public API — one home for every
 * `withGuard` limit so the security posture is reviewable in one place (and the
 * repeated `windowSec` / `bodyMax` tiers aren't copied across six routes).
 *
 * Each key is passed straight into `withGuard(handler, security.<name>)` (or, for
 * `moderate`, into a direct `rateLimit()` call). `bodyMax` is bytes; `windowSec` is
 * the fixed-window length; `turnstile` opts the route into the bot check.
 *
 * These are **defence-in-depth**: the Cloudflare WAF `/api/*` rule is the PRIMARY
 * limiter, and both the KV rate-limit and Turnstile **fail open** until the operator
 * binds `RATE_LIMIT_KV` + sets `TURNSTILE_SECRET` (see
 * `code/docs/apps/web/config/security-limits.md`). App-owned (a second app ships its
 * own limits), like `features` — not the shared `@indiecrafts/packages-shared-config` package.
 */

import { rateLimits } from "@indiecrafts/packages-shared-config";

export const security = {
  /** Public newsletter subscribe — `/api/newsletter`. */
  newsletter: { rateLimit: rateLimits.strict, bodyMax: 8000, turnstile: true },
  /** Public waitlist join — `/api/waitlist`. */
  waitlist: { rateLimit: rateLimits.strict, bodyMax: 8000, turnstile: true },
  /** Public contact form — `/api/contact` (carries a free-text message). */
  contact: { rateLimit: rateLimits.strict, bodyMax: 12_000, turnstile: true },
  /** Public blog comment create — `/api/comments` (stored unapproved). */
  comments: { rateLimit: rateLimits.standard, bodyMax: 12_000, turnstile: true },
  /** GDPR data-subject request — `/api/data-request`. */
  dataRequest: { rateLimit: rateLimits.strict, bodyMax: 8000, turnstile: true },
  /** Double-opt-in confirm — `/api/newsletter/confirm`. The one-time token is the auth, so no Turnstile. */
  confirm: { rateLimit: rateLimits.confirm, bodyMax: 2000 },
  /** One-click email moderation — `/api/comments/moderate`. Cross-site form POST, token-gated; rate-limit is defence-in-depth on the token. */
  moderate: { rateLimit: rateLimits.lenient },
} as const;
