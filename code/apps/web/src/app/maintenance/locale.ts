import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCodes, type Locale } from "@/config";

/**
 * Best-effort locale for the standalone `/maintenance` route. It lives
 * outside the `[locale]` segment (the proxy rewrites here before next-intl
 * runs), so we read next-intl's `NEXT_LOCALE` cookie and fall back to the
 * default locale. Used for `<html lang>` + the translated copy.
 */
export async function maintenanceLocale(): Promise<Locale> {
  const cookie = (await cookies()).get("NEXT_LOCALE")?.value ?? "";
  return isLocale(cookie, localeCodes) ? cookie : defaultLocale;
}
