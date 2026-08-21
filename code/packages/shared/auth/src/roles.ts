/**
 * The app's authorization contract — framework-agnostic and DOM-free. No Clerk,
 * React, or Next import (the `shared/` scope rule), so every platform's Clerk SDK
 * (`@clerk/nextjs`, `@clerk/clerk-expo`, `@clerk/clerk-react`) reads the same role
 * off the signed session token.
 *
 * The role lives in Clerk `publicMetadata` (backend-writable only → tamper-proof)
 * and rides the session JWT via the dashboard claim
 * `{ "metadata": "{{user.public_metadata}}" }`. `isAdmin` reads that claim.
 */

/**
 * Gated roles. One home for the role string. Currently just `"admin"` — the app
 * has a single global admin gate. Widen the union when a second gated role ships;
 * a future `moderator` must NOT pass `isAdmin`.
 */
export type Roles = "admin";

/**
 * The custom session-token claim shape this app reads. The single home for the
 * shape: each app augments Clerk's ambient `CustomJwtSessionClaims` FROM this
 * type (see the app brief) so it never drifts across the four apps.
 */
export type AppSessionClaims = {
  metadata?: {
    role?: Roles;
  };
};

/**
 * Strict admin check — the only exported gate. `true` only when the session claim
 * carries exactly `role: "admin"`. Safe on `null` / `undefined` / malformed claims
 * (returns `false`). Enforce it SERVER-SIDE in every admin server action, route
 * handler, and protected layout — middleware is coarse routing and is bypassable
 * (Next.js CVE-2025-29927), never the sole boundary.
 */
export function isAdmin(claims: AppSessionClaims | null | undefined): boolean {
  return claims?.metadata?.role === "admin";
}
