import { defineQuery } from "next-sanity";
import { MODULES_FRAGMENT } from "@indiecrafts/packages-web-page-builder/sanity/queries";

/**
 * A generic `page` document by slug + locale, with its `sections[]` resolved
 * through the shared page-builder `MODULES_FRAGMENT`. Rendered by the
 * `/[locale]/[...slug]` catch-all (`src/lib/page.ts` → the route).
 */
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && isHome != true && slug.current == $slug && language == $locale][0]{
    title,
    seo{ ..., image{ asset->{ url }, alt } },
    "sections": sections[hidden != true]{ ${MODULES_FRAGMENT} }
  }
`);

/** Every published page (slug, locale) — for `generateStaticParams`. */
export const allPageParamsQuery = defineQuery(`
  *[_type == "page" && isHome != true && defined(slug.current) && seo.unpublished != true]{
    "slug": slug.current,
    "locale": language
  }
`);

/** Indexable published pages (slug, language) — for the sitemap. Drops
 *  unpublished / noindex / hidden-from-discovery. */
export const sitemapPagesQuery = defineQuery(`
  *[_type == "page" && isHome != true && defined(slug.current)
    && seo.unpublished != true && seo.noIndex != true && seo.hideFromDiscovery != true]{
    "slug": slug.current,
    "language": language
  }
`);
