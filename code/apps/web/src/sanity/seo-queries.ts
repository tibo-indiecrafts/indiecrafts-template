import { defineQuery } from "next-sanity";

/**
 * Core SEO GROQ queries — feature-independent (not under `features/blog`) so
 * site-wide SEO survives with the blog removed. `defineQuery` flags them for
 * `sanity typegen`. Consumed by `src/lib/seo/site-seo.ts`.
 */

/**
 * Per-locale SEO singleton (`siteMeta.<lang>`). Param `id = "siteMeta.<locale>"`.
 * Image fields resolve to their CDN url. Null when the doc is absent.
 */
export const siteSeoQuery = defineQuery(`
  *[_id == $id][0]{
    tagline,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    "ogImageAlt": ogImage.alt,
    "pageSeo": pageSeo[]{
      pageId,
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url,
      "ogImageAlt": ogImage.alt,
      "schemaImage": schemaImage.asset->url,
      canonical,
      noindex,
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
    },
    llms{
      summary,
      paragraph,
      full,
      "resources": resources[]{ name, href }
    }
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
