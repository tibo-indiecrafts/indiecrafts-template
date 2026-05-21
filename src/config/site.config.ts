/**
 * Site identity — the single source of truth for brand, contact, and absolute URLs.
 * Edit this file first when forking the template for a new client.
 */

import { z } from "zod";

/**
 * Sentinel value used when NEXT_PUBLIC_SITE_URL hasn't been set. Anything
 * comparing `siteConfig.url === PLACEHOLDER_SITE_URL` knows the site hasn't
 * been pointed at a real origin yet (see `isSiteConfigured` and robots.ts).
 */
export const PLACEHOLDER_SITE_URL = "https://example.com";

const SiteSchema = z.object({
  /** Brand name used in <title>, OG, schema.org Organization */
  name: z.string().min(1),
  /** Short tagline (≤ 90 chars for OG/Twitter) */
  tagline: z.string().max(120),
  /** Long description used as default meta description */
  description: z.string().max(300),
  /** Canonical absolute origin, no trailing slash (e.g. https://example.com) */
  url: z.string().url(),
  /** Path to the brand logo in /public */
  logo: z.string().startsWith("/"),
  /**
   * Icon source — controls what `/icon` and `/apple-icon` serve.
   * - `mode: "generated"` renders the first letter of `name` on the brand color (no asset needed).
   * - `mode: "file"` serves `file` from /public as-is (PNG or SVG). 512×512 PNG recommended.
   * When mode is "file", the SAME image is reused for every size (favicon, apple-touch, PWA 192/512).
   */
  icon: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("generated") }),
    z.object({
      mode: z.literal("file"),
      /** Absolute path in /public, e.g. "/brand/icon.png" */
      file: z.string().startsWith("/"),
      /** MIME type — drives Content-Type header on /icon and /apple-icon */
      contentType: z.enum(["image/png", "image/svg+xml", "image/webp", "image/jpeg"]),
    }),
  ]),
  /**
   * OpenGraph image source — controls what `/opengraph-image` serves.
   * - `mode: "generated"` renders a gradient card with brand name + tagline.
   * - `mode: "file"` serves `file` from /public (1200×630 recommended).
   */
  ogImage: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("generated") }),
    z.object({
      mode: z.literal("file"),
      file: z.string().startsWith("/"),
      contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
    }),
  ]),
  /** Favicon emoji fallback when SVG favicon not supplied */
  faviconEmoji: z.string().optional(),
  /** Contact channels — all optional */
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  /** Social profiles — empty string = hidden */
  social: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    mastodon: z.string().optional(),
  }),
  /** Legal entity used in the footer copyright */
  legal: z.object({
    company: z.string(),
    yearFounded: z.number().int(),
  }),
});

export type SiteConfig = z.infer<typeof SiteSchema>;

export const siteConfig = SiteSchema.parse({
  name: "indiecrafts.dev",
  tagline: "The config-first Next.js template for client websites.",
  description:
    "A highly modular, SEO-ready, i18n-ready, accessibility-first Next.js template. Fork it, edit the config, ship.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? PLACEHOLDER_SITE_URL,
  logo: "/logo.svg",
  icon: {
    // Switch to { mode: "file", file: "/brand/icon.png", contentType: "image/png" }
    // once the client delivers a brand mark.
    mode: "generated",
  },
  ogImage: {
    // Switch to { mode: "file", file: "/brand/og.png", contentType: "image/png" }
    // for hand-crafted social cards.
    mode: "generated",
  },
  faviconEmoji: "🪡",
  contact: {
    email: "hello@example.com",
  },
  social: {
    github: "https://github.com/indiecrafts",
  },
  legal: {
    company: "Indiecrafts",
    yearFounded: 2024,
  },
} satisfies SiteConfig);

/**
 * `true` once `siteConfig.url` has been pointed at a real production origin
 * (via NEXT_PUBLIC_SITE_URL). Use this to gate things that shouldn't ship
 * before the site is configured — robots allow rules, sitemap exposure, etc.
 */
export const isSiteConfigured = siteConfig.url !== PLACEHOLDER_SITE_URL;
