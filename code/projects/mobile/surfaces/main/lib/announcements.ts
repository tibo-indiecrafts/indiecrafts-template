/**
 * Reads the shared api Worker's PUBLIC `/v1/announcements` for the MOBILE surface.
 * The fetch + never-throw contract lives once in `@indiecrafts/packages-shared-announcement`;
 * this file just injects the mobile env (`EXPO_PUBLIC_API_URL`, the same base the session
 * sink uses). Returns `null` when the URL is unset or the device is offline.
 */
import {
  fetchAnnouncements,
  type AnnouncementPayload,
} from "@indiecrafts/packages-shared-announcement";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function getAnnouncements(
  locale: string,
): Promise<AnnouncementPayload | null> {
  return fetchAnnouncements(API_URL, { locale, surface: "mobile" });
}
