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
import { getCurrentEnvironment, type Locale } from "@/config";
import { logger } from "@indiecrafts/packages-shared-logger";
import { client } from "@indiecrafts/packages-web-sanity/client";
import {
  blogSeoQuery,
  homeSeoQuery,
  legalSeoQuery,
  siteSeoQuery,
  siteSettingsQuery,
  waitlistSeoQuery,
} from "@/sanity/seo-queries";

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

/**
 * One page's resolved SEO — the normalized `seoMeta` a rendering doc carries on
 * its `.seo`. Field names track the `seoMeta` schema (`image`/`noIndex`), not the
 * old central `pageSeo` array (`ogImage`/`noindex`).
 */
export type PageSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  schemaImage?: string;
  canonical?: string;
  noIndex?: boolean;
  structuredData: GlobalSchemaEntry[];
  llmsSection?: string;
  llmsSummary?: string;
  llmsFull?: string;
};

export type SiteSeo = {
  tagline?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  llms: {
    summary?: string;
    paragraph?: string;
    full?: string;
    /** Last-reviewed date (Sanity `date`, "YYYY-MM-DD") — printed in the llms.txt header. */
    reviewedAt?: string;
    /** Editor-defined H2 section order for the llms.txt page list. */
    sectionOrder?: string[];
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
  /** Site-wide share row (footer + blog posts) — master enable + which networks show. */
  share: {
    enabled: boolean;
    networks: { x: boolean; linkedin: boolean; facebook: boolean; copyLink: boolean };
  };
  globalSchemas: GlobalSchemaEntry[];
  /** Which color-theme modes the site offers (overrides the `themeConfig` code default). */
  themeModes?: { light?: boolean; dark?: boolean; forced?: string };
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

const EMPTY_SEO: SiteSeo = { llms: { resources: [] } };
const EMPTY_SETTINGS: SiteSettings = {
  brand: {},
  social: {},
  business: { openingHours: [], areaServed: [] },
  robots: {},
  verification: {},
  analytics: {},
  share: {
    enabled: true,
    networks: { x: true, linkedin: true, facebook: true, copyLink: true },
  },
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
    return {
      tagline: data.tagline ?? undefined,
      description: data.description ?? undefined,
      keywords: splitKeywords(data.keywords),
      ogImage: data.ogImage ?? undefined,
      ogImageAlt: data.ogImageAlt ?? undefined,
      llms: {
        summary: data.llms?.summary ?? undefined,
        paragraph: data.llms?.paragraph ?? undefined,
        full: data.llms?.full ?? undefined,
        reviewedAt: data.llms?.reviewedAt ?? undefined,
        sectionOrder: Array.isArray(data.llms?.sectionOrder)
          ? (data.llms.sectionOrder as string[]).map((s) => s?.trim()).filter(Boolean)
          : undefined,
        resources: (
          (data.llms?.resources ?? []) as { name?: string; href?: string }[]
        ).filter((r): r is { name: string; href: string } => Boolean(r?.name && r?.href)),
      },
    };
  } catch {
    return EMPTY_SEO;
  }
});

// ── Per-page SEO resolver (`.seo` on the rendering doc) ───────

/** Raw `seoMeta` projection (see `SEO_META_PROJECTION` in `seo-queries.ts`). */
type RawSeoMeta = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  schemaImage?: string | null;
  canonical?: string | null;
  noIndex?: boolean | null;
  llmsSection?: string | null;
  llmsSummary?: string | null;
  llmsFull?: string | null;
  structuredData?: Partial<GlobalSchemaEntry>[] | null;
};

function normalizeSeoMeta(raw: RawSeoMeta | null | undefined): PageSeo | undefined {
  if (!raw) return undefined;
  return {
    title: raw.title ?? undefined,
    description: raw.description ?? undefined,
    keywords: splitKeywords(raw.keywords),
    image: raw.image ?? undefined,
    imageAlt: raw.imageAlt ?? undefined,
    schemaImage: raw.schemaImage ?? undefined,
    canonical: raw.canonical ?? undefined,
    noIndex: raw.noIndex ?? undefined,
    structuredData: normalizeSchemas(raw.structuredData),
    llmsSection: raw.llmsSection?.trim() || undefined,
    llmsSummary: raw.llmsSummary ?? undefined,
    llmsFull: raw.llmsFull ?? undefined,
  };
}

/** Static page id → its `legalPage.pageKey` (French primary, per the schema). */
const LEGAL_PAGE_KEY: Record<string, string> = {
  "legal-notice": "mentions-legales",
  privacy: "confidentialite",
  cookies: "cookies",
  terms: "cgu",
  "terms-of-sale": "cgv",
};

/** Blog singleton SEO (frontpage + taxonomy list pages) — one fetch per request. */
const getBlogSeo = cache(
  async (): Promise<Record<
    "seo" | "author" | "category" | "tag",
    RawSeoMeta | null
  > | null> => {
    try {
      return await client.fetch(blogSeoQuery);
    } catch {
      return null;
    }
  },
);

/**
 * Resolve one static route's SEO from the doc it renders — the replacement for
 * the old central `siteMeta.pageSeo[pageId]` array. Dispatches by `pageId` to
 * the owning doc's `.seo`:
 *   home → the home `page` doc · blog → the blog singleton ·
 *   author/category/tag → the blog singleton's `indexSeo.*` ·
 *   legal pages → the matching `legalPage` · waitlist → `waitlistSettings`.
 * Any doc-less route (e.g. `data-request`, `/blog/search`) resolves to
 * `undefined` → the layout defaults + site-wide OG apply. React-cached per
 * `(pageId, locale)`, so `buildMetadata` + `<PageSchemas>` share one fetch.
 */
export const getPageSeo = cache(
  async (pageId: string, locale: Locale): Promise<PageSeo | undefined> => {
    try {
      if (pageId === "home") {
        return normalizeSeoMeta(await client.fetch(homeSeoQuery, { locale }));
      }
      if (pageId === "blog") return normalizeSeoMeta((await getBlogSeo())?.seo);
      if (pageId === "author" || pageId === "category" || pageId === "tag") {
        return normalizeSeoMeta((await getBlogSeo())?.[pageId]);
      }
      if (pageId === "waitlist") {
        return normalizeSeoMeta(await client.fetch(waitlistSeoQuery));
      }
      const pageKey = LEGAL_PAGE_KEY[pageId];
      if (pageKey) {
        return normalizeSeoMeta(await client.fetch(legalSeoQuery, { pageKey, locale }));
      }
      return undefined;
    } catch {
      return undefined;
    }
  },
);

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
      // Unset toggle = shown (matches the schema `initialValue: true`).
      share: {
        enabled: data.share?.enabled ?? true,
        networks: {
          x: data.share?.x ?? true,
          linkedin: data.share?.linkedin ?? true,
          facebook: data.share?.facebook ?? true,
          copyLink: data.share?.copyLink ?? true,
        },
      },
      globalSchemas: normalizeSchemas(data.globalSchemas),
      themeModes: data.themeModes
        ? {
            light: data.themeModes.light ?? undefined,
            dark: data.themeModes.dark ?? undefined,
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
