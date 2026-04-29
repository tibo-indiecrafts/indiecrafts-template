/**
 * JSON-LD factories + @graph bundler.
 *
 * Factories produce typed schema objects; `composeGraph` bundles 1..N of them
 * into a single `<script>`; `JsonLdScript` renders it. Inspired by wahio.
 *
 * Extend the registry below when you need a new schema type:
 *   1. Add a `build<Name>Schema(args)` factory that returns a typed JsonLd<Name>
 *   2. Add its output type to the `JsonLdObject` union
 *   3. Optionally validate at boundaries via Zod — `zod` is already installed
 */

import type { PageConfig } from "@/config/pages/types";
import { siteConfig } from "@/config/site.config";

type SchemaBase<T extends string> = {
  "@type": T;
  "@id"?: string;
};

export type JsonLdOrganization = SchemaBase<"Organization"> & {
  name: string;
  url: string;
  logo: string;
  sameAs?: readonly string[];
};

export type JsonLdWebSite = SchemaBase<"WebSite"> & {
  url: string;
  name: string;
  description?: string;
  publisher?: { "@id": string };
};

export type JsonLdListItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

export type JsonLdBreadcrumbList = SchemaBase<"BreadcrumbList"> & {
  itemListElement: readonly JsonLdListItem[];
};

export type JsonLdArticle = SchemaBase<"Article"> & {
  headline: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  author?: { "@type": "Person" | "Organization"; name: string };
  image?: string | readonly string[];
};

export type JsonLdFaqPage = SchemaBase<"FAQPage"> & {
  mainEntity: ReadonlyArray<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
};

export type JsonLdWebPage = SchemaBase<"WebPage" | "AboutPage" | "ContactPage"> & {
  name: string;
  description?: string;
  url?: string;
};

/** Union of every typed schema we know how to author. */
export type JsonLdObject =
  | JsonLdOrganization
  | JsonLdWebSite
  | JsonLdBreadcrumbList
  | JsonLdArticle
  | JsonLdFaqPage
  | JsonLdWebPage;

/** Graph wrapper — used when >1 schema. A single schema stays ungraphed. */
export type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": readonly JsonLdObject[];
};

// ---- factories ----------------------------------------------------------

export function buildOrganizationSchema(): JsonLdOrganization {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.legal.company,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    sameAs: Object.values(siteConfig.social).filter((v): v is string => !!v),
  };
}

export function buildWebSiteSchema(): JsonLdWebSite {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}#organization` },
  };
}

export type Breadcrumb = { name: string; url: string };

export function buildBreadcrumbSchema(
  items: readonly Breadcrumb[],
): JsonLdBreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqPageSchema(
  items: readonly { question: string; answer: string }[],
): JsonLdFaqPage {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question" as const,
      name: i.question,
      acceptedAnswer: { "@type": "Answer" as const, text: i.answer },
    })),
  };
}

// ---- bundler ------------------------------------------------------------

/** Combine an arbitrary set of schemas into a single @graph JSON. */
export function composeGraph(
  schemas: readonly JsonLdObject[],
): JsonLdGraph | (JsonLdObject & { "@context": "https://schema.org" }) | null {
  if (schemas.length === 0) return null;
  if (schemas.length === 1) {
    return { "@context": "https://schema.org", ...schemas[0] };
  }
  return { "@context": "https://schema.org", "@graph": schemas };
}

/**
 * Build the schemas that belong in a single page's <head> — reads
 * `page.seo.structuredData[]` and returns a single graph or null.
 */
export function buildPageJsonLdGraph(page: PageConfig) {
  const extras = (page.seo?.structuredData ?? []) as readonly JsonLdObject[];
  return composeGraph(extras);
}

type ScriptProps = Readonly<{
  data: JsonLdObject | JsonLdGraph | null | ReturnType<typeof composeGraph>;
}>;

/** Renders a JSON-LD <script>. Data must be static/trusted (never user input). */
export function JsonLdScript({ data }: ScriptProps) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
