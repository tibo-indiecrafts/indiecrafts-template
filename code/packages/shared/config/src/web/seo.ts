/**
 * Site-wide SEO **mechanics** only (crawl defaults, OG type, twitter card). All SEO
 * **copy** — siteName, tagline, description, keywords, OG image, the rich-result
 * image, verification codes — plus the footer maker credit is Sanity
 * (`siteSettings` / `siteMeta.<locale>`), read at render time. Per-page overrides
 * live under a page's `seo.*` in `./pages`.
 */

/**
 * AI **training** / dataset crawlers to block in `robots.txt` when
 * `features.blockAiTraining` is on. Search, AI-*search* and user-fetch crawlers —
 * Googlebot, Bingbot, Applebot, DuckDuckBot, PetalBot, OAI-SearchBot, ChatGPT-User,
 * Claude-SearchBot, Claude-User, PerplexityBot, Amzn-SearchBot — are deliberately NOT
 * listed, so the site keeps indexing and AI search still cites it.
 * `Google-Extended` / `Applebot-Extended` opt out of Gemini/Apple training WITHOUT
 * affecting Search ranking. A client edits this list to taste.
 */
export const AI_TRAINING_USER_AGENTS = [
  "GPTBot", // OpenAI model training
  "Google-Extended", // Gemini/Vertex training — not Search / AI Overviews
  "CCBot", // Common Crawl — feeds most LLM datasets
  "ClaudeBot", // Anthropic training — Claude-SearchBot / Claude-User stay allowed
  "anthropic-ai", // Anthropic (legacy token)
  "Bytespider", // ByteDance
  "Applebot-Extended", // Apple training — Applebot (search) stays allowed
  "Meta-ExternalAgent", // Meta AI training
  "FacebookBot", // Meta language-model training — link previews (facebookexternalhit) stay allowed
  "Amazonbot", // Amazon, training-eligible — Amzn-SearchBot (Alexa answers) stays allowed
  "PanguBot", // Huawei PanGu training — PetalBot (Petal Search) stays allowed
  "AI2Bot", // Ai2 open-model training
  "cohere-training-data-crawler", // Cohere training
] as const;

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
