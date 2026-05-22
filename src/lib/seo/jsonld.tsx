/**
 * JSON-LD factories. The locale layout always emits `Organization` +
 * `WebSite` + any `globalSchemas` from /config. Per-page schemas are
 * declared in `pageConfig.seo.structuredData[]` and rendered by the
 * `<PageSchemas>` helper from each route's `page.tsx`.
 *
 * Each factory returns a plain object with `"@type"` set. `JsonLdScript`
 * wraps one or many into a single `@graph` script tag (one tag per page is
 * preferred — saves bytes and lets Google build a single connected graph).
 */

import type { PageConfig } from "@/config";
import { globalSchemas, site } from "@/config";

// ── Generic shape ────────────────────────────────────────────

type SchemaBase<T extends string> = {
  "@type": T;
  "@id"?: string;
};
type SchemaObject = Record<string, unknown> & { "@type": string };

/** Strip keys whose values are empty strings, undefined, or empty objects. */
function compact<T extends Record<string, unknown>>(obj: T): T {
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

// ── Organization (always emitted) ────────────────────────────

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
 * @param overrides Pass `{ description }` from the locale layout (read
 *                  from `messages/<locale>.json`) to localize the Org
 *                  description. Other fields rarely need localization
 *                  (brand name, address, etc. usually stay constant).
 */
export function buildOrganizationSchema(
  overrides: { description?: string } = {},
): JsonLdOrganization {
  const sameAs = (Object.values(site.social) as string[]).filter(Boolean);
  const addr = compact({
    "@type": "PostalAddress" as const,
    streetAddress: site.legal.address.streetAddress,
    addressLocality: site.legal.address.addressLocality,
    addressRegion: site.legal.address.addressRegion,
    postalCode: site.legal.address.postalCode,
    addressCountry: site.legal.address.addressCountry,
  });
  const cp = compact({
    "@type": "ContactPoint" as const,
    telephone: site.legal.contactPoint.telephone,
    email: site.legal.contactPoint.email,
    contactType: site.legal.contactPoint.contactType,
  });
  return compact({
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.legal.company,
    description: overrides.description,
    url: site.url,
    logo: `${site.url}${site.brandLogoPng ?? site.logo}`,
    sameAs: sameAs.length ? sameAs : undefined,
    foundingDate: site.legal.foundingDate || undefined,
    // Only include address/contactPoint if at least one inner field was set.
    address: Object.keys(addr).length > 1 ? addr : undefined,
    contactPoint: Object.keys(cp).length > 2 ? cp : undefined,
  }) as JsonLdOrganization;
}

// ── WebSite (always emitted, with optional sitelinks search) ─

export type JsonLdWebSite = SchemaBase<"WebSite"> & {
  url: string;
  name: string;
  description?: string;
  publisher?: { "@id": string };
  potentialAction?: Record<string, unknown>;
};

/**
 * @param options.description    Locale-aware description (from messages).
 * @param options.searchUrlTemplate e.g. `"https://example.com/search?q={search_term_string}"`
 *                                — when provided, Google can show a sitelinks search box.
 */
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
          target: {
            "@type": "EntryPoint",
            urlTemplate: options.searchUrlTemplate,
          },
          "query-input": "required name=search_term_string",
        }
      : undefined,
  }) as JsonLdWebSite;
}

// ── BreadcrumbList (per-page) ────────────────────────────────

export function buildBreadcrumbSchema(items: readonly { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  } as const;
}

// ── Article / BlogPosting (per-page) ─────────────────────────

export function buildArticleSchema(args: {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  url: string;
}): SchemaObject {
  return compact({
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: args.authorName
      ? { "@type": "Person", name: args.authorName }
      : { "@id": `${site.url}#organization` },
    publisher: { "@id": `${site.url}#organization` },
    image: args.image,
    mainEntityOfPage: args.url,
  });
}

// ── FAQPage (per-page) ───────────────────────────────────────

export function buildFAQPageSchema(
  items: readonly { question: string; answer: string }[],
): SchemaObject {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

// ── Service (per-page) — B2B / agency essential ──────────────

export function buildServiceSchema(args: {
  name: string;
  description?: string;
  serviceType?: string;
  areaServed?: string;
  url?: string;
  offers?: { price: string; priceCurrency: string };
}): SchemaObject {
  return compact({
    "@type": "Service",
    name: args.name,
    description: args.description,
    serviceType: args.serviceType,
    areaServed: args.areaServed,
    url: args.url,
    provider: { "@id": `${site.url}#organization` },
    offers: args.offers
      ? {
          "@type": "Offer",
          price: args.offers.price,
          priceCurrency: args.offers.priceCurrency,
        }
      : undefined,
  });
}

// ── Product (e-commerce / SaaS plans / packaged offerings) ──

export function buildProductSchema(args: {
  name: string;
  description?: string;
  image?: string;
  sku?: string;
  brand?: string;
  url?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder" | "Discontinued";
    url?: string;
  };
  aggregateRating?: { ratingValue: number; reviewCount: number };
}): SchemaObject {
  return compact({
    "@type": "Product",
    name: args.name,
    description: args.description,
    image: args.image,
    sku: args.sku,
    brand: args.brand
      ? { "@type": "Brand", name: args.brand }
      : { "@id": `${site.url}#organization` },
    url: args.url,
    offers: args.offers
      ? {
          "@type": "Offer",
          price: args.offers.price,
          priceCurrency: args.offers.priceCurrency,
          availability: args.offers.availability
            ? `https://schema.org/${args.offers.availability}`
            : undefined,
          url: args.offers.url,
        }
      : undefined,
    aggregateRating: args.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: args.aggregateRating.ratingValue,
          reviewCount: args.aggregateRating.reviewCount,
        }
      : undefined,
  });
}

