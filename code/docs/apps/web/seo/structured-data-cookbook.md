# Structured data cookbook

JSON-LD recipes for the template. Two authoring surfaces feed the graph:

- **Non-technical, in the Studio** — `siteSettings.globalSchemas[]` (site-wide) and each document's `seo.structuredData[]` (per-page). A curated subset — Service / Product / Person / Event — mapped to JSON-LD by `buildGlobalSchemas`. No code. See [Editing SEO in Sanity](./editing-seo-in-sanity.md).
- **In config, with factories** — `pages.<id>.seo.structuredData[]` in `code/packages/shared/config/src/index.ts`, built with the `build*Schema(...)` factories from `@/lib/seo/jsonld-factories`. Use this for anything the Studio subset doesn't cover (Breadcrumb, Article, LocalBusiness-per-location, richer offers).

The `@id` fields chain into `Organization` (`${site.url}#organization`) and `WebSite` (`${site.url}#website`) so Google sees a single connected entity graph — keep the `@id` patterns intact when adapting.

## What's already emitted (no config)

Three schemas ship automatically — you only reach for this cookbook to add more:

- **`Organization`** (or a LocalBusiness subtype — see [Business type](#business-type-the-site-entity)) + **`WebSite`** — emitted site-wide by `buildSiteSchemas()` (`@/lib/seo/jsonld-core`) in the locale layout, from `siteSettings`.
- **`WebPage`** — emitted per route by `<PageSchemas page={pages.<id>} locale={locale} />` (`@/lib/seo/jsonld`), from the page's Sanity `.seo` (resolved by `getPageSeo`).
- **`FAQPage`** — auto-appended by `<PageSchemas>` when the page has a translated `faq` array in `messages` (gated by `features.faq`). See [FAQ](./faq.md); don't hand-write one for content-driven FAQs.

::: warning All JSON-LD is gated
Every schema on this page — auto-emitted and per-page — is gated by `features.structuredData` (`code/packages/shared/config/src/index.ts`). When it's off, `buildSiteSchemas()` and `<PageSchemas>` emit nothing.
:::

## Site-wide (`siteSettings.globalSchemas`)

Editor-picked entries in the Studio (**Paramètres du site → Infos Google en plus**) flow through `buildGlobalSchemas`, which maps the curated types below and attaches an `Offer` when both `price` + `priceCurrency` are set. Unknown types are skipped.

| Studio type | Factory              | Offer?                 |
| ----------- | -------------------- | ---------------------- |
| `Service`   | `buildServiceSchema` | yes (price + currency) |
| `Product`   | `buildProductSchema` | yes (price + currency) |
| `Person`    | `buildPersonSchema`  | —                      |
| `Event`     | raw `Event` object   | —                      |

For schema types outside this subset — or per-location `LocalBusiness`, breadcrumbs, articles — drop factory calls into config as below.

## Config factories (`pages.<id>.seo.structuredData`)

All factories live in `@/lib/seo/jsonld-factories`. Each returns a plain object with `@type` (and `@id` where it chains into the entity graph).

### FAQ — highest-ROI rich result

Google renders Q&A directly under the search result.

::: tip Prefer the content-driven path
For FAQs that belong to a page, put the Q&A in `messages.pages.<id>.faq` and mount `<Faq pageId="…">` — `<PageSchemas>` then emits the FAQPage automatically, in sync with the on-page accordion and llms.txt. See [FAQ](./faq.md). Use the manual factory below only for a FAQPage whose content isn't in the page's message tree, and never add both for the same page (you'd emit two FAQPage blocks).
:::

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
          { question: "How does pricing work?", answer: "Free for personal projects; team plans start at $29/mo." },
          { question: "Can I cancel anytime?", answer: "Yes — one click, prorated to the day." },
        ]),
      ],
    },
  },
}
```

### Breadcrumbs

```ts
import { buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { site } from "@indiecrafts/packages-shared-config";

structuredData: [
  buildBreadcrumbSchema([
    { name: "Home", url: `${site.url}/` },
    { name: "Services", url: `${site.url}/services` },
    { name: "Brand Identity", url: `${site.url}/services/brand-identity` },
  ]),
];
```

### Article / blog post

Blog posts already emit this — the post route calls `buildArticleSchema(...)`. Reach for it manually only on a non-blog page. `author` falls back to the Organization `@id` when `authorName` is omitted; `dateModified` defaults to `datePublished`.

```ts
import { buildArticleSchema } from "@/lib/seo/jsonld-factories";
import { site } from "@indiecrafts/packages-shared-config";

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

### Service (B2B / agency)

`provider` chains to the Organization `@id`; `offers` needs both `price` + `priceCurrency`.

```ts
import { buildServiceSchema } from "@/lib/seo/jsonld-factories";

structuredData: [
  buildServiceSchema({
    name: "Brand Identity Design",
    description: "Logo, type, and brand system.",
    serviceType: "Design",
    areaServed: "Worldwide",
    offers: { price: "5000", priceCurrency: "USD" },
  }),
];
```

### Product (e-commerce / SaaS)

`brand` accepts a string (→ `Brand`) or falls back to the Organization `@id`; `availability` is expanded to a `https://schema.org/…` URL.

```ts
import { buildProductSchema } from "@/lib/seo/jsonld-factories";
import { site } from "@indiecrafts/packages-shared-config";

structuredData: [
  buildProductSchema({
    name: "Hand-stitched Leather Notebook",
    description: "A5, vegetable-tanned leather cover, 192 pages.",
    sku: "NB-LTH-A5-001",
    image: `${site.url}/products/notebook-a5.jpg`,
    brand: "Indiecrafts",
    url: `${site.url}/shop/leather-notebook`,
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

### Team member (Person)

`worksFor` chains to the Organization `@id`.

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

### Multi-location business (per location)

For a single site-wide business, set the business type instead (see [Business type](#business-type-the-site-entity)). Use per-location `LocalBusiness` entries only when the brand has several physical addresses. `buildLocalBusinessSchema` fills `@id` from the `id` you pass and wraps `geo`.

```ts
import { buildLocalBusinessSchema } from "@/lib/seo/jsonld-factories";

structuredData: [
  buildLocalBusinessSchema({
    id: "paris-office",
    name: "Acme Paris",
    telephone: "+33-1-…",
    address: {
      "@type": "PostalAddress",
      streetAddress: "…",
      addressLocality: "Paris",
      postalCode: "75001",
      addressCountry: "FR",
    },
    geo: { latitude: 48.8566, longitude: 2.3522 },
    openingHours: ["Mo-Fr 09:00-18:00"],
  }),
];
```

### Collection / catalog page (raw object)

No factory needed — any object with `@type` is emitted verbatim.

```ts
import { site } from "@indiecrafts/packages-shared-config";

structuredData: [
  {
    "@type": "ItemList",
    name: "Shop",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: { "@id": `${site.url}#notebook` },
      },
      { "@type": "ListItem", position: 2, item: { "@id": `${site.url}#pen` } },
    ],
  },
];
```

## Business type — the site entity

The site-wide `Organization` schema (`buildBusinessSchema` in `@/lib/seo/jsonld-core`, `@id` `${site.url}#organization`) upgrades to a LocalBusiness subtype via `siteSettings.business.businessType` — a Studio select (**Paramètres du site → Votre activité**), not config. The options:

