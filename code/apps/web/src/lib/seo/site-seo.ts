/**
 * Sanity-only SEO read path. `siteMeta.<locale>` + `siteSettings` are the SOLE
 * runtime source for the site's SEO surface — there is NO config/messages
 * fallback. A field absent in Sanity is simply empty; on any fetch error the
 * fetchers return the empty shape (never throw), so the site still renders.
 *
 * Both fetchers are wrapped in React `cache()` so `generateMetadata`,
 * `<PageSchemas>`, the layout, and the llms routes share ONE fetch per request.
 */

import { cache } from "react";
import { getCurrentEnvironment, type Locale } from "@indiecrafts/config";
import { logger } from "@indiecrafts/logger";
import { client } from "@indiecrafts/sanity/client";
import { siteSeoQuery, siteSettingsQuery } from "@/sanity/seo-queries";

// ── Normalized shapes ────────────────────────────────────────

/** One editor-picked JSON-LD entity — used site-wide and per-page. */
export type GlobalSchemaEntry = {
  schemaType: string;
  name: string;
  description?: string;
  url?: string;
  image?: string;
  price?: string;
  priceCurrency?: string;
};

export type PageSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  schemaImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData: GlobalSchemaEntry[];
  llmsSummary?: string;
  llmsFull?: string;
};

export type SiteSeo = {
  tagline?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  /** Per-page overrides keyed by `pageId`. */
  pageSeo: Map<string, PageSeo>;
  llms: {
    summary?: string;
    paragraph?: string;
    full?: string;
    resources: { name: string; href: string }[];
  };
};

/**
 * Fallback site name — the one deliberate exception to Sanity-only/no-fallback:
 * an empty `<title>` / manifest name is worse than a stale default, so consumers
 * use `settings.siteName || DEFAULT_SITE_NAME`.
 */
export const DEFAULT_SITE_NAME = "indiecrafts.dev";

/**
 * Fail loud when a **production** site ships with no `siteName` — otherwise the
 * template brand (`DEFAULT_SITE_NAME`) silently renders as the client's name in
 * titles / OG / manifest / JSON-LD. Non-fatal (a hard fail would break every
 * render); fires once per request via the `getSiteSettings` React cache.
 */
function auditSiteName(settings: SiteSettings): SiteSettings {
  if (!settings.siteName && getCurrentEnvironment() === "production") {
    logger.error(
      `siteName is empty — the site falls back to the template brand "${DEFAULT_SITE_NAME}". Set it in Studio → Site settings.`,
    );
  }
  return settings;
}

export type SiteSettings = {
  /** Brand/site name — titles, OG siteName, manifest, JSON-LD WebSite.name. */
  siteName?: string;
  brand: { logo?: string; logoDark?: string; icon?: string };
  social: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    mastodon?: string;
  };
  business: {
    businessType?: string;
    company?: string;
    legalName?: string;
    alternateName?: string;
    foundingDate?: string;
    address?: Record<string, string>;
    contactPoint?: Record<string, string>;
    geo?: { latitude?: string; longitude?: string };
    priceRange?: string;
    openingHours: string[];
    areaServed: string[];
  };
  robots: { noindex?: boolean; nofollow?: boolean };
  verification: { google?: string; bing?: string };
  analytics: { googleAnalyticsId?: string; requireCookieConsent?: boolean };
  globalSchemas: GlobalSchemaEntry[];
  /** Which color-theme modes the site offers (overrides the `themeConfig` code default). */
  themeModes?: { light?: boolean; dark?: boolean; system?: boolean; forced?: string };
  /** Editor overrides for display toggles — `false` hides; unset = the code `features.*` default. */
  showLocaleSwitcher?: boolean;
  showStructuredData?: boolean;
  showFaq?: boolean;
  /** Site-wide rich-result image (WebPage JSON-LD fallback). */
  schemaImage?: string;
  /** Footer maker credit (was `config.madeBy`). */
  madeBy?: {
    name?: string;
    href?: string;
    domain?: string;
    image?: string;
    title?: string;
    description?: string;
  };
};

/** Filter raw GROQ schema entries to valid ones (require type + name). */
function normalizeSchemas(raw: unknown): GlobalSchemaEntry[] {
  return ((raw ?? []) as Partial<GlobalSchemaEntry>[]).filter(
    (s): s is GlobalSchemaEntry => Boolean(s?.schemaType && s?.name),
  );
}

