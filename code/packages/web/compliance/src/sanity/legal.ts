/**
 * Sanity-only legal re-acceptance read path. The `legalConsent` singleton holds
 * the banner copy; the effective VERSION is composed from the last-updated date of
 * each tracked legal page (privacy, terms, terms of sale) — the same recipe as the
 * cookie re-consent version (`./cookies`). No message fallback; on any fetch error
 * the fetcher returns the empty shape (never throws). Wrapped in React `cache()`.
 *
 * Cookies are handled separately by the cookie banner; the legal notice (imprint)
 * is informational and excluded.
 */

import { cache } from "react";
import {
  defaultLocale,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { legalAcceptanceQuery } from "./queries";

export type LegalAcceptance = {
  /** Effective version — bump of any tracked page's date re-shows the banner. */
  version: string;
  message?: string;
  reviewLabel?: string;
  acceptLabel?: string;
};

/**
 * Which tracked legal pages are enabled — the app injects its own `features.legal`
 * (this package is app-agnostic). A disabled page's date must not fold into the
 * effective version, since it 404s and can't be reached.
 */
export type LegalFlags = { privacy: boolean; terms: boolean; sales: boolean };

type RawLocaleString = Record<string, string | null> | null;

const EMPTY: LegalAcceptance = { version: "" };

function localized(value: RawLocaleString, locale: Locale): string {
  return value?.[locale] ?? value?.[defaultLocale] ?? "";
}

export const getLegalAcceptance = cache(
  async (locale: Locale, flags: LegalFlags): Promise<LegalAcceptance> => {
    try {
      const data = await client.fetch(legalAcceptanceQuery);
      const banner = data?.copy?.banner ?? null;
      // Effective version = optional manual bump + each ENABLED doc's last-updated
      // date. Any date change flips the string, so the banner re-shows for everyone.
      // Gate each on the app's `features.legal.*` flag — a disabled page (e.g. CGV
      // when `sales` is off) 404s, so its date must not trigger a re-accept for a
      // page the visitor can't reach. Cookies + legal notice are handled elsewhere.
      const version = [
        data?.copy?.version,
        flags.privacy && data?.privacy,
        flags.terms && data?.terms,
        flags.sales && data?.sales,
      ]
        .filter(Boolean)
        .join("·");
      return {
        version,
        message: localized(banner?.message ?? null, locale) || undefined,
        reviewLabel:
          localized(banner?.reviewLabel ?? null, locale) || undefined,
        acceptLabel:
          localized(banner?.acceptLabel ?? null, locale) || undefined,
      };
    } catch {
      return EMPTY;
    }
  },
);
