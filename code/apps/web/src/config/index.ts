/**
 * SITE CONFIGURATION — the single source of truth, almost entirely data:
 * edit values directly. Two things aren't plain literals: `site.url` reads
 * `NEXT_PUBLIC_SITE_URL`, and the locale section's derived lookups
 * (`localeMap`, `localePrefix`, …) sit next to the `locales` array they read
 * — they can't live in `./types.ts` without a runtime import cycle. Types
 * live in `./types.ts` and re-export from here for ergonomic
 * `import { ... } from "@/config"` access.
 *
 * Sections in order:
 *   1. site          — brand, contact, social, legal, image surfaces
 *   2. theme         — color tokens, fonts, radii, container widths
 *   3. locales       — supported languages + defaultLocale + derived helpers
 *   4. features      — global feature flags + themeConfig (light/dark/forced)
 *   5. navigation    — header + footer nav structure
 *   6. seoDefaults   — site-wide head defaults (per-page overrides via `pages.*.seo`)
 *   7. llms          — /llms.txt structure
 *   8. pages         — per-route metadata (key, slug, SEO)
 */

import type {
  BusinessType,
  FontRoles,
  Locale,
  LocaleConfig,
  NavGroup,
  NavLink,
  PageConfig,
  ThemeName,
} from "./types";

// `@/config` is the single import for everyone — re-export from sibling types
export type {
  Locale,
  LocaleConfig,
  ThemeName,
  ThemeMode,
  FontKey,
  FontRoles,
  PageConfig,
  PageSeo,
  StaticAppPathname,
  RouteSlug,
  CanonicalOverride,
  OgImageUrl,
  NavLink,
  NavGroup,
  Environment,
  BusinessType,
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
  /**
   * Production origin. Reads `NEXT_PUBLIC_SITE_URL` (set it per environment —
   * real domain in prod, left unset everywhere else) and falls back to the
   * placeholder. `isSiteConfigured` + robots.txt key off whether this is real.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || PLACEHOLDER_SITE_URL,
  // Logo, favicon/app icon, AND the Open Graph share card are edited in Sanity
  // (`siteSettings.logo` / `logoDark` / `icon`, `siteMeta.<locale>.ogImage`) —
  // the sole source, no config fallback and nothing in `/public`. Rendered by
  // `Logo.tsx`, the layout's `generateMetadata` (icons + og), and `app/manifest.ts`.
  contact: {
    email: "hello@example.com",
  },
  // Social profiles are edited in Sanity (`siteSettings.social`) — read via
  // `getSiteSettings().social`, rendered by the footer follow block
  // (`SocialFollow`) and emitted as Organization `sameAs` (both through
  // `socialLinks`, `src/lib/social.ts`).
  legal: {
    company: "Indiecrafts",
    /**
     * schema.org business type for the site entity. `"Organization"` (default)
     * emits a neutral Organization. Any LocalBusiness subtype
     * (`"LocalBusiness"`, `"ProfessionalService"`, `"Restaurant"`, …) upgrades
     * the schema to that type and pulls in `geo`, `openingHours`, `priceRange`,
     * and `areaServed` below — set those for a local/agency/practice site.
     */
    businessType: "Organization" as BusinessType,
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
    // ── LocalBusiness extras — only emitted when `businessType` isn't
    //    "Organization". Each is omitted individually when left empty. ──
    /** Geo coordinates as strings. BOTH required or the `geo` block is dropped. */
    geo: { latitude: "", longitude: "" },
    /** Price-range hint shown in rich results, e.g. "€€" or "$$–$$$". */
    priceRange: "",
    /** schema.org opening-hours specs, e.g. ["Mo-Fr 09:00-18:00", "Sa 10:00-13:00"]. */
    openingHours: [] as readonly string[],
    /** Regions/cities served — emitted as `AdministrativeArea` entries. */
    areaServed: [] as readonly string[],
  },
} as const;

/**
 * Extra site-wide JSON-LD beyond Organization + WebSite (always emitted).
 * Each entry needs `"@type"`. The layout wraps them into a single `@graph`.
 *
 * Per-page schemas (FAQ, Article, Service, Product, Breadcrumb…) go in
 * `pages.<id>.seo.structuredData` instead — factories in
 * `@/lib/seo/jsonld-factories`. Recipes + copy-paste examples:
 *   → docs/seo/structured-data-cookbook.md
 */
export const globalSchemas: readonly Record<string, unknown>[] = [];

/** `true` once `site.url` has been pointed at a real origin. */
export const isSiteConfigured = site.url !== PLACEHOLDER_SITE_URL;

