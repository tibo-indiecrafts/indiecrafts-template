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

import type { FontRoles, Locale, LocaleConfig, PageConfig, ThemeName } from "./types";

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
  /**
   * Production origin (`NEXT_PUBLIC_SITE_URL`, else the placeholder). The one
   * build-time site value that must stay in code — it feeds `metadataBase`,
   * canonical, sitemap, and robots, which resolve synchronously.
   *
   * Everything else that used to live here — name, tagline, description, contact,
   * business/legal fields, extra JSON-LD — is edited in Sanity (`siteSettings` /
   * `siteMeta`) and read via `getSiteSettings` / `getSiteSeo`.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || PLACEHOLDER_SITE_URL,
} as const;

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

/**
 * Locale-aware absolute path for a dynamic detail route whose slug isn't in
 * `PATHNAMES` — blog posts, categories, tags, authors. Mirrors the `as-needed`
 * prefix policy: the default locale gets no prefix, every other locale a `/<locale>`.
 */
export function localizedPathname(pathname: `/${string}`, locale: Locale): string {
  return `${localePrefix(locale)}${pathname}`;
}

/** Text direction for a locale — falls back to `"ltr"` for unknown codes. */
export const localeDir = (code: Locale): "ltr" | "rtl" => localeMap[code]?.dir ?? "ltr";

// 4. ─── features ─────────────────────────────────────────────
// Global on/off switches. One line each — full behavior (routes gated,
// dependencies, discovery consequences) → docs/apps/web/config/feature-flags.md.

export const features = {
  /** LLM endpoints: index `/llms.txt` · full `/llms-full.txt` · pages `/llms/<id>`. */
  llms: {
    index: true,
    full: true,
    pages: true,
  },
  /** RSS + Atom feeds. Requires `blog` (gated via `isRssEnabled`). */
  rss: true,
  /** `/sitemap.xml` + robots advertising it. */
  sitemap: true,
  /** All JSON-LD (Organization/WebSite/WebPage/FAQPage). */
  structuredData: true,
  /** Header locale switcher. */
  localeSwitcher: true,
  /** The five legal pages, each toggled independently (`sales` = CGV, selling only). */
  legal: {
    notice: true,
    privacy: true,
    cookies: true,
    terms: true,
    sales: false,
  },
  /** Per-page FAQ — `<Faq>` + FAQPage JSON-LD + llms block. */
  faq: true,
  /** The public blog surface — all blog routes/feeds/discovery. Gated via `route-gate`. */
  blog: true,
  /** Blog taxonomy routes, each toggled independently. Requires `blog`. */
  blogTaxonomy: {
    authors: true,
    categories: true,
    tags: true,
  },
  /** Sanity Studio at `/studio` + draft-mode preview. Independent of `blog`. */
  studio: true,
  /** Site-wide maintenance mode — `proxy.ts` rewrites all traffic to `/maintenance` (503). */
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

// Analytics (Google Analytics id) + cookie-consent are edited in Sanity
// (`siteSettings.analytics`) — read via `getSiteSettings()`, consumed in the
// locale layout. See `docs/apps/web/seo/analytics.md`.

// 5. ─── navigation ───────────────────────────────────────────
//
// The header menu + footer columns are edited in Sanity (the `navigation`
// singleton) — the SOLE runtime source, no config fallback. Read via
// `getNavigation(locale)` (`src/lib/navigation.ts`), rendered by Header/Footer,
// seeded by `pnpm seed`. See `docs/apps/web/config/navigation.md`.
//
// `madeBy` below is the fixed maker credit (not client-editable) — it stays in
// config so it survives a client rebrand.

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

// 6. ─── seoDefaults ──────────────────────────────────────────

export const seoDefaults = {
  // Title template + default title are built in the layout from the Sanity
  // `siteName` + locale `tagline` (`%s · <siteName>`) — not here, so the name
  // stays editor-controlled with a code fallback (`DEFAULT_SITE_NAME`).
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
    // `siteName` comes from Sanity (`siteSettings.siteName`) at render time.
    // No default image — the OG card is Sanity-only (`siteMeta.<locale>.ogImage`).
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
  // Search-engine verification codes (Google / Bing) are edited in Sanity
  // (`siteSettings.verification`) and emitted by the layout's `generateMetadata`.
} as const;

// llms.txt extras (external `resources`) are edited in Sanity
// (`siteMeta.<locale>.llms.resources`) — read via `getSiteSeo`. Page entries are
// auto-derived from the `pages` map. Nothing to configure here.

// 8. ─── pages ────────────────────────────────────────────────

/**
 * Per-route metadata. SEO CONTENT (title, description, keywords, OG card) is
 * edited per locale in Sanity (`siteMeta.<locale>.pageSeo[pageId]`) — the sole
 * source, no config/messages fallback (see `docs/apps/web/seo/editing-seo-in-sanity.md`).
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
