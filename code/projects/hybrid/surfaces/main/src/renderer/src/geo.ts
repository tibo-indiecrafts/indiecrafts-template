import {
  resolveConsentMode,
  type ConsentMode,
} from "@indiecrafts/packages-shared-compliance/shared";
import { apiUrl, STORAGE_KEYS, consent } from "../../config";

const CACHE_KEY = STORAGE_KEYS.geoCountry;

/**
 * Resolve the consent mode for this desktop app. The Electron renderer has no `cf-ipcountry`
 * header of its own, so the api `/v1/geo` (which sees the device's edge country) is the geo
 * source; we cache the country in `localStorage` for next launch and resolve the mode with
 * the app's per-country overrides. Fails **safe** to opt-in when the country can't be
 * determined (api unreachable with nothing cached). Never throws.
 */
export async function loadConsentMode(): Promise<ConsentMode> {
  let country: string | null = null;
  try {
    country = localStorage.getItem(CACHE_KEY);
  } catch {
    // localStorage unavailable — treat as no cache.
  }
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/v1/geo`, {
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        const body = (await res.json()) as { country?: unknown };
        country = typeof body.country === "string" ? body.country : null;
        try {
          localStorage.setItem(CACHE_KEY, country ?? "");
        } catch {
          // ignore a write failure — non-fatal.
        }
      }
    } catch {
      // Unreachable — keep whatever was cached (or null → opt-in).
    }
  }
  return resolveConsentMode(country || null, consent);
}
