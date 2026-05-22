/**
 * SITE CONFIGURATION — pure data, single source of truth.
 *
 * No functions, no env vars, no logic. Edit values directly. Types and
 * helpers live in `./types.ts` and re-export from this file for ergonomic
 * `import { ... } from "@/config"` access.
 *
 * Sections in order:
 *   1. site          — brand, contact, social, legal, image surfaces
 *   2. theme         — color tokens, fonts, radii, container widths
 *   3. locales       — supported languages (+ derived lookup maps)
 *   4. features      — global feature flags (only what's wired in code)
 *   5. navigation    — header + footer nav structure
 *   6. seoDefaults   — site-wide head defaults (per-page overrides via `pages.*.seo`)
 *   7. llms          — /llms.txt structure
 *   8. pages         — per-route metadata (key, slug, SEO)
 */

import type { Locale, NavGroup, NavLink, PageConfig } from "./types";

// `@/config` is the single import for everyone — re-export from sibling types
export type {
  Locale,
  PageConfig,
  PageSeo,
  AppPathname,
  StaticAppPathname,
  DynamicAppPathname,
  RouteSlug,
  CanonicalOverride,
  OgImageUrl,
  NavLink,
  NavGroup,
  Environment,
} from "./types";
export {
  isLocale,
  isPageVisible,
  getCurrentEnvironment,
  getCSPConnectSources,
} from "./types";

/** Sentinel for an unconfigured site — drives `isSiteConfigured`. */
export const PLACEHOLDER_SITE_URL = "https://example.com";

// 1. ─── site ─────────────────────────────────────────────────

export const site = {
  name: "indiecrafts.dev",
  tagline: "The config-first Next.js template for client websites.",
  description:
    "A highly modular, SEO-ready, i18n-ready, accessibility-first Next.js template. Fork it, edit the config, ship.",
  /** Replace with the production origin before deploying. */
  url: PLACEHOLDER_SITE_URL,
  /** UI logo (SVG preferred for crispness at any size). */
  logo: "/logo.svg",
  /** Raster logo for schema.org Organization (Google rejects SVG). */
  brandLogoPng: "/brand/logo.png",
  /** Favicon dispatch — what `/icon` and `/apple-icon` serve. */
  icon: {
    mode: "file",
    file: "/logo.svg",
    contentType: "image/svg+xml",
    appleFile: "/brand/apple-icon.png",
    appleContentType: "image/png",
  },
  /** Open Graph card dispatch — what `/opengraph-image` serves. */
  ogImage: {
    mode: "file",
    file: "/brand/og.png",
    contentType: "image/png",
  },
  faviconEmoji: "🪡",
  contact: {
    email: "hello@example.com",
  },
  /**
   * Social handles / profile URLs. Listed here once and re-used by:
   *   - schema.org `Organization.sameAs` (filtered non-empty values)
   *   - `twitter:site` / `twitter:creator` (the `twitter` handle, with `@`)
   *   - Footer / header social icons
   * Empty strings are omitted from every consumer.
   */
  social: {
    /** Twitter / X handle WITH the `@` prefix, e.g. "@indiecrafts". */
    twitter: "",
    github: "",
    linkedin: "",
    instagram: "",
    mastodon: "",
  },
  legal: {
    company: "Indiecrafts",
    /** ISO date or just year — fed to schema.org `foundingDate`. Empty = omitted. */
    foundingDate: "",
    /**
     * Postal address (schema.org PostalAddress). Fill in for B2B / Local
     * Business / agency sites — Google uses this for the Knowledge Panel.
     * Leave fields empty to omit the whole `address` block from JSON-LD.
     */
    address: {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "",
    },
    /**
     * Primary contact point (schema.org ContactPoint). Same gating: when
     * the whole object is empty, it's omitted from JSON-LD.
     */
    contactPoint: {
      telephone: "",
      email: "",
      contactType: "customer service",
    },
  },
} as const;

/**
 * Extra site-wide JSON-LD beyond Organization + WebSite (always emitted).
 * Each entry needs `"@type"`. The layout wraps them all into a single
 * `@graph` script so Google sees one connected entity graph.
 *
 * Common patterns to copy-paste below:
 *
 * ─ Multi-location agency ────────────────────────────────────
 *   {
 *     "@type": "LocalBusiness",
 *     "@id": `${site.url}#paris-office`,
 *     name: "Acme Paris",
 *     address: { "@type": "PostalAddress", streetAddress: "…", … },
 *     telephone: "+33-1-…",
 *     openingHoursSpecification: ["Mo-Fr 09:00-18:00"],
 *   }
 *
 * ─ Service catalog (B2B agencies) ───────────────────────────
 *   buildServiceSchema({
 *     name: "Brand Identity Design",
 *     description: "Logo, type, and brand system.",
 *     serviceType: "Design",
 *     areaServed: "Worldwide",
 *     offers: { price: "5000", priceCurrency: "USD" },
 *   })
 *
 * ─ Product (SaaS / packaged offering) ───────────────────────
 *   buildProductSchema({
 *     name: "Indiecrafts Template Pro",
 *     description: "Full template + 1 year of updates.",
 *     sku: "ICT-PRO-001",
 *     offers: {
 *       price: "299",
 *       priceCurrency: "USD",
 *       availability: "InStock",
 *     },
 *     aggregateRating: { ratingValue: 4.9, reviewCount: 42 },
 *   })
 *
 * ─ Physical product (e-commerce) ────────────────────────────
 *   buildProductSchema({
 *     name: "Hand-stitched Leather Notebook",
 *     description: "A5, vegetable-tanned leather cover, 192 pages.",
 *     sku: "NB-LTH-A5-001",
 *     image: `${site.url}/products/notebook-a5.jpg`,
 *     brand: "Indiecrafts",
 *     offers: {
 *       price: "48.00",
 *       priceCurrency: "EUR",
 *       availability: "InStock",
 *       url: `${site.url}/shop/leather-notebook`,
 *     },
 *     aggregateRating: { ratingValue: 4.8, reviewCount: 127 },
 *   })
 *
 * ─ Catalog (collection page) — use page.seo.structuredData ──
 *   {
 *     "@type": "ItemList",
 *     name: "Shop",
 *     itemListElement: [
 *       { "@type": "ListItem", position: 1, item: { "@id": `${site.url}#notebook` } },
 *       { "@type": "ListItem", position: 2, item: { "@id": `${site.url}#pen` } },
 *     ],
 *   }
 *
 * ─ FAQ (per-page, highest-ROI rich result) ──────────────────
 *   // In pages.<id>.seo.structuredData:
 *   buildFAQPageSchema([
 *     {
 *       question: "How does pricing work?",
 *       answer: "Free for personal projects; team plans start at $29/mo.",
 *     },
 *     {
 *       question: "Can I cancel anytime?",
 *       answer: "Yes — cancellation is one click, prorated to the day.",
 *     },
 *   ])
 *   // Google shows the Q&A directly under your search result.
 *
 * Factories live in `@/lib/seo/jsonld` — using them keeps `@id`s consistent
 * (Service.provider / Product.brand link back to the Organization).
 */
