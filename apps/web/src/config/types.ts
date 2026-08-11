/**
 * Config types + helpers. Everything that is NOT pure data lives here —
 * the matching data is in `./index.ts`.
 *
 * Three things to know:
 *  - `Locale` is derived from the `locales` data in `./index.ts` via a
 *    type-only import (no runtime cycle since the import is erased).
 *  - Adding a new route: extend `AppPathname` below.
 *  - Adding a new locale: append a row to `locales` in `./index.ts`; the
 *    `Locale` union here updates automatically.
 */

import type { Robots } from "next/dist/lib/metadata/types/metadata-types";
import type { MessageKey } from "@/types/messages";
import type globalEn from "../../messages/en.json";
import type { i18n } from "./index";

// ── Locales ──────────────────────────────────────────────────

/** One registered language (a row in `i18n.locales`). */
export type LocaleConfig = {
  /** BCP-47 code. Doubles as the URL prefix for non-default locales (`/fr/…`). */
  code: string;
  /** Native language name — shown in the locale-switcher menu. */
  label: string;
  /** Short badge (2 letters) — shown on the switcher trigger. */
  abbr: string;
  /** Text direction. Drives `<html dir>`; set `"rtl"` for Arabic/Hebrew/etc. */
  dir: "ltr" | "rtl";
};

/** Union of registered locale codes — derived from the `i18n.locales` data. */
export type Locale = (typeof i18n.locales)[number]["code"];

// ── Theme ────────────────────────────────────────────────────

/** A concrete, paintable theme. */
export type ThemeName = "light" | "dark";

/** A theme option offered in the toggle — concrete themes plus "system". */
export type ThemeMode = ThemeName | "system";

// ── Fonts ────────────────────────────────────────────────────

/**
 * Registry keys for the fonts wired up in `@/lib/fonts`. `next/font` needs
 * its loader calls to be static literals, so fonts are registered there and
 * `config.fonts` selects among them by key. Adding a font = one key here +
 * one `next/font` call in the registry.
 */
export type FontKey = "geist" | "geist-mono" | "satoshi";

/** The active pairing — one registered font per role. */
export type FontRoles = {
  /** Headings. Drives `--font-display`; set equal to `body` for one face. */
  display: FontKey;
  /** Body + UI default. Drives `--font-sans`. */
  body: FontKey;
  /** Code / tabular figures. Drives `--font-mono`. */
  mono: FontKey;
};

// ── Structured data ──────────────────────────────────────────

/**
 * schema.org type emitted for the site's business entity (`site.legal.businessType`).
 * `"Organization"` is the neutral default. Every other value is a LocalBusiness
 * subtype — it emits the richer local-business schema (geo, opening hours, price
 * range, areaServed) from `site.legal`. Pick the closest match for the client.
 */
export type BusinessType =
  | "Organization"
  | "LocalBusiness"
  | "ProfessionalService"
  | "HomeAndConstructionBusiness"
  | "LegalService"
  | "MedicalBusiness"
  | "FinancialService"
  | "Store"
  | "Restaurant"
  | "FoodEstablishment";

// ── Routes ───────────────────────────────────────────────────

/**
 * Every static route the `pages` map can hold. Single source of truth —
 * adding a new static route means appending one literal here AND adding
 * the matching entry under `pages` in `./index.ts`.
 *
 * Dynamic routes (`/blog/[slug]`, etc.) live in
 * `src/app/routes.ts:DYNAMIC_PATHNAMES`. They don't appear in the
 * `pages` map (one entry per URL pattern, not per content item).
 */
export const STATIC_PATHNAME_KEYS = [
  "/",
  "/legal",
  "/blog",
  "/blog/category",
  "/blog/tag",
  "/author",
] as const;

export type StaticAppPathname = (typeof STATIC_PATHNAME_KEYS)[number];

// ── Page config ──────────────────────────────────────────────

export type RouteSlug = string | Partial<Record<Locale, string>>;
export type CanonicalOverride = StaticAppPathname | `http${string}`;
export type OgImageUrl = "/opengraph-image" | `/${string}` | `http${string}`;

