import { defineQuery } from "next-sanity";

/**
 * One legal page's editable content for a locale. Params: `$pageKey`
 * (mentions-legales / confidentialite / cookies / cgu / cgv) + `$locale`.
 * SEO comes from `siteMeta.<locale>.pageSeo`, not from here.
 */
export const legalPageQuery = defineQuery(`
  *[_type == "legalPage"
    && pageKey == $pageKey
    && coalesce(language, "en") == $locale][0]{
    title,
    lastUpdated,
    body
  }
`);
