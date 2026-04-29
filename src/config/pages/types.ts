/**
 * Per-page configuration types.
 *
 * Each route exports a `PageConfig` from its `page.config.ts` (co-located with
 * `page.tsx` under `src/app/[locale]/<segment>/`). The barrel in ./index.ts
 * aggregates them to drive routing, metadata, sitemap, and rendering.
 */

import type { Robots } from "next/dist/lib/metadata/types/metadata-types";
import type { ModuleKey } from "@/config/features.config";
import type { Locale } from "@/config/locales.config";
import type { AppPathname, StaticAppPathname } from "@/config/routes.types";
import type { LayoutName } from "@/components/layouts/registry";
import type { MessageKey } from "@/types/messages";
import type { JsonLdObject } from "@/lib/seo/jsonld";

export type LocalizedSlug = string | Partial<Record<Locale, string>>;

/**
 * Canonical override. Three forms:
 *   - unset → auto-built from `siteConfig.url` + localized pathname
 *   - `StaticAppPathname` → resolved via next-intl to the locale's URL
 *   - absolute URL (starts with `http`) → used verbatim
 */
export type CanonicalOverride = StaticAppPathname | `http${string}`;

/**
 * Known OG image sources. Either the generated route `/opengraph-image`
 * (the default), a file in /public, or any absolute URL.
 */
export type OgImageUrl = "/opengraph-image" | `/${string}` | `http${string}`;

export type PageSeo = {
  /**
   * i18n key for the <title>. Optional at the per-route level — the
   * template's `<name>Defaults.seo.titleKey` provides the default, and
   * routes only declare this when overriding the title for one page.
   */
  titleKey?: MessageKey;
  /** i18n key for <meta name="description">. */
  descriptionKey?: MessageKey;
  /** Explicit keywords for <meta name="keywords">. */
  keywords?: readonly string[];
  /**
   * Override for <link rel="canonical">. Accepts either a StaticAppPathname
   * (resolved per-locale) or an absolute URL. Unset = auto-generated.
   */
  canonical?: CanonicalOverride;
  /** Convenience: equivalent to `robots: { index: false, follow: false }`. */
  noindex?: boolean;
  /** Full robots override — overrides `noindex`. */
  robots?: Robots;
  openGraph?: {
    type?: "website" | "article" | "profile";
    /** Defaults to `/opengraph-image`. Accepts /public paths or absolute URLs. */
    imageUrl?: OgImageUrl;
  };
  /**
   * JSON-LD blocks to inject into this page's <head>. Each entry is a plain
   * schema.org object (no `@context` needed — `buildPageJsonLdGraph` wraps
   * them into a single `@graph`). The dedicated schema factories in
   * `@/lib/seo/jsonld` produce valid entries for Organization, WebSite,
   * BreadcrumbList, etc.
   */
  structuredData?: readonly JsonLdObject[];
};

export type PageConfig = {
  /** Internal pathname key — must appear in `AppPathname`. */
  key: AppPathname;
  /**
   * Translation bucket id. Messages under `src/app/[locale]/<segment>/messages/`
   * are merged into `pages.<id>.*` at request time. Should match the route folder.
   */
  id: string;
  /** Localized URL segment(s). A plain string applies to every locale. */
  slugs: LocalizedSlug;
  /** Set to `false` to 404 the route. Defaults true. */
  enabled?: boolean;
  /**
   * Attach the page to one or more module flags in `features.modules.*`.
   * When ANY listed module is disabled, the page returns 404.
   *
   * `moduleKey` (singular) is the common case; `moduleKeys` (array) lets
   * a page depend on multiple feature groups simultaneously.
   */
  moduleKey?: ModuleKey;
  moduleKeys?: readonly ModuleKey[];
  /**
   * In-page chrome wrapper. Defaults to "default". Accepts either a literal
   * layout name or a function that picks a layout at render time from the
   * request locale (and any other inputs we care to thread through later).
   */
  layout?: LayoutName | ((ctx: { locale: Locale }) => LayoutName);
  /**
   * Per-page SEO. Optional because page-templates ship their own SEO
   * defaults via `<name>Defaults.seo` — routes typically import the
   * template defaults and pass them here, so this field acts as the merge
   * point: route-supplied fields override template defaults.
   */
  seo?: PageSeo;
};

/**
 * Identity helper — returns the object typed as `PageConfig`. Widening (vs
 * generic `<T extends PageConfig>`) keeps optional fields like `enabled` /
 * `moduleKey` reachable to downstream code even when a page doesn't set them.
 */
export function definePage(config: PageConfig): PageConfig {
  return config;
}
