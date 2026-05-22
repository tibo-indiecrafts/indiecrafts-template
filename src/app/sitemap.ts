import type { MetadataRoute } from "next";
import { isPageVisible } from "@/config";
import { localeCodes } from "@/config";
import type { StaticAppPathname } from "@/config";
import { site } from "@/config";
import { getPathname } from "@/i18n/routing";
import { ROUTES } from "./routes";

/**
 * Sitemap — one entry per (auto-discovered route × locale) with hreflang
 * alternates. Routes are discovered from `app/routes.ts` (which globs every
 * `page.config.ts` under `app/[locale]/`). No per-route edits needed here.
 *
 * Routes opt out via `seo.noindex`, `seo.robots.index = false`, or
 * `enabled: false` in their `page.config.ts`. Dynamic-segment routes
 * (`[slug]`) need to be expanded with the project's slug list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter(
    (p) =>
      !p.key.includes("[") &&
      !p.seo?.noindex &&
      p.seo?.robots?.index !== false &&
      isPageVisible(p),
  ).map((page) => {
    const key = page.key as StaticAppPathname;
    const languages: Record<string, string> = {};
    for (const locale of localeCodes) {
      languages[locale] = `${site.url}${getPathname({ href: key, locale })}`;
    }
    return {
      url: `${site.url}${getPathname({ href: key, locale: "en" })}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: key === "/" ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
