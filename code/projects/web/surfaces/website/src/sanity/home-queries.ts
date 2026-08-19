import { defineQuery } from "next-sanity";
import { MODULES_FRAGMENT } from "@indiecrafts/page-builder/sanity/queries";

/**
 * The home page — the `page` document with `isHome` on for this locale. Its
 * `sections[]` blocks resolve through the shared `MODULES_FRAGMENT` (images → CDN
 * urls, CTA links, quote/person refs). Aliased to `pageModules` so `getHomePage`
 * (`src/lib/home.ts`) + the `(home)` route are unchanged. One `page` model everywhere.
 */
export const homePageQuery = defineQuery(`
  *[_type == "page" && isHome == true && language == $locale][0]{
    "pageModules": sections[hidden != true]{ ${MODULES_FRAGMENT} }
  }
`);