```text
"Organization" (default) · "LocalBusiness" · "ProfessionalService"
"HomeAndConstructionBusiness" · "LegalService" · "MedicalBusiness"
"FinancialService" · "Store" · "Restaurant" · "FoodEstablishment"
```

`"Organization"` emits a neutral entity. **Any other value** additionally pulls these from `siteSettings.business` — each dropped individually when left empty:

- `geo` (both `latitude` + `longitude` required, or the block is dropped)
- `openingHours`
- `priceRange`
- `areaServed` (emitted as `AdministrativeArea` entries)
- `telephone` + `image` (the raster logo)

So switching a client to a local/agency/practice type is a one-line Studio change plus filling in the business fields — no code.

## Tips

- **Validate before deploying.** Paste the rendered HTML into [Google's Rich Results Test](https://search.google.com/test/rich-results) to confirm Google parses your schema.
- **One `@graph` per page.** The layout and `<PageSchemas>` already emit two `<script>` blocks (site-wide + per-page), each wrapping multiple schemas in `@graph`. Don't add a third — the existing structure lets Google connect entities via `@id`.
- **Locale-aware fields.** `Organization.description` and `WebSite.description` are localized via the Sanity `siteMeta.<locale>.description`. Names/addresses/dates stay constant. Per-page WebPage schemas inherit the page's `.seo` automatically.
- **Script-safe output.** `JsonLdScript` HTML-escapes `<`, `>`, `&` before injecting, so CMS-authored copy can't break out of the `<script>` tag.
