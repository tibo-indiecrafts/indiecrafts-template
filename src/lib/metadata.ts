/**
 * Per-page metadata builder. Composes <head> tags from a PageConfig + the
 * site-wide defaults in `seoDefaults`.
 *
 * ─ Inheritance chain (lowest precedence → highest) ──────────
 *
 *   1. site.*               → name, description, url, logo, social
 *   2. seoDefaults.*        → titleTemplate, default robots, OG type, twitter card
 *   3. Auto-derived per id  → titleKey = `pages.<id>.title`,
 *                             descriptionKey = `pages.<id>.description`,
 *                             og:image = `/brand/og-<id>.png`,
 *                             canonical = `${site.url}${slug-for-locale}`
 *   4. page.seo.*           → explicit overrides for any field above
 *
 * Each level only fills what the level below didn't. No duplication —
 * if a field exists in two layers it's because the upper one extends or
 * overrides, not because it duplicates a value.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeCodes, seoDefaults, site, type Locale } from "@/config";
import type { PageConfig, StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";
import { getStaticPathname } from "@/i18n/routing";

type BuildArgs = {
  page: PageConfig;
  locale: Locale;
};

function safeT(
  t: Awaited<ReturnType<typeof getTranslations>>,
  key: MessageKey,
  fallback: string,
): string {
  try {
    return t(key);
  } catch {
    return fallback;
  }
}

function isAbsoluteUrl(x: string): x is `http${string}` {
  return x.startsWith("http");
}

export async function buildMetadata({ page, locale }: BuildArgs): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const seo = page.seo;

  // Auto-derived defaults (level 3 in the inheritance chain above)
  const titleKey = seo?.titleKey ?? (`pages.${page.id}.title` as MessageKey);
  const descriptionKey =
    seo?.descriptionKey ?? (`pages.${page.id}.description` as MessageKey);
  const title = safeT(t, titleKey, site.name);
  const description = safeT(t, descriptionKey, site.description);

  // Canonical + hreflang. Absolute URL passes through; StaticAppPathname
  // resolves via next-intl; missing → auto-build from the page's key.
  const href = (
    l: Locale,
    key: StaticAppPathname = page.key as StaticAppPathname,
  ): string => getStaticPathname(key, l);

  let canonical: string;
  const canonicalOverride = seo?.canonical;
  if (canonicalOverride && isAbsoluteUrl(canonicalOverride)) {
    canonical = canonicalOverride;
  } else if (canonicalOverride) {
    canonical = `${site.url}${href(locale, canonicalOverride)}`;
  } else {
    canonical = `${site.url}${href(locale)}`;
  }

  const languages: Record<string, string> = {};
  for (const l of localeCodes) {
    languages[l] = `${site.url}${href(l)}`;
  }
  languages["x-default"] = `${site.url}${href("en")}`;

  // Robots: page override > noindex shortcut > seoDefaults
  const robots = seo?.robots
    ? seo.robots
    : seo?.noindex
      ? { index: false, follow: false }
      : seoDefaults.robots;

  // OG image: per-page override > conventional per-page file > /opengraph-image route
  const ogImage = seo?.openGraph?.imageUrl ?? `/brand/og-${page.id}.png`;

  // Twitter handle for `twitter:site` — falls through cleanly when unset
  const twitterHandle = site.social.twitter || undefined;

  return {
    title,
    description,
    keywords: seo?.keywords ? [...seo.keywords] : undefined,
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
      siteName: seoDefaults.openGraph.siteName,
      type: seo?.openGraph?.type ?? seoDefaults.openGraph.type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: seoDefaults.twitter.card,
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
  };
}
