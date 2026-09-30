---
title: "SEO metadata — titles, canonical, hreflang & OG"
description: "Every page's <head> is composed by one function: buildMetadata({ page, locale }) in src/lib/metadata.ts."
status: stable
---

# SEO metadata — titles, canonical, hreflang & OG

Every page's `<head>` is composed by one function: `buildMetadata({ page, locale })` in `src/lib/metadata.ts`. You never hand-write `<title>`, description, canonical, hreflang, or Open Graph tags.

The split that matters: **SEO copy is authored in Sanity, structure comes from config.** Title, description, keywords, OG image, per-page canonical, and `noIndex` live on each rendering document's `.seo` (the shared `seoMeta` object), resolved by `getPageSeo(pageId, locale)` — edited in the Studio (see [Editing SEO in Sanity](/projects/web/website/seo/editing-seo-in-sanity)). Canonical/hreflang URLs, robots defaults, and OG type/card come from `@indiecrafts/packages-shared-config`. There is **no `messages` or config fallback for SEO text** — a page whose document has no `.seo` emits no title/description override and the layout default applies. `buildMetadata` leaves the keys **out** in that case: Next merges metadata per key, so a present-but-`undefined` `title` would replace the layout default and ship the page with no `<title>`.

## Two entry points, one head

| Where                         | Function                                               | Emits                                                                                                                    |
| ----------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Each route's `page.tsx`       | `generateMetadata` → `buildMetadata({ page, locale })` | The page-specific head — title, description, canonical, hreflang, OG/twitter                                             |
| `src/app/[locale]/layout.tsx` | its own `generateMetadata`                             | Site-wide fallback — `metadataBase`, default title + template, `applicationName`, verification, favicon, default OG card |

Next.js merges the two; the page wins where they overlap. Both are async and read Sanity through `getSiteSeo(locale)` / `getSiteSettings()` (React-`cache()`d, so all consumers share one fetch per request).

## Where each field resolves

`buildMetadata` reads SEO copy from Sanity and layers structure from config. Resolution, per field:

| Field                             | Source (in precedence order)                                                            |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `title`                           | the document's `seo.title` (via `getPageSeo(id, locale)`) — Sanity only                 |
| `description`                     | `seo.description` — Sanity only                                                         |
| `keywords`                        | `seo.keywords` — Sanity comma-separated string, split to an array                       |
| OG image                          | `seo.image` → the locale's `siteMeta.<locale>.ogImage` → omitted (no `/public` card)    |
| twitter handle                    | `siteSettings.social.twitter` (`site` + `creator`), omitted when empty                  |
| canonical + hreflang              | built from `${site.url}` + the page's localized path (see below)                        |
| robots                            | `page.seo.robots` → site-wide Sanity toggle + per-page `noIndex` → `seoDefaults.robots` |
| OG type / siteName / twitter card | `seoDefaults` + Sanity `siteName`                                                       |

The layout builds the default title from Sanity: `siteName || DEFAULT_SITE_NAME` (`"indiecrafts.dev"`), layering the locale's tagline when present (`<siteName> — <tagline>`), under the template `%s · <siteName>`.

## Canonical + hreflang

`buildMetadata` builds `alternates.canonical` and `alternates.languages` from the page's `key` and the registered locales. Canonical resolves in this order:

1. The document's `seo.canonical` (Sanity, always a full URL) — used verbatim.
2. `page.seo.canonical` (config) as an absolute `http…` URL — used verbatim.
3. `page.seo.canonical` (config) as a `StaticAppPathname` key — resolved to `${site.url}${localized-path}`.
4. A `pathname` argument (passed by dynamic detail routes like blog posts) → `${site.url}${pathname}`.
5. Default: `${site.url}${localized-path-for-this-page-and-locale}`.

hreflang depends on whether the page exists in every locale:

- **Static routes** (in the `pages` map) exist in all locales → the full `languages` set is emitted, one entry per registered locale plus `x-default` pointing at the default locale.
- **Dynamic detail pages** pass a `pathname`; hreflang collapses to a single self-referencing entry + `x-default = canonical`, so you never falsely claim a translation that doesn't exist.

```html
<link rel="canonical" href="https://acme.com/blog" />
<link rel="alternate" hreflang="en" href="https://acme.com/blog" />
<link rel="alternate" hreflang="fr" href="https://acme.com/fr/blog" />
<link rel="alternate" hreflang="x-default" href="https://acme.com/blog" />
```

Localized slugs are honored automatically: a page whose `slug` is `{ en: "/legal", fr: "/mentions-legales" }` produces the right per-locale path in both canonical and hreflang.

::: warning `site.url` must be real
Until `NEXT_PUBLIC_SITE_URL` is set, `site.url` falls back to the `PLACEHOLDER_SITE_URL` sentinel (`https://example.com`) and every canonical/OG URL points at the placeholder domain. Set it per environment before you ship.
:::

## Open Graph + Twitter

`buildMetadata` re-emits the full OG + Twitter block per page. This is deliberate: Next.js **replaces** (does not deep-merge) `openGraph`/`twitter` when a page returns them, so siteName, type, and card have to be restated or they'd vanish.

- **OG image** — Sanity-only: the document's `seo.image` → the locale's `siteMeta.<locale>.ogImage` → omitted. Emitted at `1200×630`; `alt` falls back to `seo.image` alt → the site OG alt → the title.
- **OG type** — `page.seo.openGraph.type` (`"website" | "article" | "profile"`) or `seoDefaults.openGraph.type` (`"website"`). **Blog posts** override to `article` in their own `generateMetadata`, adding the `article:*` tags (`published_time` / `modified_time` / `author` / `section`) from the post's fields.
- **siteName** — always `siteSettings.siteName || DEFAULT_SITE_NAME`.
- **Twitter** — `card` from `seoDefaults.twitter.card` (`summary_large_image`); `site` + `creator` from `siteSettings.social.twitter`, both omitted cleanly when empty.

