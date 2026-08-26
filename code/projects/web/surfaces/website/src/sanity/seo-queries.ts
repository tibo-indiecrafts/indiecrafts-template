import { defineQuery } from "next-sanity";

/**
 * Core SEO GROQ queries — feature-independent (not under `features/blog`) so
 * site-wide SEO survives with the blog removed. `defineQuery` flags them for
 * `sanity typegen`. Consumed by `src/lib/seo/site-seo.ts`.
 */

/**
 * Per-locale site-wide SEO defaults (`siteMeta.<lang>`). Param `id =
 * "siteMeta.<locale>"`. Image fields resolve to their CDN url. Null when the doc
 * is absent. Per-page SEO is NOT here — each rendering doc carries its own `.seo`
 * (`seoMeta`), resolved by `getPageSeo` (`src/lib/seo/site-seo.ts`).
 */
export const siteSeoQuery = defineQuery(`
  *[_id == $id][0]{
    tagline,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    "ogImageAlt": ogImage.alt,
    llms{
      summary,
      paragraph,
      full,
      reviewedAt,
      sectionOrder,
      "resources": resources[]{ name, href }
    }
  }
`);

/**
 * The shared `seoMeta` shape — the ONE per-page SEO model, projected from any
 * doc's `.seo`. Kept in sync with the `seoMeta` schema (`@indiecrafts/packages-web-schema`).
 */
const SEO_META_PROJECTION = `
  title,
  description,
  keywords,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "schemaImage": schemaImage.asset->url,
  canonical,
  noIndex,
  llmsSection,
  llmsSummary,
  llmsFull,
  "structuredData": structuredData[]{
    schemaType,
    name,
    description,
    url,
    "image": image.asset->url,
    price,
    priceCurrency
  }
`;

/** Home page SEO — the `page` doc with `isHome` on, for one locale. */
export const homeSeoQuery = defineQuery(`
  *[_type == "page" && isHome == true && language == $locale][0].seo{
    ${SEO_META_PROJECTION}
  }
`);

/**
 * Blog singleton SEO — the `/blog` frontpage (`seo`) plus the taxonomy
 * list-page overrides (`indexSeo.{author,category,tag}`). The blog singleton is
 * shared across locales, so no `$locale` param.
 */
export const blogSeoQuery = defineQuery(`
  *[_type == "blog"][0]{
    "seo": seo{ ${SEO_META_PROJECTION} },
    "author": indexSeo.author{ ${SEO_META_PROJECTION} },
    "category": indexSeo.category{ ${SEO_META_PROJECTION} },
    "tag": indexSeo.tag{ ${SEO_META_PROJECTION} }
  }
`);

/** One legal page's SEO — `legalPage` by `$pageKey` + locale. */
export const legalSeoQuery = defineQuery(`
  *[_type == "legalPage" && pageKey == $pageKey && coalesce(language, "en") == $locale][0].seo{
    ${SEO_META_PROJECTION}
  }
`);

/** Waitlist landing SEO — the `waitlistSettings` singleton's `.seo`. */
export const waitlistSeoQuery = defineQuery(`
  *[_type == "waitlistSettings"][0].seo{
    ${SEO_META_PROJECTION}
  }
`);

/**
 * Language-independent site settings singleton (`siteSettings`) — social,
 * business entity / structured-data fields, extra global schemas.
 */
/**
 * System-page copy (maintenance + 404) for one locale. Param `id =
 * "siteMeta.<locale>"`. Consumed by `getSystemPages` (`src/lib/system-pages.ts`),
 * which falls back to `messages/<locale>.json` per field.
 */
export const systemPagesQuery = defineQuery(`
  *[_id == $id][0].systemPages{
    maintenance{ status, title, body, contact },
    notFound{ eyebrow, title, description, homeLabel }
  }
`);

/**
 * Taxonomy-index page copy (category / tag / author listing pages) for one
 * locale. Param `id = "siteMeta.<locale>"`. Read by `getTaxonomyPages`
 * (`src/lib/system-pages.ts`), which falls back to `messages` per field.
 */
export const taxonomyPagesQuery = defineQuery(`
  *[_id == $id][0].taxonomyPages{
    category{ heading, subheading, empty },
    tag{ heading, subheading, empty },
    author{ heading, subheading, empty }
  }
`);

/**
 * Version-update banner copy for one locale. Param `id = "siteMeta.<locale>"`.
 * Read by `getVersionPrompt` (`src/lib/system-pages.ts`); NO `messages` fallback
 * — an unset banner is simply off.
 */
export const versionPromptQuery = defineQuery(`
  *[_id == $id][0].versionPrompt{ message, reload, dismiss }
`);

export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    siteName,
    "logo": logo.asset->url,
    "logoDark": logoDark.asset->url,
    "icon": icon.asset->url,
    social,
    businessType,
    company,
    legalName,
    alternateName,
    foundingDate,
    address,
    contactPoint,
    geo,
    priceRange,
    openingHours,
    areaServed,
    robots,
    verification,
    analytics{ googleAnalyticsId, requireCookieConsent },
    share{ enabled, x, linkedin, facebook, copyLink },
    themeModes,
    showLocaleSwitcher,
    showStructuredData,
    showFaq,
    madeBy,
    "schemaImage": schemaImage.asset->url,
    "globalSchemas": globalSchemas[]{
      schemaType,
      name,
      description,
      url,
      "image": image.asset->url,
      price,
      priceCurrency
    }
  }
`);
