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
export { STATIC_PATHNAME_KEYS } from "./types";
export type {
  Locale,
  PageConfig,
  PageSeo,
  StaticAppPathname,
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
  /**
   * Favicon — served at `/icon` and `/apple-icon` routes. Replace the
   * files in /public to rebrand; no code changes needed.
   */
  icon: {
    file: "/logo.svg",
    contentType: "image/svg+xml",
    /** iOS rejects SVG for apple-touch-icon; PNG fallback is required. */
    appleFile: "/brand/apple-icon.png",
    appleContentType: "image/png",
  },
  /** Site-wide Open Graph card — served at `/opengraph-image`. */
  ogImage: {
    file: "/brand/og.png",
    contentType: "image/png",
  },
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
 * Each entry needs `"@type"`. The layout wraps them into a single `@graph`.
 *
 * Per-page schemas (FAQ, Article, Service, Product, Breadcrumb…) go in
 * `pages.<id>.seo.structuredData` instead — factories in
 * `@/lib/seo/jsonld-factories`. Recipes + copy-paste examples:
 *   → docs/structured-data-cookbook.md
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
  /**
   * Runtime CSS colors — mirrored in globals.css.
   * Comments mark the closest Tailwind v4 colour reference so the
   * original design choice is recoverable without decoding OKLCH.
   * Light-mode values only here; dark-mode is in globals.css.
   */
  colors: {
    brand: "oklch(0.55 0.18 260)" /* indigo-500 (hue retuned to 260) */,
    brandForeground: "oklch(0.985 0 0)" /* neutral-50 */,
    background: "oklch(1 0 0)" /* white */,
    foreground: "oklch(0.145 0 0)" /* neutral-950 */,
    muted: "oklch(0.97 0 0)" /* neutral-100 */,
    mutedForeground: "oklch(0.556 0 0)" /* neutral-500 */,
    destructive: "oklch(0.577 0.245 27.325)" /* red-600 */,
    border: "oklch(0.84 0 0)" /* between neutral-200 + neutral-300 */,
    ring: "oklch(0.55 0.18 260)" /* matches brand */,
    selectionBg: "oklch(0.9 0.07 260)" /* indigo-100 — selected text wash */,
    selectionFg: "oklch(0.145 0 0)" /* same as foreground */,
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
  /**
   * Bottom-fixed cookie banner + GA Consent Mode integration. Turn ON for
   * EU traffic when `analytics.googleAnalyticsId` is set. When OFF and
   * GA is set, GA loads unconditionally — fine outside the EU, risky inside.
   */
  cookieBanner: false,
  /** Enables `/legal` — privacy + cookies + terms page. */
  legalPage: false,
  /**
   * Enables `/blog` + `/blog/[slug]` — Sanity-powered article list and
   * detail pages. When OFF, both routes 404 (and sitemap / llms.txt drop
   * the blog entry via `pages.blog.enabled`). The Sanity Studio at
   * `/studio` stays available regardless — content authors can keep
   * editing while the public route is hidden.
   */
  blog: true,
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

export const headerNav: readonly NavLink[] = [
  { labelKey: "home", href: "/" },
  // Blog routes — only shown when `features.blog` is on. Header filters by visibility.
  // Author + category indexes are reachable from inside the blog, so they
  // intentionally stay out of the primary nav to avoid clutter.
  ...(features.blog ? [{ labelKey: "blog" as const, href: "/blog" as const }] : []),
];
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
  legal: {
    key: "/legal",
    id: "legal",
    slug: "/legal",
    // Gated by the feature flag — sitemap + routing pick up the change.
    enabled: features.legalPage,
  },
  blog: {
    key: "/blog",
    id: "blog",
    slug: "/blog",
    // Mirrors `features.blog` — sitemap + llms.txt + routing all gate off this.
    enabled: features.blog,
    seo: {
      keywords: ["blog", "articles", "indiecrafts"],
    },
  },
  author: {
    key: "/author",
    id: "author",
    slug: "/author",
    enabled: features.blog,
    seo: {
      keywords: ["authors", "contributors", "writers"],
    },
  },
  category: {
    key: "/blog/category",
    id: "category",
    slug: "/blog/category",
    enabled: features.blog,
    seo: {
      keywords: ["categories", "topics", "articles by topic"],
    },
  },
  tag: {
    key: "/blog/tag",
    id: "tag",
    slug: "/blog/tag",
    enabled: features.blog,
    seo: {
      keywords: ["tags", "topics", "articles by tag"],
    },
  },
} as const satisfies Record<string, PageConfig>;