// ── LocalBusiness (per-location) ─────────────────────────────

export function buildLocalBusinessSchema(args: {
  id: string;
  name: string;
  url?: string;
  telephone?: string;
  address?: Record<string, unknown>;
  geo?: { latitude: number; longitude: number };
  openingHours?: readonly string[];
}): SchemaObject {
  return compact({
    "@type": "LocalBusiness",
    "@id": `${site.url}#${args.id}`,
    name: args.name,
    url: args.url ?? site.url,
    telephone: args.telephone,
    address: args.address,
    geo: args.geo ? { "@type": "GeoCoordinates", ...args.geo } : undefined,
    openingHoursSpecification: args.openingHours,
  });
}

// ── Person (team pages) ──────────────────────────────────────

export function buildPersonSchema(args: {
  name: string;
  jobTitle?: string;
  image?: string;
  url?: string;
  sameAs?: readonly string[];
}): SchemaObject {
  return compact({
    "@type": "Person",
    name: args.name,
    jobTitle: args.jobTitle,
    image: args.image,
    url: args.url,
    sameAs: args.sameAs,
    worksFor: { "@id": `${site.url}#organization` },
  });
}

// ── Site-wide bundler used by the locale layout ──────────────

/**
 * Site-wide JSON-LD bundle (Organization + WebSite + globalSchemas).
 *
 * Pass a locale-aware description (read from `messages/<locale>.json`) to
 * localize the Org + WebSite descriptions. Other entity fields (name,
 * address, foundingDate, etc.) usually don't translate.
 *
 *   const t = await getTranslations({ locale });
 *   const description = safeT(t, "site.description", site.description);
 *   <JsonLdScript data={buildSiteSchemas({ description })} />
 */
export function buildSiteSchemas(
  options: { description?: string; searchUrlTemplate?: string } = {},
): SchemaObject[] {
  return [
    buildOrganizationSchema({ description: options.description }),
    buildWebSiteSchema(options),
    ...(globalSchemas as SchemaObject[]),
  ];
}

// ── WebPage (auto-emitted per page) ──────────────────────────

/**
 * Auto-derive a WebPage schema from a PageConfig. Inherits:
 *   - name        → t(`pages.<id>.title`)
 *   - description → t(`pages.<id>.description`)
 *   - url         → `${site.url}${slug}` (locale-aware via canonical)
 *   - image       → `/brand/og-<id>.png`
 *   - inLanguage  → locale
 *   - isPartOf    → @id of the WebSite schema (links into the graph)
 */
export function buildWebPageSchema(args: {
  id: string;
  url: string;
  locale: string;
  title: string;
  description?: string;
  image?: string;
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

// ── Per-page helper used by each route's page.tsx ────────────

import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/routing";
import type { Locale } from "@/config";
import type { MessageKey } from "@/types/messages";

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
 * Renders all per-page JSON-LD: an auto-derived WebPage schema (inherited
 * from `page.seo` + i18n keys) PLUS anything in `page.seo.structuredData`.
 *
 * Drop into each route's `page.tsx`:
 *   `<PageSchemas page={pages.home} locale={locale} />`
 */
export async function PageSchemas({
  page,
  locale,
}: Readonly<{ page: PageConfig; locale: Locale }>) {
  const t = await getTranslations({ locale });
  const titleKey = page.seo?.titleKey ?? (`pages.${page.id}.title` as MessageKey);
  const descriptionKey =
    page.seo?.descriptionKey ?? (`pages.${page.id}.description` as MessageKey);
  const title = safeT(t, titleKey, site.name);
  const description = safeT(t, descriptionKey, site.description);

  // Build a locale-aware URL. Cast through any because getPathname's
  // generic prefers an AppPathname literal.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pathname = getPathname({ href: page.key as any, locale: locale as any });
  const url = `${site.url}${pathname}`;
  const imageUrl = page.seo?.openGraph?.imageUrl ?? `/brand/og-${page.id}.png`;
  const image = imageUrl.startsWith("http") ? imageUrl : `${site.url}${imageUrl}`;

  const webPage = buildWebPageSchema({
    id: page.id,
    url,
    locale,
    title,
    description,
    image,
  });

  const extras = (page.seo?.structuredData ?? []) as readonly SchemaObject[];
  return <JsonLdScript data={[webPage, ...extras]} />;
}

// ── Script renderer ──────────────────────────────────────────

/**
 * Renders a JSON-LD <script>. Pass one schema or an array — multiple get
 * wrapped in `@graph` (one script tag per page is preferred).
 * Data must be static/trusted (never user input).
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
