/**
 * Announcement dismiss deposit — small first-party cookies recording which bar /
 * toast version the visitor closed, so the layout can decide server-side whether to
 * render (no flash). Mirrors `@indiecrafts/packages-web-compliance`'s `legal-store`.
 * Framework-free + `typeof`-guarded so the server imports the name/reader and the
 * client imports the writer.
 */

import { site } from "@indiecrafts/packages-shared-config";

/** Cookie names, namespaced by `site.prefix` (matches the consent/legal convention). */
export const ANNOUNCEMENT_COOKIE = `${site.prefix}.announcement-ack`;
export const ANNOUNCEMENT_TOAST_COOKIE = `${site.prefix}.announcement-toast-ack`;

const ONE_YEAR = 60 * 60 * 24 * 365;

function writeAck(name: string, version: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(version)}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}

function readAck(name: string): string {
  if (typeof document === "undefined") return "";
  for (const part of document.cookie.split("; ")) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq) === name)
      return decodeURIComponent(part.slice(eq + 1));
  }
  return "";
}

/** Remember that this announcement bar `version` was dismissed (client-side, on close). */
export function dismissAnnouncement(version: string) {
  writeAck(ANNOUNCEMENT_COOKIE, version);
}

/** Remember that this toast `version` was dismissed (client-side, on close). */
export function dismissToast(version: string) {
  writeAck(ANNOUNCEMENT_TOAST_COOKIE, version);
}

/** The dismissed bar version (client read; `""` server-side or when never dismissed). */
export function readAnnouncementAck(): string {
  return readAck(ANNOUNCEMENT_COOKIE);
}

/** The dismissed toast version (client read; `""` server-side or when never dismissed). */
export function readToastAck(): string {
  return readAck(ANNOUNCEMENT_TOAST_COOKIE);
}
