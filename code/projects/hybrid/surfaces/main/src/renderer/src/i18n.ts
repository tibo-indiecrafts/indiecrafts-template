/**
 * Renderer i18n — DETECT (a stored choice, else `navigator.language`) + FORMAT
 * (`react-intl`). Locale vocabulary + `flattenMessages` from `@/config`; the 404/500
 * shell copy from `system-pages` (`SHELL_COPY`, shared with the mobile shell). This
 * file owns the DETECT source, the persisted locale choice, and the renderer's own copy
 * (`messages/*.json` → `app.*`, `consent.*`, `legal.*`, `version.*`, `locale.*`).
 */
import {
  defaultLocale,
  flattenMessages,
  isLocale,
  localeCodes,
  sitePrefix,
  type Locale,
} from "../../config";
import { SHELL_COPY } from "@indiecrafts/packages-shared-system-pages/shared";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

const LOCAL: Record<string, Record<string, unknown>> = { en, fr };

/** `localStorage` key for the visitor's explicit locale choice, namespaced per deployment. */
const LOCALE_KEY = `${sitePrefix}.locale`;

/** The visitor's stored locale choice, narrowed to a supported `Locale` (else `null`). */
export function storedLocale(): Locale | null {
  try {
    const v = localStorage.getItem(LOCALE_KEY);
    return v && isLocale(v, localeCodes) ? v : null;
  } catch {
    return null;
  }
}

/** Persist the visitor's explicit locale choice (a language switch survives restart). */
export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Storage disabled — the choice just won't persist; not fatal.
  }
}

/** The active locale — a stored choice wins, else the OS locale, else the default. */
export function detectLocale(): Locale {
  const stored = storedLocale();
  if (stored) return stored;
  const code = navigator.language?.split("-")[0] ?? defaultLocale;
  return isLocale(code, localeCodes) ? code : defaultLocale;
}

/** Shared shell copy + this renderer's own copy, flattened for react-intl. */
export function messagesFor(locale: Locale): Record<string, string> {
  const l = LOCAL[locale] ?? LOCAL[defaultLocale];
  const shell = SHELL_COPY[locale] ?? SHELL_COPY[defaultLocale];
  return flattenMessages({ ...shell, ...l });
}
