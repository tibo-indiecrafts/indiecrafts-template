/**
 * Per-page metadata builder. Composes <head> tags from a PageConfig, the
 * Sanity SEO singletons, and the structural site-wide defaults in `seoDefaults`.
 *
 * ─ Where each field comes from ──────────────────────────────
 *
 *   SEO CONTENT (Sanity-only, no config fallback — see `getPageSeo`):
 *     - title / description / keywords → the rendering doc's `.seo` (`seoMeta`),
 *                                        resolved per route by `getPageSeo(page.id)`
 *     - og:image                       → page `.seo.image`, else `siteMeta.<locale>.ogImage`,
 *                                        else omitted (Sanity-only — no /public card)
 *     - twitter handle                 → `siteSettings.social.twitter`
 *
 *   STRUCTURAL (config/routing — not editorial SEO copy):
 *     - canonical + hreflang → `${site.url}${slug-for-locale}`
 *     - robots               → `page.seo.robots` / `noIndex` / `seoDefaults.robots`
 *     - og type / siteName / twitter card → `seoDefaults`
 *
 * A route whose doc has no `.seo` (or which owns no doc) emits no title/description
 * override — the layout's default metadata applies. Nothing here reads `messages`/config copy.
 */

import type { Metadata } from "next";
import { defaultLocale, localeCodes, seoDefaults, site, type Locale } from "@/config";
import type { PageConfig, StaticAppPathname } from "@/config";
import { getStaticPathname } from "@/i18n/routing";
import {
  DEFAULT_SITE_NAME,
  getPageSeo,
  getSiteSeo,
  getSiteSettings,
} from "@/lib/seo/site-seo";

type BuildArgs = {
  page: PageConfig;
  locale: Locale;
  /**
   * Locale-aware path override for dynamic detail routes (blog posts,
   * categories, tags, authors) whose slug isn't in `PATHNAMES`. When set,
   * the page self-canonicalizes to this path instead of inheriting its
   * index route.
   */
  pathname?: string;
  /**
   * Real per-locale alternates for a translated detail page (from
   * `translation.metadata`, via `@/lib/seo/translations`), keyed by locale.
   * When present + non-empty, emitted as `hreflang` — we only advertise
   * translations that actually exist. Absent/empty → the page self-references.
   */
  translations?: Record<string, string>;
};

function isAbsoluteUrl(x: string): x is `http${string}` {
  return x.startsWith("http");
}

export async function buildMetadata({
  page,
  locale,
  pathname,
  translations,
}: BuildArgs): Promise<Metadata> {
  const seo = page.seo;

  // SEO copy — Sanity only. Absent → undefined (layout default applies). The
  // rendering doc's `.seo` (`getPageSeo`) replaces the old central `pageSeo` array.
  const [pageSeo, siteSeo, settings] = await Promise.all([
    getPageSeo(page.id, locale),
    getSiteSeo(locale),
    getSiteSettings(),
  ]);
  const title = pageSeo?.title;
  const description = pageSeo?.description;
  const keywords = pageSeo?.keywords;
  // og:image: page-specific card → the locale's site card → omitted. Sanity-only,
  // no /public fallback and no convention route.
  const ogImage = pageSeo?.image ?? siteSeo.ogImage;
  const ogImageAlt = pageSeo?.imageAlt ?? siteSeo.ogImageAlt ?? title;

  // Canonical + hreflang. Absolute URL passes through; StaticAppPathname
  // resolves via next-intl; missing → auto-build from the page's key.
  const href = (
    l: Locale,
    key: StaticAppPathname = page.key as StaticAppPathname,
  ): string => getStaticPathname(key, l);

  let canonical: string;
  // Precedence: per-page Sanity canonical (always a full URL) > config override
  // (an absolute URL or a StaticAppPathname) > dynamic pathname > auto from key.
  const sanityCanonical = pageSeo?.canonical;
  const configCanonical = seo?.canonical;
  if (sanityCanonical) {
    canonical = sanityCanonical;
  } else if (configCanonical && isAbsoluteUrl(configCanonical)) {
    canonical = configCanonical;
  } else if (configCanonical) {
    // A non-absolute canonical override is an app pathname — the config author's
    // assertion it's a real static route (the contract widens it to `/${string}`).
    canonical = `${site.url}${href(locale, configCanonical as StaticAppPathname)}`;
  } else if (pathname) {
    canonical = `${site.url}${pathname}`;
  } else {
    canonical = `${site.url}${href(locale)}`;
  }

  // Static routes exist in every locale → full hreflang set. A dynamic detail
  // page links only the translations that actually exist (`translations`, from
  // `translation.metadata`); with none, it self-references.
  const languages: Record<string, string> = {};
  if (pathname) {
    const alt = translations ?? {};
    if (Object.keys(alt).length > 0) {
      Object.assign(languages, alt);
      if (!languages[locale]) languages[locale] = canonical;
      languages["x-default"] = alt[defaultLocale] ?? languages[locale];
    } else {
      languages[locale] = canonical;
      languages["x-default"] = canonical;
    }
  } else {
    for (const l of localeCodes) {
      languages[l] = `${site.url}${href(l)}`;
    }
    languages["x-default"] = `${site.url}${href(defaultLocale)}`;
  }

  // Robots: config full-override wins; otherwise layer the site-wide toggle
  // (`siteSettings.robots`) with per-page noindex. A per-page noindex also drops
  // follow (the historical shortcut); the site nofollow drops follow site-wide.
  const siteRobots = settings.robots;
  const pageNoindex = pageSeo?.noIndex || seo?.noindex;
  const index = !(pageNoindex || siteRobots.noindex);
  const follow = !(pageNoindex || siteRobots.nofollow);
  const robots = seo?.robots
    ? seo.robots
    : index && follow
      ? seoDefaults.robots
      : { index, follow };

  const twitterHandle = settings.social.twitter || undefined;
  const ogImages = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }]
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages },
    robots,
    // Next.js REPLACES (does not deep-merge) openGraph/twitter when the
    // page returns them — so we must explicitly re-emit siteName + type +
    // card from `seoDefaults` here, otherwise they vanish from the page.
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      alternateLocale: localeCodes.filter((l) => l !== locale),
      siteName: settings.siteName || DEFAULT_SITE_NAME,
      type: seo?.openGraph?.type ?? seoDefaults.openGraph.type,
      images: ogImages,
    },
    twitter: {
      card: seoDefaults.twitter.card,
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: ogImage ? [{ url: ogImage, alt: ogImageAlt }] : undefined,
    },
  };
}
