/**
 * Announcement dismiss deposit — a small first-party cookie recording which
 * announcement version the visitor closed, so the layout can decide server-side
 * whether to render the bar (no flash). Mirrors `@indiecrafts/compliance`'s
 * `legal-store`. Framework-free + `typeof`-guarded so the server imports the name
 * and the client imports the writer.
 */

import { site } from "@indiecrafts/config";

/** Cookie name, namespaced by `site.prefix` (matches the consent/legal convention). */
export const ANNOUNCEMENT_COOKIE = `${site.prefix}.announcement-ack`;

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remember that this announcement `version` was dismissed (client-side, on close). */
export function dismissAnnouncement(version: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${ANNOUNCEMENT_COOKIE}=${encodeURIComponent(version)}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
