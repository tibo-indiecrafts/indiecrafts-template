/**
 * Site-wide SEO **mechanics** only (crawl defaults, OG type, twitter card). All SEO
 * **copy** — siteName, tagline, description, keywords, OG image, the rich-result
 * image, verification codes — plus the footer maker credit is Sanity
 * (`siteSettings` / `siteMeta.<locale>`), read at render time. Per-page overrides
 * live under a page's `seo.*` in `./pages`.
 */

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
  // The site-wide rich-result image default moved to Sanity
  // (`siteSettings.schemaImage`), read by `@/lib/seo/jsonld`; verification codes
  // are Sanity too (`siteSettings.verification`).
} as const;

// The footer maker credit moved to Sanity (`siteSettings.madeBy`, seeded with the
// indiecrafts.dev values) — a client can keep, rebrand, or clear it. Read via
// `getSiteSettings` and prop-fed to `MadeByCredit`.
