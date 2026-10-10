/**
 * Query generic page documents by slug, plus params for static routes and sitemap.
 *
 * @see docs/reference/projects/web/website/src/sanity/page-queries.md
 */

import { defineQuery } from "next-sanity";
import { MODULES_FRAGMENT } from "@indiecrafts/modules-web-blog/sanity/queries";
import { sidebarProjection } from "@indiecrafts/packages-web-page-builder/sanity/sidebar";

/**
 * A generic `page` document by slug + locale, with its `sections[]` and `sidebar`
 * resolved through the blog's `MODULES_FRAGMENT` (the generic blocks + the blog blocks a
 * page can hold). Rendered by the `/[locale]/[...slug]` catch-all (`src/lib/page.ts` → the route). An unpublished page
 * matches nothing, so the route 404s.
 */
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && isHome != true && slug.current == $slug && language == $locale
    && seo.unpublished != true][0]{
    title,
    seo{ ..., image{ asset->{ url }, alt } },
    "sections": sections[hidden != true]{ ${MODULES_FRAGMENT} },
    "sidebar": sidebar${sidebarProjection(MODULES_FRAGMENT)}
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
