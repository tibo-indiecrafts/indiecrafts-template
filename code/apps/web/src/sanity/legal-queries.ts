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

/**
 * The privacy-policy page's last-updated date — stamped on newsletter/waitlist
 * opt-ins as proof of which policy version the person consented to (GDPR). `null`
 * when no privacy `legalPage` exists yet.
 */
export const consentPolicyVersionQuery = defineQuery(`
  *[_type == "legalPage" && pageKey == "confidentialite"] | order(lastUpdated desc)[0].lastUpdated
`);
