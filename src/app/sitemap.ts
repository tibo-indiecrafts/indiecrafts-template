import type { MetadataRoute } from "next";
import { isPageVisible } from "@/config/features.config";
import { SUPPORTED_LOCALES } from "@/config/locales.config";
import { pages } from "@/config/pages";
import type { StaticAppPathname } from "@/config/routes.types";
import { siteConfig } from "@/config/site.config";
import { getPathname } from "@/i18n/routing";

/**
 * One sitemap entry per (registered page × locale), with hreflang alternates.
 *
 * Pages with dynamic segments (`[slug]`) are skipped — fetch slug lists per
 * project (e.g. blog, product pages) and append entries here.
 *
 * Pages can opt out via `seo.noindex = true` or an explicit `seo.robots.index = false`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const indexablePages = pages.filter(
    (p) =>
      !p.key.includes("[") &&
      !p.seo?.noindex &&
      p.seo?.robots?.index !== false &&
      isPageVisible(p),
  );

  return indexablePages.map((page) => {
    const key = page.key as StaticAppPathname;
    const languages: Record<string, string> = {};
    for (const locale of SUPPORTED_LOCALES) {
      languages[locale] = `${siteConfig.url}${getPathname({ href: key, locale })}`;
    }
    return {
      url: `${siteConfig.url}${getPathname({ href: key, locale: "en" })}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: key === "/" ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