## Robots

Per page, robots resolve as: `page.seo.robots` (full config override) → otherwise the **site-wide Sanity toggle** (`siteSettings.robots` — `noindex` / `nofollow`) layered with per-page `noIndex` (the document's `seo.noIndex` or `page.seo.noindex`) → `seoDefaults.robots`. A non-technical editor can `noindex` / `nofollow` the whole site from the Studio (**SEO & métadonnées → Indexation**) — useful for a staging/holding site. Config defaults set `index: true, follow: true` plus a `max-image-preview: large`, `max-snippet: -1` googleBot block.

A `noindex` page also drops from the LLM endpoints automatically — see [LLM endpoints](/projects/web/website/seo/llms-endpoints).

## The `page.seo` overrides (config)

SEO **copy** lives in Sanity; `page.seo` in `code/packages/shared/config/src/index.ts` carries only **structural** overrides. Most pages need none — the defaults are enough. The wired fields (`PageSeo` in `@indiecrafts/packages-shared-config` `./types`):

| Field            | Purpose                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `canonical`      | Force a canonical — a static pathname key or an absolute `http…` URL                                               |
| `noindex`        | Shortcut for `robots: { index: false, follow: false }`                                                             |
| `robots`         | Full robots override (wins over `noindex`)                                                                         |
| `llms`           | `false` excludes the page from the LLM endpoints while keeping it indexed (`noindex` pages drop out automatically) |
| `openGraph.type` | Per-page OG type (`website` / `article` / `profile`)                                                               |
| `schemaImage`    | Per-page image(s) Google may show next to the result — see below                                                   |
| `structuredData` | Per-page JSON-LD blocks — see [Structured-data cookbook](/projects/web/website/seo/structured-data-cookbook)       |

### The image next to Google results (`schemaImage`)

The auto-emitted **WebPage** JSON-LD carries an `image` — the picture Google may show next to your result. `<PageSchemas>` resolves it in this order:

1. The document's `seo.schemaImage` — the Sanity per-page override
2. `page.seo.schemaImage` — the config per-page override
3. `seoDefaults.schemaImage` — the site-wide default (empty out of the box)
4. the page's OG image

So out of the box it reuses your OG image and you configure nothing. To set a **distinct** rich-result image — or several (Google recommends multiple aspect ratios: 16:9, 4:3, 1:1) — pass a path or an array:

```ts
// code/packages/shared/config/src/index.ts — site-wide default
seoDefaults.schemaImage = [
  "/brand/rich-16x9.png",
  "/brand/rich-4x3.png",
  "/brand/rich-1x1.png",
];

// or per page
pages.services.seo = { schemaImage: "/brand/services-card.png" };
```

Relative paths resolve against `site.url`; absolute `https://…` URLs are used as-is. A single value emits `image: "…"`; a list emits `image: ["…", "…"]`. (The **logo** in Google's knowledge panel is separate — it comes from the Organization JSON-LD `logo`, set by `siteSettings.brand.logo` in Sanity.)

## Adding SEO for a new page

Adding a route already covers SEO — there's no separate metadata step. The flow (full version in [new-client](/projects/web/website/setup/new-client)):

1. **Route** — `src/app/[locale]/<seg>/page.tsx`. Its `generateMetadata` calls `buildMetadata({ page: pages.<id>, locale })`; mount `<PageSchemas page={pages.<id>} locale={locale} />` in the body for JSON-LD.
2. **Config** — add an entry to `pages` in `code/packages/shared/config/src/index.ts`: `{ key, id, slug }` (plus `seo` only if you need a structural override).
3. **Types** — add the route's key to `STATIC_PATHNAME_KEYS` in `@indiecrafts/packages-shared-config` `./types`.
4. **Copy (optional)** — a new static route uses the layout default title/description + site-wide OG. To give it its own SEO, point `getPageSeo` (`src/lib/seo/site-seo.ts`) at a Sanity document that carries a `.seo` (the shared `seoMeta`), then fill that document's **SEO & visibilité** section — the pattern the home, blog, legal, waitlist and contact routes use.

Canonical, hreflang, OG, twitter, robots, the WebPage JSON-LD, sitemap entry, and llms.txt entry all derive from those four steps.

```tsx
// src/app/[locale]/pricing/page.tsx
import { pages } from "@indiecrafts/packages-shared-config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.pricing, locale });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DefaultLayout>
      <PageSchemas page={pages.pricing} locale={locale} />
      {/* … */}
    </DefaultLayout>
  );
}
```

::: tip Always `setRequestLocale`
Any server component that reads translations or builds metadata must call `setRequestLocale(locale)` first, or next-intl can't resolve the request locale during static rendering.
:::

## See also

- [Editing SEO in Sanity](/projects/web/website/seo/editing-seo-in-sanity) — where a non-technical editor authors all of the above
- [Structured-data cookbook](/projects/web/website/seo/structured-data-cookbook) — JSON-LD recipes (WebPage is auto-emitted; Article/Service/Product/FAQ per page)
- [FAQ](/projects/web/website/seo/faq) — per-page FAQ that auto-feeds FAQPage rich results
- [LLM endpoints](/projects/web/website/seo/llms-endpoints) — the `/llms.txt` family, driven by the same Sanity per-doc SEO (`seoMeta`)
- [Robots & environments](/projects/web/website/seo/robots-and-environments) — the site-wide index toggle and per-environment robots
