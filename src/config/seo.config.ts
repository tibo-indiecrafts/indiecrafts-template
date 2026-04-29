/**
 * SEO defaults — applied to every page unless a page explicitly overrides.
 * Combined with per-page metadata in lib/metadata.ts.
 */

import { siteConfig } from "./site.config";

export const seoConfig = {
  /** Template for <title> — "%s" is replaced by the page title */
  titleTemplate: `%s · ${siteConfig.name}`,
  /** Used as <title> for pages that don't provide one */
  defaultTitle: `${siteConfig.name} — ${siteConfig.tagline}`,
  /** Crawling directives default — override per page for noindex */
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
  /** Open Graph + Twitter defaults */
  /**
   * Open Graph + Twitter defaults. `images` points at the /opengraph-image
   * route handler, which dispatches to either the generated card or a
   * static file from /public depending on siteConfig.ogImage.mode.
   */
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.social.twitter,
  },
  /** Verification meta tags — fill in when provided by the client. */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
} as const;
