/**
 * Sanity-only cookie-consent read path. The `cookieConsent` singleton is the SOLE
 * runtime source for the banner copy, consent categories, and cookie inventory —
 * no config fallback. On any fetch error the fetcher returns the empty shape
 * (never throws). Wrapped in React `cache()`.
 *
 * `localeString`s resolve to `value[locale] ?? value[defaultLocale] ?? ""`.
 */

import { cache } from "react";
import { defaultLocale, type Locale } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";
import { cookieConsentQuery, cookiePolicyVersionQuery } from "./queries";
import {
  CONSENT_SIGNALS,
  type ConsentSignal,
  type CookieConsent,
} from "../consent-signals";

// Pure constants + types live in `./consent-signals` (client-safe); re-export so
// existing `@/lib/cookies` importers keep working.
export * from "../consent-signals";

const EMPTY: CookieConsent = { version: "", banner: {}, categories: [], cookies: [] };

type RawLocaleString = Record<string, string | null> | null;
type RawCategory = {
  key?: string | null;
  title?: RawLocaleString;
  description?: RawLocaleString;
  required?: boolean | null;
  consentSignals?: string[] | null;
};
type RawCookie = {
  name?: string | null;
  provider?: string | null;
  categoryKey?: string | null;
  purpose?: RawLocaleString;
  duration?: string | null;
  party?: string | null;
};

function localized(value: RawLocaleString, locale: Locale): string {
  return value?.[locale] ?? value?.[defaultLocale] ?? "";
}
function isSignal(s: string): s is ConsentSignal {
  return (CONSENT_SIGNALS as readonly string[]).includes(s);
}

export const getCookieConsent = cache(async (locale: Locale): Promise<CookieConsent> => {
  try {
    const [data, policyDate] = await Promise.all([
      client.fetch(cookieConsentQuery),
      client.fetch(cookiePolicyVersionQuery),
    ]);
    if (!data) return EMPTY;
    return {
      // Effective version = manual `cookieConsent.version` + the cookie-policy's
      // last-updated date, so editing the policy re-prompts every visitor (C).
      version: [data.version, policyDate].filter(Boolean).join("·"),
      banner: {
        title: localized(data.banner?.title ?? null, locale) || undefined,
        body: localized(data.banner?.body ?? null, locale) || undefined,
      },
      categories: ((data.categories ?? []) as RawCategory[])
        .filter((c) => Boolean(c.key))
        .map((c) => ({
          key: c.key as string,
          title: localized(c.title ?? null, locale) || (c.key as string),
          description: localized(c.description ?? null, locale) || undefined,
          required: c.required === true,
          signals: (c.consentSignals ?? []).filter(isSignal),
        })),
      cookies: ((data.cookies ?? []) as RawCookie[])
        .filter((c) => Boolean(c.name && c.categoryKey))
        .map((c) => ({
          name: c.name as string,
          provider: c.provider ?? undefined,
          category: c.categoryKey as string,
          purpose: localized(c.purpose ?? null, locale) || undefined,
          duration: c.duration ?? undefined,
          party: (c.party as "first" | "third") ?? undefined,
        })),
    };
  } catch {
    return EMPTY;
  }
});
