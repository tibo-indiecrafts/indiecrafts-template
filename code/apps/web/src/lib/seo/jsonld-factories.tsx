/**
 * On-demand JSON-LD factories — import only from pages that actually use
 * the relevant schema. None of these are auto-emitted by the layout or
 * `<PageSchemas>`. Add to a page via `pageConfig.seo.structuredData[]`:
 *
 *   pages: {
 *     pricing: {
 *       …,
 *       seo: {
 *         structuredData: [
 *           buildFAQPageSchema([
 *             { question: "…", answer: "…" },
 *           ]),
 *         ],
 *       },
 *     },
 *   }
 *
 * The `@id` fields chain into `Organization` / `WebSite` so Google sees a
 * single connected entity graph.
 */

import { site } from "@/config";
import type { SiteSettings } from "@/lib/seo/site-seo";
import { compact, type SchemaObject } from "./jsonld-core";

// ── BreadcrumbList ───────────────────────────────────────────

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

// ── Article / BlogPosting ────────────────────────────────────

export function buildArticleSchema(args: {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  authorNames?: string[];
  image?: string;
  url: string;
}): SchemaObject {
  const authors = (args.authorNames ?? []).filter(Boolean);
  return compact({
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    // One author → a single Person; several → an array; none → the org.
    author:
      authors.length === 0
        ? { "@id": `${site.url}#organization` }
        : authors.length === 1
          ? { "@type": "Person", name: authors[0] }
          : authors.map((name) => ({ "@type": "Person", name })),
    publisher: { "@id": `${site.url}#organization` },
    image: args.image,
    mainEntityOfPage: args.url,
  });
}

// ── FAQPage — highest-ROI rich result ────────────────────────

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

// ── Service (B2B / agency) ───────────────────────────────────

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

// ── Product (e-commerce / SaaS) ──────────────────────────────

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

// ── LocalBusiness (per location) ─────────────────────────────

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

// ── Global schemas (editor-picked, from `siteSettings.globalSchemas`) ──

/**
 * Map the Studio-authored `siteSettings.globalSchemas[]` entries to JSON-LD via
 * the factories above. A curated subset — Service / Product / Person / Event.
 * `Offer` is attached when a `price` is set (Service / Product). Unknown types
 * are skipped.
 */
export function buildGlobalSchemas(
  entries: SiteSettings["globalSchemas"],
): SchemaObject[] {
  // Both price + currency required for a valid Offer — skip when either is blank.
  const offers = (e: SiteSettings["globalSchemas"][number]) =>
    e.price && e.priceCurrency
      ? { price: e.price, priceCurrency: e.priceCurrency }
      : undefined;

  return entries.flatMap((e) => {
    switch (e.schemaType) {
      case "Service":
        return [
          buildServiceSchema({
            name: e.name,
            description: e.description,
            url: e.url,
            areaServed: undefined,
            offers: offers(e),
          }),
        ];
      case "Product":
        return [
          buildProductSchema({
            name: e.name,
            description: e.description,
            image: e.image,
            url: e.url,
            offers: offers(e),
          }),
        ];
      case "Person":
        return [
          buildPersonSchema({
            name: e.name,
            image: e.image,
            url: e.url,
          }),
        ];
      case "Event":
        return [
          compact({
            "@type": "Event",
            name: e.name,
            description: e.description,
            image: e.image,
            url: e.url,
          }),
        ];
      default:
        return [];
    }
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