const EMPTY_SEO: SiteSeo = { pageSeo: new Map(), llms: { resources: [] } };
const EMPTY_SETTINGS: SiteSettings = {
  brand: {},
  social: {},
  business: { openingHours: [], areaServed: [] },
  robots: {},
  verification: {},
  analytics: {},
  globalSchemas: [],
};

/** Comma-separated string → trimmed, non-empty array (undefined when blank). */
function splitKeywords(raw?: string | null): string[] | undefined {
  if (!raw) return undefined;
  const list = raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

// ── Fetchers (cached per request) ────────────────────────────

export const getSiteSeo = cache(async (locale: Locale): Promise<SiteSeo> => {
  try {
    const data = await client.fetch(siteSeoQuery, { id: `siteMeta.${locale}` });
    if (!data) return EMPTY_SEO;
    const pageSeo = new Map<string, PageSeo>();
    for (const entry of data.pageSeo ?? []) {
      if (!entry?.pageId) continue;
      pageSeo.set(entry.pageId, {
        title: entry.title ?? undefined,
        description: entry.description ?? undefined,
        keywords: splitKeywords(entry.keywords),
        ogImage: entry.ogImage ?? undefined,
        ogImageAlt: entry.ogImageAlt ?? undefined,
        schemaImage: entry.schemaImage ?? undefined,
        canonical: entry.canonical ?? undefined,
        noindex: entry.noindex ?? undefined,
        structuredData: normalizeSchemas(entry.structuredData),
        llmsSummary: entry.llmsSummary ?? undefined,
        llmsFull: entry.llmsFull ?? undefined,
      });
    }
    return {
      tagline: data.tagline ?? undefined,
      description: data.description ?? undefined,
      keywords: splitKeywords(data.keywords),
      ogImage: data.ogImage ?? undefined,
      ogImageAlt: data.ogImageAlt ?? undefined,
      pageSeo,
      llms: {
        summary: data.llms?.summary ?? undefined,
        paragraph: data.llms?.paragraph ?? undefined,
        full: data.llms?.full ?? undefined,
        resources: (
          (data.llms?.resources ?? []) as { name?: string; href?: string }[]
        ).filter((r): r is { name: string; href: string } => Boolean(r?.name && r?.href)),
      },
    };
  } catch {
    return EMPTY_SEO;
  }
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const data = await client.fetch(siteSettingsQuery);
    if (!data) return auditSiteName(EMPTY_SETTINGS);
    return auditSiteName({
      siteName: data.siteName ?? undefined,
      brand: {
        logo: data.logo ?? undefined,
        logoDark: data.logoDark ?? undefined,
        icon: data.icon ?? undefined,
      },
      social: data.social ?? {},
      business: {
        businessType: data.businessType ?? undefined,
        company: data.company ?? undefined,
        legalName: data.legalName ?? undefined,
        alternateName: data.alternateName ?? undefined,
        foundingDate: data.foundingDate ?? undefined,
        address: data.address ?? undefined,
        contactPoint: data.contactPoint ?? undefined,
        geo: data.geo ?? undefined,
        priceRange: data.priceRange ?? undefined,
        openingHours: data.openingHours ?? [],
        areaServed: data.areaServed ?? [],
      },
      robots: data.robots ?? {},
      verification: data.verification ?? {},
      analytics: {
        googleAnalyticsId: data.analytics?.googleAnalyticsId ?? undefined,
        requireCookieConsent: data.analytics?.requireCookieConsent ?? undefined,
      },
      globalSchemas: normalizeSchemas(data.globalSchemas),
      themeModes: data.themeModes
        ? {
            light: data.themeModes.light ?? undefined,
            dark: data.themeModes.dark ?? undefined,
            system: data.themeModes.system ?? undefined,
            forced: data.themeModes.forced ?? undefined,
          }
        : undefined,
      showLocaleSwitcher: data.showLocaleSwitcher ?? undefined,
      showStructuredData: data.showStructuredData ?? undefined,
      showFaq: data.showFaq ?? undefined,
      schemaImage: data.schemaImage ?? undefined,
      madeBy: data.madeBy
        ? {
            name: data.madeBy.name ?? undefined,
            href: data.madeBy.href ?? undefined,
            domain: data.madeBy.domain ?? undefined,
            image: data.madeBy.image ?? undefined,
            title: data.madeBy.title ?? undefined,
            description: data.madeBy.description ?? undefined,
          }
        : undefined,
    });
  } catch {
    return EMPTY_SETTINGS;
  }
});