// 2. ─── theme ────────────────────────────────────────────────

export const theme = {
  /**
   * Hex mirror of the oklch `background` token — the one color the PWA
   * manifest (`app/manifest.ts` → `theme_color` / `background_color`) needs,
   * since the manifest spec can't take oklch. Everything else reads oklch
   * straight from `globals.css` (the authoritative color source) via Tailwind
   * utilities. Keep this value matched to `--background` in globals.css.
   */
  hexColors: {
    background: "#ffffff",
  },
  container: { maxWidth: "1280px", gutter: "1rem" },
} as const;

/**
 * Active font pairing — one registered font (see `@/lib/fonts`) per role.
 *
 * `next/font` requires its loader calls to be static literals, so the fonts
 * themselves live in the registry; this just picks which plays each role.
 * `display` drives headings (`--font-display`); set it equal to `body` for a
 * single-typeface look. Swapping the whole pairing is a one-line edit here.
 *
 * Ships a display/body split: Satoshi (self-hosted local variable font) for
 * headings, Geist (Google, auto-subset + self-hosted) for body, Geist Mono
 * for code. Add a font → extend `FontKey` + the registry, then name it here.
 */
export const fonts = {
  display: "satoshi",
  body: "geist",
  mono: "geist-mono",
} as const satisfies FontRoles;

// 3. ─── i18n: locales + routing ──────────────────────────────
//
// The entire internationalization surface in ONE object — the languages the
// site ships, which one is the unprefixed default, and how locales appear in
// URLs. `i18n/routing.ts` + the proxy consume `i18n` directly; the flat
// aliases + derived helpers below (`locales`, `defaultLocale`, `localeDir`, …)
// are ergonomic re-exports so the rest of the app imports a single name.
//
// Add a language: add a row to `i18n.locales` + drop `messages/<code>.json`.
// The `Locale` union, routing, sitemap, hreflang, llms endpoints, and the
// locale switcher all follow automatically.
//
// Localized slugs: a page's `slug` (in the `pages` map below) may be a plain
// string (same path everywhere) OR a `{ [code]: string }` object for per-locale
// paths — e.g. `{ en: "/legal", fr: "/mentions-legales" }`.

export const i18n = {
  /** Registered languages. Row order is the locale-switcher menu order. */
  locales: [
    { code: "en", label: "English", abbr: "EN", dir: "ltr" },
    { code: "fr", label: "Français", abbr: "FR", dir: "ltr" },
  ],
  /** The unprefixed locale, served at bare paths (`/`, `/blog`). */
  defaultLocale: "en",
  /**
   * How the locale appears in the URL (next-intl `localePrefix`):
   *   - "as-needed" — default locale unprefixed (`/`, `/blog`); others get
   *     `/<code>` (`/fr/blog`). The usual choice.
   *   - "always"    — every locale prefixed (`/en`, `/fr`).
   *   - "never"     — no prefixes; active locale tracked by cookie only.
   */
  localePrefix: "as-needed",
  /**
   * On a first visit to `/`, redirect to the visitor's browser language
   * (Accept-Language) when it's one of `locales`. Their explicit choice (the
   * NEXT_LOCALE cookie) always wins afterwards. `false` = always serve the
   * default locale until the user picks one.
   */
  localeDetection: true,
} as const satisfies {
  locales: readonly LocaleConfig[];
  defaultLocale: string;
  localePrefix: "as-needed" | "always" | "never";
  localeDetection: boolean;
};

// ── Flat aliases + derived helpers (stable public API) ────────

export const locales = i18n.locales;

/**
 * The unprefixed locale. The `: Locale` annotation fails the build if
 * `i18n.defaultLocale` ever names a code that isn't registered above.
 */
export const defaultLocale: Locale = i18n.defaultLocale;

/** Just the codes — the common case, worth the one-line derivation. */
export const localeCodes = locales.map((l) => l.code) as readonly Locale[];

/** O(1) `code → config` lookup. Replaces scattered `locales.find(...)` calls. */
export const localeMap = Object.fromEntries(locales.map((l) => [l.code, l])) as Record<
  Locale,
  LocaleConfig
>;

/** Whether `code` is the default (unprefixed) locale. */
export const isDefaultLocale = (code: Locale): boolean => code === defaultLocale;

/**
 * The URL path prefix for a locale, honouring `i18n.localePrefix`:
 *   never → `""` · always → `"/<code>"` · as-needed → `""` for the default
 * else `"/<code>"`. Used for manual URL building (sitemap, the llms head
 * link); next-intl drives the live routing itself.
 */
