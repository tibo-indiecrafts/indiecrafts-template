/**
 * Per-page metadata builder. Composes <head> tags from a PageConfig, the
 * Sanity SEO singletons, and the structural site-wide defaults in `seoDefaults`.
 *
 * ─ Where each field comes from ──────────────────────────────
 *
 *   SEO CONTENT (Sanity-only, no config fallback — see `getSiteSeo`):
 *     - title / description / keywords → `siteMeta.<locale>.pageSeo[pageId]`
 *     - og:image                       → page override, else `siteMeta.<locale>.ogImage`,
 *                                        else omitted (Sanity-only — no /public card)
 *     - twitter handle                 → `siteSettings.social.twitter`
 *
 *   STRUCTURAL (config/routing — not editorial SEO copy):
 *     - canonical + hreflang → `${site.url}${slug-for-locale}`
 *     - robots               → `page.seo.robots` / `noindex` / `seoDefaults.robots`
 *     - og type / siteName / twitter card → `seoDefaults`
 *
 * A page with no Sanity `pageSeo` entry emits no title/description override — the
 * layout's default metadata applies. Nothing here reads `messages`/config copy.
 */

import type { Metadata } from "next";
import { defaultLocale, localeCodes, seoDefaults, site, type Locale } from "@/config";
import type { PageConfig, StaticAppPathname } from "@/config";
import { getStaticPathname } from "@/i18n/routing";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";

type BuildArgs = {
  page: PageConfig;
  locale: Locale;
  /**
   * Locale-aware path override for dynamic detail routes (blog posts,
   * categories, tags, authors) whose slug isn't in `PATHNAMES`. When set,
   * the page self-canonicalizes to this path instead of inheriting its
   * index route, and hreflang collapses to the single locale the resource
   * exists at (cross-locale alternates would falsely claim translations).
   */
  pathname?: string;
};

function isAbsoluteUrl(x: string): x is `http${string}` {
  return x.startsWith("http");
}

export async function buildMetadata({
  page,
  locale,
  pathname,
}: BuildArgs): Promise<Metadata> {
  const seo = page.seo;

  // SEO copy — Sanity only. Absent → undefined (layout default applies).
  const [siteSeo, settings] = await Promise.all([getSiteSeo(locale), getSiteSettings()]);
  const pageSeo = siteSeo.pageSeo.get(page.id);
  const title = pageSeo?.title;
  const description = pageSeo?.description;
  const keywords = pageSeo?.keywords;
  // og:image: page-specific card → the locale's site card → omitted. Sanity-only,
  // no /public fallback and no convention route.
  const ogImage = pageSeo?.ogImage ?? siteSeo.ogImage;
  const ogImageAlt = pageSeo?.ogImageAlt ?? siteSeo.ogImageAlt ?? title;

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

  // Static routes exist in every locale → full hreflang set. Dynamic detail
  // pages exist at a single locale → self-reference only.
  const languages: Record<string, string> = {};
  if (pathname) {
    languages[locale] = canonical;
    languages["x-default"] = canonical;
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
  const pageNoindex = pageSeo?.noindex || seo?.noindex;
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
