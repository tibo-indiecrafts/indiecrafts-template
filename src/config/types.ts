/**
 * Config types + helpers. Everything that is NOT pure data lives here —
 * the matching data is in `./index.ts`.
 *
 * Three things to know:
 *  - `Locale` is derived from the `locales` data via type-only import (no
 *    runtime cycle since the import is erased).
 *  - Adding a new route: extend `AppPathname` below.
 *  - Adding a new locale: append a row to `locales` in `./index.ts`; the
 *    `Locale` union here updates automatically.
 */

import type { Robots } from "next/dist/lib/metadata/types/metadata-types";
import type { MessageKey } from "@/types/messages";
import type globalEn from "../../messages/en.json";
import type { locales } from "./index";

// ── Locales ──────────────────────────────────────────────────

export type Locale = (typeof locales)[number]["code"];

// ── Routes ───────────────────────────────────────────────────

export type StaticAppPathname = "/" | "/legal";
export type DynamicAppPathname = never;
export type AppPathname = StaticAppPathname | DynamicAppPathname;

// ── Page config ──────────────────────────────────────────────

export type RouteSlug = string | Partial<Record<Locale, string>>;
export type CanonicalOverride = StaticAppPathname | `http${string}`;
export type OgImageUrl = "/opengraph-image" | `/${string}` | `http${string}`;

export type PageSeo = {
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  keywords?: readonly string[];
  canonical?: CanonicalOverride;
  /** Convenience for `robots: { index: false, follow: false }`. */
  noindex?: boolean;
  /** Full robots override — overrides `noindex`. */
  robots?: Robots;
  openGraph?: {
    type?: "website" | "article" | "profile";
    imageUrl?: OgImageUrl;
  };
  /**
   * Per-page JSON-LD blocks. Each entry needs `"@type"`. Rendered into the
   * page <head> by `<PageSchemas page={pageConfig} />` (imported from
   * `@/lib/seo/jsonld`). Use the `build*Schema(...)` factories where
   * possible — they fill `@id` + `@type` correctly.
   */
  structuredData?: readonly Record<string, unknown>[];
};

export type PageConfig = {
  key: AppPathname;
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
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const common = ["'self'", ...sanity];
  if (env === "development" || env === "test") {
    return [...common, "ws://localhost:*", "http://localhost:*", "https://*.vercel.app"];
  }
  return common;
}
