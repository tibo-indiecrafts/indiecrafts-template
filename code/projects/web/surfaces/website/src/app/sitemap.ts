/**
 * Build the sitemap of every route and locale with hreflang alternates.
 *
 * @see docs/reference/projects/web/website/src/app/sitemap.md
 */
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
import { getPageSeo } from "@/lib/seo/site-seo";
import { client } from "@indiecrafts/packages-web-sanity/client";
import {
  allAuthorSlugsQuery,
  allCategorySlugsQuery,
  allPostSlugsQuery,
  allSeriesSlugsQuery,
  allTagSlugsQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
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
  // Per-locale doc `.seo.noIndex` can hide a page in some languages only, so drop
  // those locales from the alternates (and the whole page if all hidden). Resolved
  // per (page, locale) from the rendering doc — React-cached, shared with the page.
  const noIndexByPageLocale = new Map<string, boolean>();
  await Promise.all(
    ROUTES.flatMap((page) =>
      localeCodes.map(async (l) => {
        const seo = await getPageSeo(page.id, l);
        if (seo?.noIndex) noIndexByPageLocale.set(`${page.id}:${l}`, true);
      }),
    ),
  );
  const staticEntries: MetadataRoute.Sitemap = ROUTES.flatMap((page) => {
    if (page.seo?.noindex || page.seo?.robots?.index === false || !isPageVisible(page))
      return [];
    const taxKey = TAXONOMY_PAGE_KEY[page.id];
    if (taxKey && !display.taxonomy[taxKey]) return [];
    const activeLocales = localeCodes.filter(
      (l) => !noIndexByPageLocale.get(`${page.id}:${l}`),
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

  // Group each type's rows by slug so every URL is listed for discovery. Slugs are
  // per-locale-distinct (`documentInternationalization: { exclude: true }`), so a
  // post and its translation land in separate entries here — that's fine: the
  // cross-locale `hreflang` LINKING is emitted on the page itself (`buildMetadata`
  // via `translation.metadata`, the authoritative signal). ponytail: not duplicating
  // that linkage into sitemap alternates — it would need a second metadata regroup
  // for a redundant signal; add it only if a crawler ignores the on-page tags.
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
