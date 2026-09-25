/**
 * Resolve the consent mode for this device from its edge country.
 *
 * @see docs/reference/projects/mobile/main/lib/geo.md
 */
import {
  resolveConsentMode,
  type ConsentMode,
} from "@indiecrafts/packages-shared-compliance/shared";
import { storage } from "@/lib/storage";
import { STORAGE_KEYS, consent } from "@/config";

/**
 * Resolve the consent mode for this device. Native apps have no `cf-ipcountry` header of
 * their own, so the api `/v1/geo` (which sees the device's edge country) is the geo source;
 * we cache the country for next launch and resolve the mode with the app's per-country
 * overrides. Fails **safe** to opt-in when the country can't be determined (api unreachable
 * with nothing cached). Never throws.
 */
export async function loadConsentMode(): Promise<ConsentMode> {
  const url = process.env.EXPO_PUBLIC_API_URL;
  let country = await storage.get(STORAGE_KEYS.geoCountry);
  if (url) {
    try {
      const res = await fetch(`${url}/v1/geo`, {
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        const body = (await res.json()) as { country?: unknown };
        country = typeof body.country === "string" ? body.country : null;
        await storage.set(STORAGE_KEYS.geoCountry, country ?? "");
      }
    } catch {
      // Unreachable — keep whatever was cached (or null → opt-in).
    }
  }
  return resolveConsentMode(country || null, consent);
}
