import { defineQuery } from "next-sanity";
import { MODULES_FRAGMENT } from "@indiecrafts/blog/sanity/queries";

/**
 * The per-locale homepage document (`homePage.en` / `homePage.fr`), with its
 * `pageModules[]` blocks resolved through the shared `MODULES_FRAGMENT` — the
 * same reference expansion (images → CDN urls, CTA links, quote/person refs)
 * the blog body uses. Read by `getHomePage` (`src/lib/home.ts`).
 */
export const homePageQuery = defineQuery(`
  *[_id == $id][0]{
    "pageModules": pageModules[hidden != true]{ ${MODULES_FRAGMENT} }
  }
`);
