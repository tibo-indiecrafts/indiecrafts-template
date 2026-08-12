/**
 * JSON-LD schema builders + shared primitives — the non-component core of the
 * SEO layer. Lives apart from `jsonld.tsx` so that file exports only React
 * components (Fast Refresh safety, react-doctor only-export-components) and so
 * `jsonld-factories.tsx` can share `compact` / `SchemaObject` without importing
 * the component module (which would form an import cycle).
 */

import { site } from "@indiecrafts/config";
import { DEFAULT_SITE_NAME, type SiteSettings } from "@/lib/seo/site-seo";
import { socialLinks } from "@/lib/social";

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
 * The site's primary entity. `settings.business.businessType` picks the schema.org
 * `@type`: `"Organization"` (neutral) or a LocalBusiness subtype — the latter
 * additionally emits geo / openingHours / priceRange / areaServed / telephone /
 * image from `settings.business`. Every field is dropped when empty, so a bare
 * Organization looks exactly as it did before any local fields were filled in.
 */
export function buildBusinessSchema(
  settings: SiteSettings,
  overrides: { description?: string } = {},
): SchemaObject {
  const b = settings.business;
  const businessType = b.businessType || "Organization";
  const isLocal = businessType !== "Organization";
  // `sameAs` = the same profile URLs the footer follow block renders (one source,
  // via `socialLinks` — twitter `@handle` already converted to its profile URL).
  const sameAs = socialLinks(settings.social).map((l) => l.url);
  // Organization logo — the Sanity brand logo (absolute CDN URL). Omitted when
  // unset (no static fallback).
  const logo = settings.brand.logo;
  const addr = compact({
    "@type": "PostalAddress" as const,
    streetAddress: b.address?.streetAddress,
    addressLocality: b.address?.addressLocality,
    addressRegion: b.address?.addressRegion,
    postalCode: b.address?.postalCode,
    addressCountry: b.address?.addressCountry,
  });
  const cp = compact({
    "@type": "ContactPoint" as const,
    telephone: b.contactPoint?.telephone,
    email: b.contactPoint?.email,
    contactType: b.contactPoint?.contactType,
  });

  // LocalBusiness-only extras (undefined → dropped by `compact`).
  const geo =
    isLocal && b.geo?.latitude && b.geo?.longitude
      ? {
          "@type": "GeoCoordinates" as const,
          latitude: b.geo.latitude,
          longitude: b.geo.longitude,
        }
      : undefined;
  const areaServed =
    isLocal && b.areaServed.length
      ? b.areaServed.map((name) => ({ "@type": "AdministrativeArea" as const, name }))
      : undefined;

  return compact({
    "@type": businessType,
    "@id": `${site.url}#organization`,
    name: b.company,
    legalName: b.legalName || undefined,
    alternateName: b.alternateName || undefined,
    description: overrides.description,
    url: site.url,
    logo,
    image: isLocal ? logo : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    foundingDate: b.foundingDate || undefined,
    address: Object.keys(addr).length > 1 ? addr : undefined,
    contactPoint: Object.keys(cp).length > 2 ? cp : undefined,
    telephone: isLocal ? b.contactPoint?.telephone || undefined : undefined,
    geo,
    areaServed,
    openingHours: isLocal && b.openingHours.length ? [...b.openingHours] : undefined,
    priceRange: isLocal ? b.priceRange || undefined : undefined,
  }) as SchemaObject;
}

// ── WebSite (with optional sitelinks search) ─────────────────

export type JsonLdWebSite = SchemaBase<"WebSite"> & {
  url: string;
  name: string;
  description?: string;
  publisher?: { "@id": string };
  potentialAction?: Record<string, unknown>;
};

export function buildWebSiteSchema(
  options: { name: string; description?: string; searchUrlTemplate?: string },
): JsonLdWebSite {
  return compact({
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: options.name,
    description: options.description,
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
  settings: SiteSettings,
  options: { description?: string; searchUrlTemplate?: string } = {},
  extraSchemas: readonly SchemaObject[] = [],
): SchemaObject[] {
  return [
    buildBusinessSchema(settings, { description: options.description }),
    buildWebSiteSchema({ ...options, name: settings.siteName || DEFAULT_SITE_NAME }),
    ...extraSchemas,
  ];
}
