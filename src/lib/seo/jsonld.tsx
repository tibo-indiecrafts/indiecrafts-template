/**
 * Core JSON-LD — the schemas auto-emitted on every page. All gated by
 * `features.structuredData`.
 *
 * - `Organization` (or a LocalBusiness subtype, per `site.legal.businessType`)
 *   + `WebSite` from `buildSiteSchemas()` (locale layout).
 * - `WebPage` + `FAQPage` (the latter when the page has `faq` content) from
 *   `<PageSchemas>` (each route's page.tsx).
 *
 * Pages that need other schema (Article, Service, Product, Person, Breadcrumb)
 * import the relevant builder from `./jsonld-factories.tsx`, which is
 * tree-shaken out of the default bundle until referenced.
 */

import type { PageConfig } from "@/config";
import { features, globalSchemas, seoDefaults, site } from "@/config";
import { getTranslations } from "next-intl/server";
import { getStaticPathname } from "@/i18n/routing";
import type { Locale } from "@/config";
import type { MessageKey } from "@/types/messages";
import { pageOgImage } from "@/lib/metadata";
import { getFaqItems } from "@/lib/faq";
import { buildFAQPageSchema } from "./jsonld-factories";

// ── Shared helpers ───────────────────────────────────────────

type SchemaBase<T extends string> = {
  "@type": T;
  "@id"?: string;
};
export type SchemaObject = Record<string, unknown> & { "@type": string };

/** Strip keys whose values are empty strings, undefined, or empty objects. */
export function compact<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (
      typeof v === "object" &&
      !Array.isArray(v) &&
      Object.keys(v as object).length === 0
    )
      continue;
    out[k] = v;
  }
  return out as T;
}

// ── Organization ─────────────────────────────────────────────

export type JsonLdOrganization = SchemaBase<"Organization"> & {
  name: string;
  url: string;
  logo: string;
  sameAs?: readonly string[];
  foundingDate?: string;
  address?: Record<string, unknown>;
  contactPoint?: Record<string, unknown>;
};

/**
 * The site's primary entity. `site.legal.businessType` picks the schema.org
 * `@type`: `"Organization"` (neutral) or a LocalBusiness subtype — the latter
 * additionally emits geo / openingHours / priceRange / areaServed / telephone /
 * image from `site.legal`. Every field is dropped when empty, so a bare
 * Organization looks exactly as it did before any local fields were filled in.
 */
export function buildBusinessSchema(
  overrides: { description?: string } = {},
): SchemaObject {
  const legal = site.legal;
  const isLocal = legal.businessType !== "Organization";
  const sameAs = (Object.values(site.social) as string[]).filter(Boolean);
  const logo = `${site.url}${site.brandLogoPng ?? site.logo}`;

  const addr = compact({
    "@type": "PostalAddress" as const,
    streetAddress: legal.address.streetAddress,
    addressLocality: legal.address.addressLocality,
    addressRegion: legal.address.addressRegion,
    postalCode: legal.address.postalCode,
    addressCountry: legal.address.addressCountry,
  });
  const cp = compact({
    "@type": "ContactPoint" as const,
    telephone: legal.contactPoint.telephone,
    email: legal.contactPoint.email,
    contactType: legal.contactPoint.contactType,
  });

  // LocalBusiness-only extras (undefined → dropped by `compact`).
  const geo =
    isLocal && legal.geo.latitude && legal.geo.longitude
      ? {
          "@type": "GeoCoordinates" as const,
          latitude: legal.geo.latitude,
          longitude: legal.geo.longitude,
        }
      : undefined;
  const areaServed =
    isLocal && legal.areaServed.length
      ? legal.areaServed.map((name) => ({ "@type": "AdministrativeArea" as const, name }))
      : undefined;

  return compact({
    "@type": legal.businessType,
    "@id": `${site.url}#organization`,
    name: legal.company,
    description: overrides.description,
    url: site.url,
    logo,
    image: isLocal ? logo : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    foundingDate: legal.foundingDate || undefined,
    address: Object.keys(addr).length > 1 ? addr : undefined,
    contactPoint: Object.keys(cp).length > 2 ? cp : undefined,
    telephone: isLocal ? legal.contactPoint.telephone || undefined : undefined,
    geo,
    areaServed,
    openingHours:
      isLocal && legal.openingHours.length ? [...legal.openingHours] : undefined,
    priceRange: isLocal ? legal.priceRange || undefined : undefined,
  }) as SchemaObject;
}

/** @deprecated Use `buildBusinessSchema`. Kept as an alias for back-compat. */
export const buildOrganizationSchema = buildBusinessSchema;

// ── WebSite (with optional sitelinks search) ─────────────────

