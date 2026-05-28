import type { MetadataRoute } from "next";
import { features, isPageVisible, localeCodes, site, type Locale } from "@/config";
import { getStaticPathname } from "@/i18n/routing";
import { client } from "@/sanity/client";
import {
  allAuthorSlugsQuery,
  allCategorySlugsQuery,
  allPostSlugsQuery,
  allTagSlugsQuery,
} from "@/sanity/queries";
import { ROUTES } from "./routes";

/**
 * Sitemap — every (route × locale) combination with hreflang alternates.
 *
 * Static routes come from the `pages` map (`app/routes.ts`).
 * Dynamic routes (`/blog/<slug>`, `/blog/category/<slug>`, etc.) are
 * expanded from Sanity at build time, but only when `features.blog` is
 * on. Routes opt out via `seo.noindex`, `seo.robots.index = false`, or
 * `enabled: false` on their page entry.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ────────────────────────────────────────────
  const staticEntries: MetadataRoute.Sitemap = ROUTES.filter(
    (p) => !p.seo?.noindex && p.seo?.robots?.index !== false && isPageVisible(p),
  ).map((page) => {
    const languages: Record<string, string> = {};
    for (const locale of localeCodes) {
      languages[locale] = `${site.url}${getStaticPathname(page.key, locale)}`;
    }
    return {
      url: `${site.url}${getStaticPathname(page.key, "en")}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.key === "/" ? 1 : 0.7,
      alternates: { languages },
    };
  });

  // ── Dynamic Sanity-driven entries (blog only) ───────────────
  if (!features.blog) return staticEntries;

  const [posts, categories, tags, authors] = await Promise.all([
    client.fetch(allPostSlugsQuery),
    client.fetch(allCategorySlugsQuery),
    client.fetch(allTagSlugsQuery),
    client.fetch(allAuthorSlugsQuery),
  ]);

  // Build a per-document map for posts/categories/tags so we know which
  // locales each appears in. Authors are shared across locales.
  const groupByLocale = <T extends { slug: string | null; language?: string }>(
    docs: T[],
  ) => {
    const map = new Map<string, Set<Locale>>();
    for (const doc of docs) {
      if (!doc.slug) continue;
      const lang = (doc.language ?? "en") as Locale;
      if (!localeCodes.includes(lang)) continue;
      if (!map.has(doc.slug)) map.set(doc.slug, new Set());
      map.get(doc.slug)!.add(lang);
    }
    return map;
  };

  const localePrefix = (locale: Locale): string => (locale === "en" ? "" : `/${locale}`);

  const dynamicEntries: MetadataRoute.Sitemap = [];

  // Blog posts — one entry per slug, alternates for each locale it exists in.
  const postsByLocale = groupByLocale(posts);
  for (const [slug, locales] of postsByLocale) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${site.url}${localePrefix(locale)}/blog/${slug}`;
    }
    const primary = locales.has("en") ? "en" : (locales.values().next().value as Locale);
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
    const primary = locales.has("en") ? "en" : (locales.values().next().value as Locale);
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
    const primary = locales.has("en") ? "en" : (locales.values().next().value as Locale);
    dynamicEntries.push({
      url: `${site.url}${localePrefix(primary)}/blog/tag/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: { languages },
    });
  }

  // Authors — global (no `language` field). Emit once per locale.
  for (const author of authors) {
    if (!author.slug) continue;
    const languages: Record<string, string> = {};
    for (const locale of localeCodes) {
      languages[locale] = `${site.url}${localePrefix(locale)}/author/${author.slug}`;
    }
    dynamicEntries.push({
      url: `${site.url}/author/${author.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: { languages },
    });
  }

  return [...staticEntries, ...dynamicEntries];
}
