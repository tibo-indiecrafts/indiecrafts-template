/**
 * Legal re-acceptance deposit — a small first-party cookie recording which legal
 * version the visitor acknowledged. UNLIKE cookie consent (localStorage), this is
 * a real cookie so the SERVER can read it in the layout and decide whether to
 * render the banner — no client-side flash. Framework-free + `typeof`-guarded so
 * the same module is safe to import from a server component (for the name) and a
 * client component (for the writer).
 */

import { site } from "@indiecrafts/config";

/**
 * Cookie name, namespaced by `site.prefix` so two template instances on a shared
 * origin never collide (matches the consent `STORAGE_KEY` convention).
 */
export const LEGAL_ACK_COOKIE = `${site.prefix}.legal-ack`;

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Deposit the acknowledged legal `version` (client-side, on Accept). First-party,
 * `SameSite=Lax`, `Secure` on https, 1-year max-age. Strictly-necessary storage —
 * declared in the cookie policy, set without prior consent.
 */
export function acceptLegal(version: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LEGAL_ACK_COOKIE}=${encodeURIComponent(version)}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