export type JsonLdWebSite = SchemaBase<"WebSite"> & {
  url: string;
  name: string;
  description?: string;
  publisher?: { "@id": string };
  potentialAction?: Record<string, unknown>;
};

export function buildWebSiteSchema(
  options: { description?: string; searchUrlTemplate?: string } = {},
): JsonLdWebSite {
  return compact({
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    description: options.description ?? site.description,
    publisher: { "@id": `${site.url}#organization` },
    potentialAction: options.searchUrlTemplate
      ? {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: options.searchUrlTemplate },
          "query-input": "required name=search_term_string",
        }
      : undefined,
  }) as JsonLdWebSite;
}

// ── WebPage (auto-emitted per page) ──────────────────────────

export function buildWebPageSchema(args: {
  id: string;
  url: string;
  locale: string;
  title: string;
  description?: string;
  image?: string | readonly string[];
}): SchemaObject {
  return compact({
    "@type": "WebPage",
    "@id": `${args.url}#webpage`,
    url: args.url,
    name: args.title,
    description: args.description,
    image: args.image,
    inLanguage: args.locale,
    isPartOf: { "@id": `${site.url}#website` },
  });
}

// ── Bundlers used by layout + page ───────────────────────────

export function buildSiteSchemas(
  options: { description?: string; searchUrlTemplate?: string } = {},
): SchemaObject[] {
  return [
    buildBusinessSchema({ description: options.description }),
    buildWebSiteSchema(options),
    ...(globalSchemas as SchemaObject[]),
  ];
}

function safeT(
  t: Awaited<ReturnType<typeof getTranslations>>,
  key: MessageKey,
  fallback: string,
): string {
  try {
    return t(key);
  } catch {
    return fallback;
  }
}

/**
 * Renders the auto-derived WebPage schema + anything in
 * `page.seo.structuredData`. Drop into each route's `page.tsx`:
 *
 *   <PageSchemas page={pages.home} locale={locale} />
 *
 * Dynamic detail routes pass `pathname` (their locale-aware slug path) so
 * the WebPage `@id`/`url` self-references instead of colliding on the
 * shared index route.
 */
export async function PageSchemas({
  page,
  locale,
  pathname,
}: Readonly<{ page: PageConfig; locale: Locale; pathname?: string }>) {
  if (!features.structuredData) return null;

  const t = await getTranslations({ locale });
  const titleKey = page.seo?.titleKey ?? (`pages.${page.id}.title` as MessageKey);
  const descriptionKey =
    page.seo?.descriptionKey ?? (`pages.${page.id}.description` as MessageKey);
  const title = safeT(t, titleKey, site.name);
  const description = safeT(t, descriptionKey, site.description);

  const path = pathname ?? getStaticPathname(page.key, locale);
  const url = `${site.url}${path}`;
  // The image(s) Google may show next to the result: explicit per-page
  // `schemaImage` > site `seoDefaults.schemaImage` > the page's OG image.
  // Each may be one path or a list; emit a string for one, an array for many.
  const toImageList = (v?: string | readonly string[]): string[] =>
    (Array.isArray(v) ? [...v] : v ? [v] : []).filter(Boolean);
  const pageImages = toImageList(page.seo?.schemaImage);
  const defaultImages = toImageList(seoDefaults.schemaImage);
  const schemaImages =
    pageImages.length > 0
      ? pageImages
      : defaultImages.length > 0
        ? defaultImages
        : [pageOgImage(page)];
  const toAbsolute = (src: string) =>
    src.startsWith("http") ? src : `${site.url}${src}`;
  const absoluteImages = schemaImages.map(toAbsolute);
  const image = absoluteImages.length === 1 ? absoluteImages[0] : absoluteImages;

  const webPage = buildWebPageSchema({
    id: page.id,
    url,
    locale,
    title,
    description,
    image,
  });

  const extras = (page.seo?.structuredData ?? []) as readonly SchemaObject[];

  // Auto-emit FAQPage rich-result markup from the page's translated `faq`
  // array — zero per-page config, in sync with what the <Faq> section shows.
  const faqItems = features.faq ? getFaqItems(t.raw, page.id) : [];
  const faqSchema: SchemaObject[] = faqItems.length ? [buildFAQPageSchema(faqItems)] : [];

  return <JsonLdScript data={[webPage, ...extras, ...faqSchema]} />;
}

// ── Script renderer ──────────────────────────────────────────

/**
 * Renders a JSON-LD <script>. Pass one schema or an array — multiple get
 * wrapped in `@graph` (one tag per page is preferred — saves bytes and lets
 * Google build a single connected graph). Data must be static/trusted.
 */
export function JsonLdScript({
  data,
}: Readonly<{ data: SchemaObject | readonly SchemaObject[] }>) {
  const body = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(body) }}
    />
  );
}
