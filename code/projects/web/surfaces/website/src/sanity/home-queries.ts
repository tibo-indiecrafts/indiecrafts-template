/**
 * Query the home page document and its resolved page-builder sections.
 *
 * @see docs/reference/projects/web/website/src/sanity/home-queries.md
 */

import { defineQuery } from "next-sanity";
import { MODULES_FRAGMENT } from "@indiecrafts/modules-web-blog/sanity/queries";
import { sidebarProjection } from "@indiecrafts/packages-web-page-builder/sanity/sidebar";

/**
 * The home page — the `page` document with `isHome` on for this locale. Its
 * `sections[]` blocks (the generic ones + the blog blocks) and its `sidebar` resolve
 * through the blog's `MODULES_FRAGMENT` (images → CDN urls, CTA links, refs). Aliased to
 * `pageModules`, read by `getHomePage` (`src/lib/home.ts`). One `page` model everywhere.
 */
export const homePageQuery = defineQuery(`
  *[_type == "page" && isHome == true && language == $locale][0]{
    "pageModules": sections[hidden != true]{ ${MODULES_FRAGMENT} },
    "sidebar": sidebar${sidebarProjection(MODULES_FRAGMENT)}
  }
`);
