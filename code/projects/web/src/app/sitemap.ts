import type { MetadataRoute } from "next";
import {
  defaultLocale,
  features,
  isPageVisible,
  localeCodes,
  localePrefix,
  site,
  type Locale,
} from "@/config";
import { getStaticPathname } from "@/i18n/routing";
import { getSiteSeo } from "@/lib/seo/site-seo";
import { client } from "@indiecrafts/sanity/client";
import {
  allAuthorSlugsQuery,
  allCategorySlugsQuery,
  allPostSlugsQuery,
  allSeriesSlugsQuery,
  allTagSlugsQuery,
} from "@indiecrafts/blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/blog/lib/settings";
import { sitemapPagesQuery } from "@/sanity/page-queries";
import { ROUTES } from "./routes";

// O(1) membership test for the per-document locale loop below (vs re-scanning
// the locale array on every Sanity doc).
const localeCodeSet = new Set<Locale>(localeCodes);

// Taxonomy index page id → its `blog.display.taxonomy.*` key, so an editor
// toggling a taxonomy off also drops its index page from the sitemap.
const TAXONOMY_PAGE_KEY: Record<string, "categories" | "tags" | "authors"> = {
  category: "categories",
  tag: "tags",
  author: "authors",
};

/**
 * Sitemap — every (route × locale) combination with hreflang alternates.
 *
 * Static routes come from the `pages` map (`app/routes.ts`).
 * Dynamic routes (`/blog/<slug>`, `/blog/category/<slug>`, etc.) are
 * expanded from Sanity at build time, but only when `features.blog` is
 * on. Routes opt out via `seo.noindex`, `seo.robots.index = false`, or
 * `enabled: false` on their page entry.
 *
 * Disabled entirely (empty sitemap) when `features.sitemap` is off —
 * `robots.txt` also stops advertising it then.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Feature-gated: an empty sitemap when off; robots.txt also stops
  // advertising it (see `app/robots.txt/route.ts`).
  if (!features.sitemap) return [];

  const now = new Date();

  // Editor display toggles — gate the taxonomy index pages (below) and the
  // dynamic taxonomy entries; folds in `features.blogTaxonomy.*`.
  const display = await getBlogSettings();

  // ── Static pages ────────────────────────────────────────────
  // Per-locale Sanity `pageSeo.noindex` can hide a page in some languages only,
  // so drop those locales from the alternates (and the whole page if all hidden).
  const seoByLocale = new Map(
    await Promise.all(localeCodes.map(async (l) => [l, await getSiteSeo(l)] as const)),
  );
  const staticEntries: MetadataRoute.Sitemap = ROUTES.flatMap((page) => {
    if (page.seo?.noindex || page.seo?.robots?.index === false || !isPageVisible(page))
      return [];
    const taxKey = TAXONOMY_PAGE_KEY[page.id];
    if (taxKey && !display.taxonomy[taxKey]) return [];
    const activeLocales = localeCodes.filter(
      (l) => !seoByLocale.get(l)?.pageSeo.get(page.id)?.noindex,
    );
    if (activeLocales.length === 0) return [];
    const languages: Record<string, string> = {};
    for (const locale of activeLocales) {
      languages[locale] = `${site.url}${getStaticPathname(page.key, locale)}`;
    }
    const primary = activeLocales.includes(defaultLocale)
      ? defaultLocale
      : activeLocales[0]!;
    return [
      {
        url: `${site.url}${getStaticPathname(page.key, primary)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: page.key === "/" ? 1 : 0.7,
        alternates: { languages },
      },
    ];
  });

  // ── Generic page-builder pages (always on — not blog-gated) ──
  // One entry per slug, alternates for each locale the page exists in. Drops
  // unpublished / noindex / hidden (query-side).
  const builderPages = await client.fetch(sitemapPagesQuery);
  const pagesByLocale = new Map<string, Set<Locale>>();
  for (const p of builderPages) {
    if (!p.slug) continue;
    const lang = (p.language ?? defaultLocale) as Locale;
    if (!localeCodeSet.has(lang)) continue;
    if (!pagesByLocale.has(p.slug)) pagesByLocale.set(p.slug, new Set());
    pagesByLocale.get(p.slug)!.add(lang);
  }
  const pageEntries: MetadataRoute.Sitemap = [];
  for (const [slug, locs] of pagesByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locs)
      languages[locale] = `${site.url}${localePrefix(locale)}/${slug}`;
    const primary = locs.has(defaultLocale)
      ? defaultLocale
      : (locs.values().next().value as Locale);
    pageEntries.push({
      url: `${site.url}${localePrefix(primary)}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages },
    });
  }

  // ── Dynamic Sanity-driven entries (blog only) ───────────────
  if (!features.blog) return [...staticEntries, ...pageEntries];

  // Each taxonomy is fetched only when its editor toggle is on — off means no
  // entries, matching the 404'd routes ("off = truly gone").
  const emptySlugs = Promise.resolve<{ slug: string | null; language?: string }[]>([]);
  const [posts, categories, tags, authors, series] = await Promise.all([
    client.fetch(allPostSlugsQuery),
    display.taxonomy.categories ? client.fetch(allCategorySlugsQuery) : emptySlugs,
    display.taxonomy.tags ? client.fetch(allTagSlugsQuery) : emptySlugs,
    display.taxonomy.authors ? client.fetch(allAuthorSlugsQuery) : emptySlugs,
    features.blogSeries ? client.fetch(allSeriesSlugsQuery) : emptySlugs,
  ]);

  // Build a per-document map for posts/categories/tags so we know which
  // locales each appears in. Authors are shared across locales.
  const groupByLocale = <T extends { slug: string | null; language?: string }>(
    docs: T[],
  ) => {
    const map = new Map<string, Set<Locale>>();
    for (const doc of docs) {
      if (!doc.slug) continue;
      const lang = (doc.language ?? defaultLocale) as Locale;
      if (!localeCodeSet.has(lang)) continue;
      if (!map.has(doc.slug)) map.set(doc.slug, new Set());
      map.get(doc.slug)!.add(lang);
    }
    return map;
  };

  const dynamicEntries: MetadataRoute.Sitemap = [];

  // Blog posts — one entry per slug, alternates for each locale it exists in.
  const postsByLocale = groupByLocale(posts);
  for (const [slug, locales] of postsByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${site.url}${localePrefix(locale)}/blog/${slug}`;
    }
    const primary = locales.has(defaultLocale)
      ? defaultLocale
      : (locales.values().next().value as Locale);
    dynamicEntries.push({
      url: `${site.url}${localePrefix(primary)}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages },
    });
  }

  // Categories
  const categoriesByLocale = groupByLocale(categories);
  for (const [slug, locales] of categoriesByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${site.url}${localePrefix(locale)}/blog/category/${slug}`;
    }
    const primary = locales.has(defaultLocale)
      ? defaultLocale
      : (locales.values().next().value as Locale);
    dynamicEntries.push({
      url: `${site.url}${localePrefix(primary)}/blog/category/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: { languages },
    });
  }

  // Tags
  const tagsByLocale = groupByLocale(tags);
  for (const [slug, locales] of tagsByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${site.url}${localePrefix(locale)}/blog/tag/${slug}`;
    }
    const primary = locales.has(defaultLocale)
      ? defaultLocale
      : (locales.values().next().value as Locale);
    dynamicEntries.push({
      url: `${site.url}${localePrefix(primary)}/blog/tag/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: { languages },
    });
  }

  // Series — one entry per slug, alternates for each locale it exists in.
  const seriesByLocale = groupByLocale(series);
  for (const [slug, locales] of seriesByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${site.url}${localePrefix(locale)}/blog/series/${slug}`;
    }
    const primary = locales.has(defaultLocale)
      ? defaultLocale
      : (locales.values().next().value as Locale);
    dynamicEntries.push({
      url: `${site.url}${localePrefix(primary)}/blog/series/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: { languages },
    });
  }

  // Authors — per-locale (shared slugs): one entry per slug, alternates limited
  // to the locales the author actually exists in (else we'd advertise 404 URLs).
  const authorsByLocale = groupByLocale(authors);
  for (const [slug, locales] of authorsByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${site.url}${localePrefix(locale)}/author/${slug}`;
    }
    const primary = locales.has(defaultLocale)
      ? defaultLocale
      : (locales.values().next().value as Locale);
    dynamicEntries.push({
      url: `${site.url}${localePrefix(primary)}/author/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: { languages },
    });
  }

  return [...staticEntries, ...pageEntries, ...dynamicEntries];
}
