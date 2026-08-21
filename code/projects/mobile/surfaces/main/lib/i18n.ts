/**
 * Mobile i18n — the DETECT + FORMAT split. `expo-localization` reads the device
 * locale; `react-intl` formats. Locale vocabulary + the `flattenMessages` helper
 * come from `@/config` (shared); the 404/500 shell copy from `system-pages`
 * (`SHELL_COPY`, shared with the hybrid shell). This file owns only the DETECT
 * source + the app's own screen copy (`messages/*.json` → `home.*`).
 */
import { getLocales } from "expo-localization";
import {
  defaultLocale,
  flattenMessages,
  isLocale,
  localeCodes,
  STORAGE_KEYS,
  type Locale,
} from "@/config";
import { storage } from "@/lib/storage";
import { SHELL_COPY } from "@indiecrafts/packages-shared-system-pages/shared";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

const LOCAL: Record<string, Record<string, unknown>> = { en, fr };

/** The device locale, narrowed to a supported `Locale` (else `defaultLocale`). */
export function detectLocale(): Locale {
  const code = getLocales()[0]?.languageCode ?? defaultLocale;
  return isLocale(code, localeCodes) ? code : defaultLocale;
}

/** The visitor's stored locale choice, narrowed to a supported `Locale` (else `null`). */
export async function getStoredLocale(): Promise<Locale | null> {
  const v = await storage.get(STORAGE_KEYS.locale);
  return v && isLocale(v, localeCodes) ? v : null;
}

/** Persist the visitor's explicit locale choice (a language switch survives restart). */
export async function setStoredLocale(locale: Locale): Promise<void> {
  await storage.set(STORAGE_KEYS.locale, locale);
}

/** Shared shell copy + this app's screen copy, flattened for react-intl. */
export function messagesFor(locale: Locale): Record<string, string> {
  const l = LOCAL[locale] ?? LOCAL[defaultLocale];
  const shell = SHELL_COPY[locale] ?? SHELL_COPY[defaultLocale];
  return flattenMessages({ ...shell, ...l });
}