export const localePrefix = (code: Locale): string => {
  // Cast off the `as const` literal so all three modes stay reachable
  // (the value is already constrained by the `satisfies` on `i18n`).
  const mode = i18n.localePrefix as string;
  if (mode === "never") return "";
  if (mode === "always") return `/${code}`;
  return isDefaultLocale(code) ? "" : `/${code}`;
};

/** Text direction for a locale — falls back to `"ltr"` for unknown codes. */
export const localeDir = (code: Locale): "ltr" | "rtl" => localeMap[code]?.dir ?? "ltr";

// 4. ─── features ─────────────────────────────────────────────

export const features = {
  /**
   * LLM discovery endpoints — each gated independently so you can ship the
   * short index without the heavy full dump, etc.
   *   index → `/llms.txt`   full → `/llms-full.txt`   pages → `/llms/<id>`
   */
  llms: {
    index: true,
    full: true,
    pages: true,
  },
  /**
   * RSS 2.0 feed at `/blog/rss.xml` + its `<link rel="alternate">` discovery
   * tags. Requires `blog` (the feed lists blog posts) — `blog: false` hides it
   * regardless. Gated via `isRssEnabled()` in `@/features/blog/lib/route-gate`.
   */
  rss: true,
  /**
   * `/sitemap.xml`. When off, the route serves an empty sitemap AND
   * `robots.txt` stops advertising it. Leave on for SEO unless intentionally
   * hiding a site from crawlers.
   */
  sitemap: true,
  /**
   * All JSON-LD structured data — Organization/LocalBusiness + WebSite
   * (site-wide) and WebPage + FAQPage (per page). When off, `<PageSchemas>`
   * and the layout's site schema emit nothing. Leave on for rich results.
   */
  structuredData: true,
  /** Shows the locale switcher in the header. */
  localeSwitcher: true,
  /**
   * Bottom-fixed cookie banner + GA Consent Mode integration. Turn ON for
   * EU traffic when `analytics.googleAnalyticsId` is set. When OFF and
   * GA is set, GA loads unconditionally — fine outside the EU, risky inside.
   */
  cookieBanner: false,
  /** Enables `/legal` — privacy + cookies + terms page. */
  legalPage: true,
  /**
   * Per-page FAQ. Content lives in `messages.pages.<id>.faq` (a translated
   * `{ question, answer }` array). When on, any page that mounts `<Faq>` shows
   * the accordion AND automatically gets FAQPage JSON-LD + an llms.txt FAQ
   * block — see `@/lib/faq`. Off = no FAQ renders and the schema/llms blocks
   * are dropped everywhere.
   */
  faq: true,
  /**
   * The public, Sanity-powered blog surface. When OFF, every public blog
   * route 404s and drops out of discovery — nothing blog-related renders:
   *   - Routes: `/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`,
   *     `/blog/tag` + `/[slug]`, `/author` + `/[slug]`
   *   - Feeds/exports: `/blog/rss.xml`, `/blog/[slug]/md`
   *   - Discovery: sitemap + llms.txt entries (via `pages.*.enabled`),
   *     the header `/blog` nav link
   *   - `<SanityLive>` (revalidates public blog pages on content change)
   *
   * Route gating is centralized in `@/features/blog/lib/route-gate`
   * (`requireBlogRoute` / `isBlogRouteEnabled`) — a single source of truth
   * so a new blog route can't forget the check.
   *
   * The editing surface (Studio at `/studio` + draft-mode preview) is
   * gated SEPARATELY by `features.studio` below — editors can keep the
   * Studio while the public blog is hidden, or vice versa.
   */
  blog: true,
  /**
   * Blog taxonomy surfaces — the `/author`, `/blog/category`, `/blog/tag`
   * listing + detail routes, each toggled independently. Requires `blog`. Turn
   * one OFF to keep posts while removing that taxonomy entirely: its routes 404,
   * its labels/links disappear from the UI, and it drops from the sitemap,
   * llms.txt, and the build (no static params generated).
   */
  blogTaxonomy: {
    authors: true,
    categories: true,
    tags: true,
  },
  /**
   * The Sanity editing surface — the embedded Studio at `/studio` plus the
   * draft-mode preview API (`/api/draft-mode/enable` + `/disable`) its
   * Presentation tool drives. Independent of `features.blog`: turn this OFF
   * to 404 the Studio (e.g. lock editing on a frozen production site)
   * without touching the public blog, or leave it ON with `blog: false` so
   * authors keep working while the public surface is hidden.
   */
  studio: true,
  /**
   * Site-wide maintenance mode. When ON, `proxy.ts` rewrites every public
   * request to `/maintenance` with a `503` (so crawlers treat the outage as
   * temporary, not a dead site). The Studio (`/studio`) and metadata routes
   * (robots/sitemap/icons) stay reachable — the matcher excludes them — so
   * editors keep working while visitors see the maintenance page.
   */
  maintenance: false,
} as const;

