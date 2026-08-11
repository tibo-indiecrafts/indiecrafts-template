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
import type { Locale } from "@/config";
import { client } from "@/sanity/client";
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

export type SiteSettings = {
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
  globalSchemas: GlobalSchemaEntry[];
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
    if (!data) return EMPTY_SETTINGS;
    return {
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
      globalSchemas: normalizeSchemas(data.globalSchemas),
    };
  } catch {
    return EMPTY_SETTINGS;
  }
});
