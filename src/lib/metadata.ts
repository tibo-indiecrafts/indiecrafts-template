/**
 * Per-page metadata builder — composes <head> tags from a PageConfig plus
 * the global SEO defaults. Emits canonical + hreflang across all supported
 * locales, layers in any `seo.*` overrides.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SUPPORTED_LOCALES, type Locale } from "@/config/locales.config";
import type { PageConfig, PageSeo } from "@/config/pages/types";
import type { StaticAppPathname } from "@/config/routes.types";
import { siteConfig } from "@/config/site.config";
import { getPathname } from "@/i18n/routing";

type BuildArgs = {
  page: PageConfig;
  locale: Locale;
  /** Dynamic params for pathnames like "/blog/[slug]". */
  params?: Record<string, string | number>;
  /**
   * Page-template SEO defaults. Merged with `page.seo` such that fields
   * declared in the route's `page.config.ts` win over template defaults.
   *
   *   templateSeo:  { titleKey: "blocks.landing-01.title", keywords: ["a"] }
   *   page.seo:     {                                     keywords: ["b"] }
   *   final:        { titleKey: "blocks.landing-01.title", keywords: ["b"] }
   *
   * Routes get rich defaults for free; expanding SEO per page is a
   * one-field edit in `page.config.ts`.
   */
  templateSeo?: PageSeo;
};

function isAbsoluteUrl(x: string): x is `http${string}` {
  return x.startsWith("http");
}

/**
 * Shallow-merge a route's per-page SEO override on top of the template
 * defaults. `openGraph` gets a recursive merge so route-level overrides
 * (e.g., a custom `imageUrl` for one page) don't lose the template's
 * `type: "article"`.
 */
function mergeSeo(template?: PageSeo, override?: PageSeo): PageSeo | undefined {
  if (!template && !override) return undefined;
  if (!template) return override;
  if (!override) return template;
  return {
    ...template,
    ...override,
    openGraph:
      template.openGraph || override.openGraph
        ? { ...template.openGraph, ...override.openGraph }
        : undefined,
    structuredData: override.structuredData ?? template.structuredData,
    keywords: override.keywords ?? template.keywords,
  };
}

export async function buildMetadata({
  page,
  locale,
  params,
  templateSeo,
}: BuildArgs): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const seo = mergeSeo(templateSeo, page.seo);

  // Title/description fall back to siteConfig defaults when seo is omitted.
  // Template-driven routes always pass `seo` from `<name>Defaults.seo`, so
  // this branch only triggers for routes not wired to a template.
  const title = seo?.titleKey ? t(seo.titleKey) : siteConfig.name;
  const description = seo?.descriptionKey
    ? t(seo.descriptionKey)
    : siteConfig.description;

  // Build canonical + hreflang from the page's key.
  const href = (
    l: Locale,
    key: StaticAppPathname = page.key as StaticAppPathname,
  ): string => {
    const arg = params
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ pathname: key, params } as any)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key as any);
    return getPathname({ href: arg, locale: l });
  };

  // Canonical: absolute URL passes through; StaticAppPathname resolves through
  // next-intl to the locale's URL; missing → auto-build from the page's key.
  let canonical: string;
  const canonicalOverride = seo?.canonical;
  if (canonicalOverride && isAbsoluteUrl(canonicalOverride)) {
    canonical = canonicalOverride;
  } else if (canonicalOverride) {
    canonical = `${siteConfig.url}${href(locale, canonicalOverride)}`;
  } else {
    canonical = `${siteConfig.url}${href(locale)}`;
  }

  const languages: Record<string, string> = {};
  for (const l of SUPPORTED_LOCALES) {
    languages[l] = `${siteConfig.url}${href(l)}`;
  }
  languages["x-default"] = `${siteConfig.url}${href("en")}`;

  const robots = seo?.robots
    ? seo.robots
    : seo?.noindex
      ? { index: false, follow: false }
      : undefined;

  const ogImage = seo?.openGraph?.imageUrl ?? "/opengraph-image";

  return {
    title,
    description,
    keywords: seo?.keywords ? [...seo.keywords] : undefined,
    alternates: { canonical, languages },
    robots,
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      type: seo?.openGraph?.type ?? "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
