# Structured data cookbook

Copy-paste JSON-LD recipes. Drop site-wide entries into `globalSchemas` (`src/config/index.ts`); per-page entries into `pages.<id>.seo.structuredData`. All factories live in `@/lib/seo/jsonld-factories`.

The `@id` fields chain into `Organization` and `WebSite` so Google sees a single connected entity graph — keep the `@id` patterns intact when adapting.

## Site-wide (`globalSchemas`)

### Multi-location agency / business

```ts
import { site } from "@/config";

globalSchemas: [
  {
    "@type": "LocalBusiness",
    "@id": `${site.url}#paris-office`,
    name: "Acme Paris",
    address: {
      "@type": "PostalAddress",
      streetAddress: "…",
      addressLocality: "Paris",
      postalCode: "75001",
      addressCountry: "FR",
    },
    telephone: "+33-1-…",
    openingHoursSpecification: ["Mo-Fr 09:00-18:00"],
  },
];
```

### Service catalog (B2B / agency)

```ts
import { buildServiceSchema } from "@/lib/seo/jsonld-factories";

globalSchemas: [
  buildServiceSchema({
    name: "Brand Identity Design",
    description: "Logo, type, and brand system.",
    serviceType: "Design",
    areaServed: "Worldwide",
    offers: { price: "5000", priceCurrency: "USD" },
  }),
];
```

### SaaS / packaged product

```ts
import { buildProductSchema } from "@/lib/seo/jsonld-factories";

globalSchemas: [
  buildProductSchema({
    name: "Indiecrafts Template Pro",
    description: "Full template + 1 year of updates.",
    sku: "ICT-PRO-001",
    offers: {
      price: "299",
      priceCurrency: "USD",
      availability: "InStock",
    },
    aggregateRating: { ratingValue: 4.9, reviewCount: 42 },
  }),
];
```

### Physical product (e-commerce)

```ts
import { buildProductSchema } from "@/lib/seo/jsonld-factories";
import { site } from "@/config";

globalSchemas: [
  buildProductSchema({
    name: "Hand-stitched Leather Notebook",
    description: "A5, vegetable-tanned leather cover, 192 pages.",
    sku: "NB-LTH-A5-001",
    image: `${site.url}/products/notebook-a5.jpg`,
    brand: "Indiecrafts",
    offers: {
      price: "48.00",
      priceCurrency: "EUR",
      availability: "InStock",
      url: `${site.url}/shop/leather-notebook`,
    },
    aggregateRating: { ratingValue: 4.8, reviewCount: 127 },
  }),
];
```

## Per-page (`pages.<id>.seo.structuredData`)

### FAQ — highest-ROI rich result

Google renders Q&A directly under the search result. Add to any page with a FAQ section.

```ts
import { buildFAQPageSchema } from "@/lib/seo/jsonld-factories";

pages: {
  pricing: {
    key: "/pricing",
    id: "pricing",
    slug: "/pricing",
    seo: {
      structuredData: [
        buildFAQPageSchema([
          {
            question: "How does pricing work?",
            answer: "Free for personal projects; team plans start at $29/mo.",
          },
          {
            question: "Can I cancel anytime?",
            answer: "Yes — one click, prorated to the day.",
          },
        ]),
      ],
    },
  },
}
```

### Breadcrumbs

```ts
import { buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { site } from "@/config";

structuredData: [
  buildBreadcrumbSchema([
    { name: "Home", url: `${site.url}/` },
    { name: "Services", url: `${site.url}/services` },
    { name: "Brand Identity", url: `${site.url}/services/brand-identity` },
  ]),
];
```

### Article / blog post

```ts
import { buildArticleSchema } from "@/lib/seo/jsonld-factories";
import { site } from "@/config";

structuredData: [
  buildArticleSchema({
    headline: "Shipping client sites in a weekend",
    description: "How we cut delivery time from 3 weeks to 3 days.",
    datePublished: "2026-01-15",
    dateModified: "2026-02-08",
    authorName: "Ada Lovelace",
    image: `${site.url}/brand/og-blog-shipping.png`,
    url: `${site.url}/blog/shipping-client-sites-fast`,
  }),
];
```

### Team member (Person)

```ts
import { buildPersonSchema } from "@/lib/seo/jsonld-factories";

structuredData: [
  buildPersonSchema({
    name: "Ada Lovelace",
    jobTitle: "Founder",
    image: "https://acme.com/team/ada.jpg",
    url: "https://acme.com/team/ada",
    sameAs: ["https://twitter.com/ada"],
  }),
];
```

### Collection / catalog page

```ts
import { site } from "@/config";

structuredData: [
  {
    "@type": "ItemList",
    name: "Shop",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: { "@id": `${site.url}#notebook` } },
      { "@type": "ListItem", position: 2, item: { "@id": `${site.url}#pen` } },
    ],
  },
];
```

## Tips

- **Validate before deploying.** Paste the rendered HTML into [Google's Rich Results Test](https://search.google.com/test/rich-results) to confirm Google parses your schema.
- **One `@graph` per page.** The layout and `<PageSchemas>` already emit two `@graph` scripts (site-wide + per-page). Don't add a third — the existing structure lets Google connect entities via `@id`.
- **Locale-aware fields.** `Organization.description` and `WebSite.description` are localized via `messages.<locale>.site.description`. Names/addresses/dates stay constant. Per-page WebPage schemas inherit `messages.<locale>.pages.<id>.*` automatically.
