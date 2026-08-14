/**
 * Per-route metadata + the routing types. SEO CONTENT (title, description, keywords,
 * OG card) is edited per locale in Sanity (`siteMeta.<locale>.pageSeo[pageId]`) — the
 * sole source, no config/messages fallback. This map carries only STRUCTURAL routing:
 * `key` / `id` / `slug` (route identity) + `enabled` (feature-gate a route on/off).
 */

import type { Robots } from "next/dist/lib/metadata/types/metadata-types";
import type { Locale } from "./types";
import { features } from "./features";

// ── Routes ───────────────────────────────────────────────────

/**
 * Every static route the `pages` map can hold. Single source of truth — adding a
 * static route means appending one literal here AND a matching `pages` entry.
 * Dynamic routes (`/blog/[slug]`, …) live in `src/app/routes.ts:DYNAMIC_PATHNAMES`.
 * Module-internal — the `StaticAppPathname` union derived from it is the public type.
 */
const STATIC_PATHNAME_KEYS = [
  "/",
  "/legal-notice",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/terms-of-sale",
  "/blog",
  "/blog/category",
  "/blog/tag",
  "/author",
  "/waitlist",
] as const;

export type StaticAppPathname = (typeof STATIC_PATHNAME_KEYS)[number];

// ── Page config types ────────────────────────────────────────

export type RouteSlug = string | Partial<Record<Locale, string>>;
export type CanonicalOverride = StaticAppPathname | `http${string}`;
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

/** A page is visible unless it explicitly opts out. */
export function isPageVisible(input: PageConfig): boolean {
  return input.enabled !== false;
}

// ── The pages map ────────────────────────────────────────────

export const pages = {
  home: {
    key: "/",
    id: "home",
    slug: "/",
  },
  // Waitlist landing — the `module.waitlist` form on a full page. Content in
  // Sanity (`waitlistSettings`), SEO in `siteMeta.pageSeo`. Gated by the flag.
  waitlist: {
    key: "/waitlist",
    id: "waitlist",
    slug: "/waitlist",
    enabled: features.waitlist,
  },
  // Legal pages — content in Sanity (`legalPage` docs), SEO in `pageSeo`.
  // Per-locale slugs (French primary). Each gated by its `features.legal.*` flag.
  legalNotice: {
    key: "/legal-notice",
    id: "legal-notice",
    slug: { en: "/legal-notice", fr: "/mentions-legales" },
    enabled: features.legal.notice,
  },
  privacy: {
    key: "/privacy-policy",
    id: "privacy",
    slug: { en: "/privacy-policy", fr: "/politique-de-confidentialite" },
    enabled: features.legal.privacy,
  },
  cookies: {
    key: "/cookie-policy",
    id: "cookies",
    slug: { en: "/cookie-policy", fr: "/politique-de-cookies" },
    enabled: features.legal.cookies,
  },
  terms: {
    key: "/terms",
    id: "terms",
    slug: { en: "/terms", fr: "/conditions-generales-utilisation" },
    enabled: features.legal.terms,
  },
  termsOfSale: {
    key: "/terms-of-sale",
    id: "terms-of-sale",
    slug: { en: "/terms-of-sale", fr: "/conditions-generales-de-vente" },
    enabled: features.legal.sales,
  },
  blog: {
    key: "/blog",
    id: "blog",
    slug: "/blog",
    // Mirrors `features.blog` — sitemap + llms.txt + routing all gate off this.
    enabled: features.blog,
  },
  author: {
    key: "/author",
    id: "author",
    slug: "/author",
    enabled: features.blog && features.blogTaxonomy.authors,
  },
  category: {
    key: "/blog/category",
    id: "category",
    slug: "/blog/category",
    enabled: features.blog && features.blogTaxonomy.categories,
  },
  tag: {
    key: "/blog/tag",
    id: "tag",
    slug: "/blog/tag",
    enabled: features.blog && features.blogTaxonomy.tags,
  },
} as const satisfies Record<string, PageConfig>;