export const globalSchemas: readonly Record<string, unknown>[] = [];

/** `true` once `site.url` has been pointed at a real origin. */
export const isSiteConfigured = site.url !== PLACEHOLDER_SITE_URL;

// 2. ─── theme ────────────────────────────────────────────────

export const theme = {
  /** Hex mirrors of the oklch colors — required by next/og (Satori). */
  hexColors: {
    brand: "#4f69d9",
    brandForeground: "#ffffff",
    background: "#ffffff",
    foreground: "#171717",
  },
  /** Runtime CSS colors — mirrored in globals.css. */
  colors: {
    brand: "oklch(0.55 0.18 260)",
    brandForeground: "oklch(0.985 0 0)",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.84 0 0)",
    ring: "oklch(0.55 0.18 260)",
  },
  fonts: { sans: "var(--font-sans)", mono: "var(--font-mono)" },
  radii: { sm: "0.375rem", md: "0.5rem", lg: "0.75rem", xl: "1rem" },
  container: { maxWidth: "1280px", gutter: "1rem" },
} as const;

// 3. ─── locales ──────────────────────────────────────────────

export const locales = [
  { code: "en", label: "English", abbr: "EN", dir: "ltr" },
  { code: "fr", label: "Français", abbr: "FR", dir: "ltr" },
] as const;

export const defaultLocale = "en";

/** Just the codes — used in 5 places, worth the one-line derivation. */
export const localeCodes = locales.map((l) => l.code) as readonly Locale[];

// 4. ─── features ─────────────────────────────────────────────

export const features = {
  /** Enables `/llms.txt`. */
  llmsTxt: true,
  /** Shows the locale switcher in the header. */
  localeSwitcher: true,
} as const;

/**
 * Third-party tracking. Empty string = disabled (no script injected,
 * no `<meta>` tag, no network call).
 */
export const analytics = {
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". */
  googleAnalyticsId: "",
} as const;

// 5. ─── navigation ───────────────────────────────────────────

export const headerNav: readonly NavLink[] = [{ labelKey: "home", href: "/" }];
export const footerNav: readonly NavGroup[] = [];

// 6. ─── seoDefaults ──────────────────────────────────────────

export const seoDefaults = {
  /** Template for <title> — "%s" replaced by per-page title. */
  titleTemplate: `%s · ${site.name}`,
  /** Used when a page omits its own title. */
  defaultTitle: `${site.name} — ${site.tagline}`,
  /** Crawling defaults — per-page `seo.noindex` overrides. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  /**
   * Search-engine verification meta tags. Fill in the strings when the
   * provider gives you a verification code; empty strings are omitted from
   * the rendered `<head>`.
   */
  verification: {
    google: "",
    bing: "",
  },
} as const;

// 7. ─── llms ─────────────────────────────────────────────────

/**
 * llms.txt extras. Page entries are auto-derived from the `pages` map
 * below — no manual config needed per page. Use `resources` for external
 * links (GitHub, docs, status page) the LLM should know about.
 */
export const llms = {
  resources: [] as readonly { href: string; labelKey: string }[],
} as const;

// 8. ─── pages ────────────────────────────────────────────────

/**
 * Per-route metadata. The metadata builder auto-derives sensible defaults:
 *
 *   - title           → messages key `pages.<id>.title`
 *   - description     → messages key `pages.<id>.description`
 *   - og image        → `/brand/og-<id>.png` (place a file there per page)
 *   - canonical       → `${site.url}${slug}` (locale-aware)
 *   - robots          → `seoDefaults.robots` (override via `seo.noindex` etc.)
 *
 * So each page entry usually only needs `key`, `id`, `slug`, and
 * `seo.keywords`. Override anything by setting it in `seo`.
 */
export const pages = {
  home: {
    key: "/",
    id: "home",
    slug: "/",
    seo: {
      keywords: ["next.js template", "indiecrafts", "config-first", "modular website"],
    },
  },
} as const satisfies Record<string, PageConfig>;
