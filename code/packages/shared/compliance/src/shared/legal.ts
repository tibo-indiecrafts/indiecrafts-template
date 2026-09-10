/**
 * The legal-route contract — one source of truth for the canonical legal pages, so
 * a shell (Expo · the `app` web surface) can link OUT to the website's
 * legal pages, and the website's own `pages.ts` reads the same slugs. Plus the legal
 * re-acceptance shape (`LegalAcceptanceRecord` + `needsReacceptance`), used by every
 * shell over its own store adapter.
 *
 * No re-hosting: the shells open these URLs on the website (`legalUrl`), where the
 * content stays Sanity-driven.
 */

import {
  defaultLocale,
  localizedPathname,
  type Locale,
} from "@indiecrafts/packages-shared-config/shared";

/**
 * The compliance routes — the 5 legal pages + the GDPR data-request form — with
 * their per-locale slugs (French primary). `as const` so the literal `key`/`id`/`slug`
 * survive being spread into the website's `pages` map (which derives its typed route
 * union from the literal `key`s).
 */
export const LEGAL_PAGES = {
  legalNotice: {
    key: "/legal-notice",
    id: "legal-notice",
    slug: { en: "/legal-notice", fr: "/mentions-legales" },
  },
  privacy: {
    key: "/privacy-policy",
    id: "privacy",
    slug: { en: "/privacy-policy", fr: "/politique-de-confidentialite" },
  },
  cookies: {
    key: "/cookie-policy",
    id: "cookies",
    slug: { en: "/cookie-policy", fr: "/politique-de-cookies" },
  },
  terms: {
    key: "/terms",
    id: "terms",
    slug: { en: "/terms", fr: "/conditions-generales-utilisation" },
  },
  termsOfSale: {
    key: "/terms-of-sale",
    id: "terms-of-sale",
    slug: { en: "/terms-of-sale", fr: "/conditions-generales-de-vente" },
  },
  dataRequest: {
    key: "/data-request",
    id: "data-request",
    slug: { en: "/data-request", fr: "/exercer-mes-droits" },
  },
} as const;

export type LegalPageKey = keyof typeof LEGAL_PAGES;

/** The 5 legal pages (excludes the data-request form) — the usual link-out list. */
export const LEGAL_PAGE_KEYS = [
  "legalNotice",
  "privacy",
  "cookies",
  "terms",
  "termsOfSale",
] as const satisfies readonly LegalPageKey[];

/**
 * The absolute URL of a legal page on the website. `baseUrl` is the marketing site
 * origin (`site.websiteUrl`); the per-locale slug + `localizedPathname` mirror the
 * website's `as-needed` prefix policy (default locale unprefixed, others `/<code>`),
 * so the URL matches the live route. Falls back to the default-locale slug for a
 * locale that has no legal slug yet.
 */
export function legalUrl(
  baseUrl: string,
  key: LegalPageKey,
  locale: Locale,
): string {
  const slug = LEGAL_PAGES[key].slug as Partial<Record<Locale, `/${string}`>>;
  const path = slug[locale] ?? slug[defaultLocale] ?? "/";
  return `${baseUrl.replace(/\/+$/, "")}${localizedPathname(path, locale)}`;
}

/** A shell's record of the legal-policy version the visitor accepted, and when. */
export type LegalAcceptanceRecord = {
  version: string;
  t: number;
};

/** The injected copy for the re-acceptance prompt — resolved per shell from `messages`. */
export type LegalReacceptanceCopy = {
  title: string;
  body: string;
  reviewLabel: string;
  acceptLabel: string;
};

/**
 * True when the visitor must (re-)accept the legal policies — no prior acceptance,
 * or the current policy `version` moved past what they acked. `current` is the
 * website's live policy version (`getConsentPolicyVersion`).
 */
export function needsReacceptance(
  acked: LegalAcceptanceRecord | null,
  current: string,
): boolean {
  return !acked || acked.version !== current;
}