export type PageSeo = {
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /**
   * Override the message key for keywords. Defaults to `pages.<id>.keywords`
   * — a comma-separated, translated string in `messages/<locale>.json`
   * (leave the key out entirely to emit no `<meta keywords>`).
   */
  keywordsKey?: MessageKey;
  canonical?: CanonicalOverride;
  /** Convenience for `robots: { index: false, follow: false }`. */
  noindex?: boolean;
  /** Full robots override — overrides `noindex`. */
  robots?: Robots;
  /**
   * Include this page in the LLM endpoints (`/llms.txt`, `/llms-full.txt`,
   * `/llms/<id>`). Defaults to `true`. Automatically forced off for
   * `noindex` pages, so you only set `llms: false` to exclude a page from AI
   * assistants while keeping it indexed by search engines.
   */
  llms?: boolean;
  openGraph?: {
    type?: "website" | "article" | "profile";
    imageUrl?: OgImageUrl;
  };
  /**
   * Override the image(s) Google may show next to this page's search result
   * (the WebPage JSON-LD `image`). A single path/URL or an array. Falls back
   * to `seoDefaults.schemaImage`, then the page's OG image.
   */
  schemaImage?: string | readonly string[];
  /**
   * Per-page JSON-LD blocks. Each entry needs `"@type"`. Rendered into the
   * page <head> by `<PageSchemas page={pageConfig} />` (imported from
   * `@/lib/seo/jsonld`). Use the `build*Schema(...)` factories where
   * possible — they fill `@id` + `@type` correctly.
   */
  structuredData?: readonly Record<string, unknown>[];
};

export type PageConfig = {
  /**
   * Pathname union for static routes only. Dynamic routes
   * (`/blog/[slug]`, `/blog/category/[slug]`, etc.) don't live in the
   * `pages` map — they're declared separately in
   * `src/app/routes.ts:DYNAMIC_PATHNAMES`.
   */
  key: StaticAppPathname;
  id: string;
  slug: RouteSlug;
  /** `false` returns 404 site-wide. Defaults true. */
  enabled?: boolean;
  seo?: PageSeo;
};

// ── Navigation ───────────────────────────────────────────────

type NavLabelKey = keyof typeof globalEn.nav;

export type NavLink = {
  labelKey: NavLabelKey;
  href: StaticAppPathname;
  /** When set, link points to an external URL instead of `href`. */
  external?: string;
};

export type NavGroup = {
  labelKey: NavLabelKey;
  links: NavLink[];
};

// ── Environment ──────────────────────────────────────────────

export type Environment = "development" | "test" | "staging" | "production";

// ── Helpers ──────────────────────────────────────────────────

/**
 * Locale type-guard. Pass the registered `localeCodes` (from `./index`).
 *
 *   import { isLocale, localeCodes } from "@/config";
 *   if (isLocale(input, localeCodes)) { … }
 */
export function isLocale<L extends string>(
  value: string,
  supported: readonly L[],
): value is L {
  return (supported as readonly string[]).includes(value);
}

export function isPageVisible(input: PageConfig): boolean {
  return input.enabled !== false;
}

export function getCurrentEnvironment(): Environment {
  const explicit = process.env.NEXT_PUBLIC_ENVIRONMENT;
  if (explicit === "staging") return "staging";
  if (explicit === "test") return "test";
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
}

export function getCSPConnectSources(env: Environment): readonly string[] {
  // Sanity Studio at /studio needs to reach the project API + CDN.
  // Safe to leave in prod CSP: the wildcard is locked to *.sanity.io.
  //
  // `registry.npmjs.org` — the embedded Studio polls npm for its own
  // package version ("you're running an outdated Studio" check). Not
  // critical, but without this entry the dev console fills with
  // `TypeError: Failed to fetch` from CSP blocking the request.
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const npm = ["https://registry.npmjs.org"];
  const common = ["'self'", ...sanity, ...npm];
  if (env === "development" || env === "test") {
    return [...common, "ws://localhost:*", "http://localhost:*", "https://*.vercel.app"];
  }
  return common;
}
