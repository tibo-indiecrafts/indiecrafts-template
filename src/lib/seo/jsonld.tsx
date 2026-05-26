/**
 * Core JSON-LD — only the schemas auto-emitted on every page.
 *
 * - `Organization` + `WebSite` from `buildSiteSchemas()` (locale layout).
 * - `WebPage` from `<PageSchemas>` (each route's page.tsx).
 *
 * Pages that need richer schema (Article, FAQPage, Service, Product,
 * LocalBusiness, Person, Breadcrumb) import the relevant builder from
 * `./jsonld-factories.tsx`. That file is tree-shaken out of the default
 * bundle until a page actually references it.
 */

import type { PageConfig } from "@/config";
import { globalSchemas, site } from "@/config";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/routing";
import type { Locale } from "@/config";
import type { MessageKey } from "@/types/messages";

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
    address: Object.keys(addr).length > 1 ? addr : undefined,
    contactPoint: Object.keys(cp).length > 2 ? cp : undefined,
  }) as JsonLdOrganization;
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

// ── Bundlers used by layout + page ───────────────────────────

export function buildSiteSchemas(
  options: { description?: string; searchUrlTemplate?: string } = {},
): SchemaObject[] {
  return [
    buildOrganizationSchema({ description: options.description }),
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
