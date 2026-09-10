/**
 * The **generic page-config contract** — the shape any app's route entries conform
 * to, shared so modules (blog route-gate, llms) can take a `PageConfig` without
 * knowing a specific app's routes. The **route data itself** (the `pages` map + the
 * app's `StaticAppPathname` union) is app-owned and lives in `apps/<app>/src/config`.
 *
 * SEO CONTENT (title, description, keywords, OG card) is edited per locale in Sanity
 * (`siteMeta.<locale>.pageSeo[pageId]`) — the sole source, no config/messages
 * fallback. A page entry carries only STRUCTURAL routing: `key` / `id` / `slug`
 * (route identity) + `enabled` (feature-gate a route on/off).
 */

import type { Locale } from "../shared/types";

/**
 * Robots meta directives — a local, structural mirror of Next's `Robots` type
 * (the OBJECT form; the raw-string variant lives on Next's `Metadata["robots"]`,
 * not here). Keeps this shared package at ZERO `next` coupling so services +
 * mobile consumes `@indiecrafts/packages-shared-config` freely. Assignable to Next's
 * `Metadata["robots"]` at the app boundary. Sync the field set with next if it expands.
 */
export interface Robots {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;
  notranslate?: boolean;
  indexifembedded?: boolean;
  nositelinkssearchbox?: boolean;
  unavailable_after?: string;
  "max-video-preview"?: number | string;
  "max-image-preview"?: "none" | "standard" | "large";
  "max-snippet"?: number;
  googleBot?: string | Omit<Robots, "googleBot">;
}

export type RouteSlug = string | Partial<Record<Locale, string>>;
/** A canonical override — an app pathname (`/...`) or an absolute URL. */
export type CanonicalOverride = `/${string}` | `http${string}`;
export type OgImageUrl = "/opengraph-image" | `/${string}` | `http${string}`;

export type PageSeo = {
  titleKey?: string;
  descriptionKey?: string;
  /**
   * Override the message key for keywords. Defaults to `pages.<id>.keywords`
   * — a comma-separated, translated string in `messages/<locale>.json`
   * (leave the key out entirely to emit no `<meta keywords>`).
   */
  keywordsKey?: string;
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
   * Route pathname key. In an app this is the app's `StaticAppPathname` literal
   * union (its `pages` map is `satisfies Record<string, PageConfig>` re-tightened
   * to that union); the shared contract keeps it a `string` so modules stay
   * app-agnostic. Dynamic routes (`/blog/[slug]`, …) don't live in the `pages`
   * map — they're declared in the app's `src/app/routes.ts:DYNAMIC_PATHNAMES`.
   */
  key: string;
  id: string;
  slug: RouteSlug;
  /** `false` returns 404 site-wide. Defaults true. */
  enabled?: boolean;
  seo?: PageSeo;
};

/** A page is visible unless it explicitly opts out. */
export function isPageVisible(input: PageConfig): boolean {
  return input.enabled !== false;
}