/**
 * Theme availability — which color modes the site offers and whether it's
 * locked to one. Consumed via `@/lib/theme`, which turns these flags into
 * next-themes provider props and decides whether the toggle renders.
 *
 * Common setups:
 *   - Light + dark + system (default):  { light: true,  dark: true,  system: true,  forced: null }
 *   - Light only (no toggle):           { light: true,  dark: false, system: false, forced: null }
 *   - Locked to dark (no toggle):       {                                            forced: "dark" }
 *
 * `forced` wins over everything: it paints one theme site-wide and hides the
 * toggle. Otherwise the toggle offers `light`/`dark` (whichever are on), plus
 * a "System" (follow-OS) option when `system` is on AND both themes exist.
 * The toggle auto-hides whenever only one option remains.
 */
export const themeConfig: {
  light: boolean;
  dark: boolean;
  system: boolean;
  forced: ThemeName | null;
} = {
  light: true,
  dark: true,
  system: true,
  forced: null,
};

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
/**
 * Maker attribution rendered in the footer credit (with a hover/focus link
 * preview). Points at indiecrafts.dev — the template's origin.
 *
 * `title`, `description`, and `image` are the **real SEO/OG data published by
 * indiecrafts.dev** (its home `og:title` / `og:description` / `og:image`), not
 * template copy — so the preview is an accurate link card. They're live external
 * / fixed values on purpose: they must stay Indiecrafts' own metadata even after
 * a client rebrands this template's local config + `public/brand/*` assets.
 */
export const madeBy = {
  name: "L'Atelier Web Des Alpes",
  href: "https://indiecrafts.dev",
  image: "https://indiecrafts.dev/brand/og-home.webp",
  domain: "indiecrafts.dev",
  title: "Front-end Design Engineer — AI-accelerated interface design in code",
  description:
    "Freelance front-end design engineer in the French Alps — UX design, UI design, product design and design systems. I design and build websites and digital interfaces directly in code, accelerated by AI.",
} as const;

export const footerNav: readonly NavGroup[] = [
  // Legal link — only shown when `features.legalPage` is on, mirroring the
  // route's own `notFound()` gate so nav and routing can never disagree.
  ...(features.legalPage
    ? [
        {
          labelKey: "company" as const,
          links: [{ labelKey: "legal" as const, href: "/legal" as const }],
        },
      ]
    : []),
];

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
    // No default image here — the OG card is Sanity-only (`siteMeta.<locale>.ogImage`
    // / `pageSeo.ogImage`), emitted by `buildMetadata` + the layout default.
  },
  twitter: {
    card: "summary_large_image",
  },
  /**
   * The image(s) Google may show next to a search result — the `image` field
   * in the auto-emitted WebPage JSON-LD. A single path or an array (Google
   * recommends several aspect ratios: 16:9, 4:3, 1:1). Empty = reuse the
   * page's OG image (per-page `seo.openGraph.imageUrl`, else the site OG
   * card). Set a path (e.g. `/brand/rich-result.png`) or list for distinct
   * rich-result images, or override one page via `seo.schemaImage`. The
   * Organization logo shown in Google's knowledge panel is configured
   * separately by `site.brandLogoPng`.
   */
  schemaImage: "" as string | readonly string[],
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
 * Per-route metadata. SEO CONTENT (title, description, keywords, OG card) is
 * edited per locale in Sanity (`siteMeta.<locale>.pageSeo[pageId]`) — the sole
 * source, no config/messages fallback (see `docs/seo/editing-seo-in-sanity.md`).
 * This map only carries STRUCTURAL routing/config:
 *
 *   - key / id / slug — route identity (slug may be `{ [locale]: string }`)
 *   - canonical       → `${site.url}${slug}` (locale-aware) unless overridden
 *   - robots          → `seoDefaults.robots` (override via `seo.noindex` etc.)
 *   - enabled         → feature-gate a route on/off
 *
 * So each page entry usually only needs `key`, `id`, `slug`; the editor fills the
 * SEO text in the Studio.
 */
export const pages = {
  home: {
    key: "/",
    id: "home",
    slug: "/",
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
