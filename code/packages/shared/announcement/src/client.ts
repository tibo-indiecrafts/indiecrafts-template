/**
 * Announcement HTTP client — the ONE fetch the client-gated surfaces (app,
 * mobile) use to read the `code/shared/api` Worker's public `GET /v1/announcements`.
 * Isomorphic (global `fetch`: browser · RN · Node), never throws — a network blip or
 * unset base URL just yields `null` (show nothing). No token: the endpoint is public
 * (the same content shows on the public website).
 */

import type { AnnouncementPayload, Surface } from "./types";

export async function fetchAnnouncements(
  baseUrl: string | undefined | null,
  { locale, surface }: { locale: string; surface: Surface },
): Promise<AnnouncementPayload | null> {
  if (!baseUrl) return null;
  try {
    const res = await fetch(
      `${baseUrl}/v1/announcements?locale=${encodeURIComponent(locale)}&surface=${encodeURIComponent(surface)}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as AnnouncementPayload;
  } catch {
    return null; // offline / unreachable → show nothing
  }
}
