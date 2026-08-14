import { cookies } from "next/headers";
import {
  defaultLocale,
  isLocale,
  localeCodes,
  localeCookieName,
  type Locale,
} from "@/config";

/**
 * Best-effort locale for the standalone `/maintenance` route. It lives
 * outside the `[locale]` segment (the proxy rewrites here before next-intl
 * runs), so we read next-intl's locale cookie (`localeCookieName`, namespaced by
 * `site.prefix`) and fall back to the default locale. Used for `<html lang>` +
 * the translated copy.
 */
export async function maintenanceLocale(): Promise<Locale> {
  const cookie = (await cookies()).get(localeCookieName)?.value ?? "";
  return isLocale(cookie, localeCodes) ? cookie : defaultLocale;
}
