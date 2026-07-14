# SEO metadata — titles, canonical, hreflang & OG

Every page's `<head>` is composed by one function: `buildMetadata({ page, locale })` in `src/lib/metadata.ts`. You never hand-write `<title>`, `<meta description>`, canonical, hreflang, or Open Graph tags. You edit two places — `src/config/index.ts` (structure) and `messages/<locale>.json` (the words) — and the metadata falls out, correctly, in every locale.

This page explains the inheritance chain, what's translatable, and how to add SEO for a new page.

## The inheritance chain

`buildMetadata` composes four layers, lowest precedence first. Each layer only fills what the layer below it left open — it extends or overrides, never duplicates.

| #   | Layer                       | Source                               | Fills                                                                          |
| --- | --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| 1   | `site.*`                    | `config/index.ts` → `site`           | name, description, url, logo, social handles                                   |
| 2   | `seoDefaults.*`             | `config/index.ts` → `seoDefaults`    | title template, default robots, OG type + siteName, twitter card, verification |
| 3   | Auto-derived from `page.id` | the `pages.<id>` message tree        | `title`, `description`, `keywords`, OG image, canonical + hreflang             |
| 4   | `page.seo.*`                | `config/index.ts` → `pages.<id>.seo` | explicit overrides for any field above                                         |

Layer 3 is the one you touch most: give a page an `id` and write its copy under `messages.<locale>.pages.<id>.*`, and title/description/keywords/canonical are derived with zero extra config.

::: tip Two entry points, one builder
Each route's `generateMetadata` calls `buildMetadata({ page, locale })` for its page-specific head. The locale layout (`src/app/[locale]/layout.tsx`) has its own `generateMetadata` that emits the site-wide fallback (default title, `metadataBase`, verification tags, OG siteName). Next.js merges the two — the page wins where they overlap.
:::

## What's translatable

All human-facing SEO text is per-locale, read from `messages/<locale>.json`. Nothing is hard-coded in the config.

### Title

`buildMetadata` reads `messages.pages.<id>.title`. It renders inside the template from `seoDefaults.titleTemplate`:

```ts
// config/index.ts
seoDefaults = {
  titleTemplate: `%s · ${site.name}`, // "Pricing · indiecrafts.dev"
  defaultTitle: `${site.name} — ${site.tagline}`, // used when a page omits its title
  // …
};
```

```jsonc
// messages/en.json
"pages": { "home": { "title": "The config-first Next.js template" } }
```

```jsonc
// messages/fr.json
"pages": { "home": { "title": "Le template Next.js config-first" } }
```

If the message key is missing, `buildMetadata` falls back to `site.name` (it never throws — the `safeT` helper swallows the lookup error).

### Description

Same shape — `messages.pages.<id>.description`, falling back to `site.description`:

```jsonc
"pages": { "home": { "description": "A modular, SEO-ready Next.js template. Fork it, edit the config, ship." } }
```

### Keywords

Keywords are translatable too — a single **comma-separated string** under `messages.pages.<id>.keywords`. `buildMetadata` splits on commas, trims, and drops empties:

```jsonc
"pages": { "home": { "keywords": "next.js template, indiecrafts, config-first, modular website" } }
```

Leave the key out entirely (or make it empty) and no `<meta keywords>` is emitted. Nothing else to configure — no per-page flag, no config entry.

## Canonical + hreflang

`buildMetadata` builds `alternates.canonical` and `alternates.languages` from the page's key and the registered locales. You don't write URLs by hand.

**Canonical** resolves in this order:

1. `page.seo.canonical` if it's an absolute `http…` URL → used verbatim.
2. `page.seo.canonical` as a static pathname key → resolved to `${site.url}${localized-path}`.
3. A `pathname` argument (passed by dynamic detail routes like blog posts) → `${site.url}${pathname}`.
4. Default: `${site.url}${localized-path-for-this-page-and-locale}`.

**hreflang** depends on whether the page exists in every locale:

- **Static routes** (in the `pages` map) exist in all locales → the full `languages` set is emitted, one entry per registered locale plus an `x-default` pointing at the default locale.
- **Dynamic detail pages** (a blog post that only exists in one language) pass a `pathname`; hreflang collapses to a single self-referencing entry + `x-default = canonical`, so you never falsely claim a translation that doesn't exist.

```
<link rel="canonical" href="https://acme.com/blog" />
<link rel="alternate" hreflang="en" href="https://acme.com/blog" />
<link rel="alternate" hreflang="fr" href="https://acme.com/fr/blog" />
<link rel="alternate" hreflang="x-default" href="https://acme.com/blog" />
```

Localized slugs are honored automatically: a page whose `slug` is `{ en: "/legal", fr: "/mentions-legales" }` produces the right per-locale path in both canonical and hreflang.

::: warning `site.url` must be real
Until `NEXT_PUBLIC_SITE_URL` is set, `site.url` falls back to the `PLACEHOLDER_SITE_URL` sentinel and every canonical/OG URL points at the placeholder domain. Set it per environment before you ship.
:::

## Open Graph + Twitter

`buildMetadata` re-emits the full OG + Twitter block per page. This is deliberate: Next.js **replaces** (does not deep-merge) `openGraph`/`twitter` when a page returns them, so siteName, type, and card have to be restated from `seoDefaults` or they'd vanish.

- **OG image** — `page.seo.openGraph.imageUrl` if set, otherwise the always-available dynamic `/opengraph-image` route (a branded Satori card at `src/app/opengraph-image.tsx`). Ship a static per-page card by pointing `imageUrl` at a file, e.g. `/brand/og-home.png` — that's exactly what the home page does.
- **OG type** — `page.seo.openGraph.type` (`"website" | "article" | "profile"`) or `seoDefaults.openGraph.type`.
- **siteName** — always `seoDefaults.openGraph.siteName` (defaults to `site.name`).
- **Twitter** — `card` from `seoDefaults.twitter.card`; `site` + `creator` from `site.social.twitter` (the `@handle`), both omitted cleanly when the handle is empty.

```ts
// config/index.ts — a page shipping a static OG card
pages: {
  home: {
    key: "/",
    id: "home",
    slug: "/",
    seo: { openGraph: { imageUrl: "/brand/og-home.png" } },
  },
}
```

## Robots

Per page, robots resolve as: `page.seo.robots` (full override) → `page.seo.noindex` shortcut (`{ index: false, follow: false }`) → `seoDefaults.robots`. Site-wide defaults set `index: true, follow: true` plus a `max-image-preview: large` googleBot block.

Setting `noindex: true` also drops the page from the LLM endpoints automatically (see `seo.llms` below and `docs/seo/llms-endpoints.md`).

## The `page.seo` overrides

Most pages need none of these — the auto-derived defaults are enough. Reach for `seo` (`PageSeo` in `src/config/types.ts`) only for structural, non-text overrides:

| Field                                         | Purpose                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `titleKey` / `descriptionKey` / `keywordsKey` | Point at a different message key than the default `pages.<id>.*`                                             |
| `canonical`                                   | Force a canonical (a static pathname key, or an absolute `http…` URL)                                        |
| `noindex`                                     | Shortcut for `robots: { index: false, follow: false }`                                                       |
| `robots`                                      | Full robots override (wins over `noindex`)                                                                   |
| `llms`                                        | `false` excludes the page from `/llms.txt` while keeping it indexed (`noindex` pages drop out automatically) |
| `openGraph.type` / `openGraph.imageUrl`       | Per-page OG type + image                                                                                     |
| `structuredData`                              | Per-page JSON-LD blocks — see `docs/seo/structured-data-cookbook.md`                                         |

Human-facing text (title, description, keywords) belongs in `messages`, not here. Only structure lives in `seo`.

## Adding SEO for a new page

Adding a route already covers SEO — there's no separate metadata step. To recap the flow (full version in `docs/setup/new-client.md`):

1. **Route** — `src/app/[locale]/<seg>/page.tsx`. Its `generateMetadata` calls `buildMetadata({ page: pages.<id>, locale })`; mount `<PageSchemas page={pages.<id>} locale={locale} />` in the body for JSON-LD.
2. **Config** — add an entry to `pages` in `config/index.ts`: `{ key, id, slug }` (plus `seo` only if you need an override).
3. **Types** — add the route's key to `STATIC_PATHNAME_KEYS` in `src/config/types.ts`.
4. **Copy** — add `pages.<id>.title` + `pages.<id>.description` (and optionally `keywords`) to **every** `messages/<locale>.json`.

That's it. Canonical, hreflang, OG, twitter, robots, the WebPage JSON-LD, sitemap entry, and llms.txt entry all derive from those four steps.

```tsx
// src/app/[locale]/pricing/page.tsx
import { pages } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";

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

- `docs/seo/structured-data-cookbook.md` — JSON-LD recipes (WebPage is auto-emitted; Article/Service/Product/FAQ/etc. per page)
- `docs/seo/faq.md` — per-page FAQ that auto-feeds FAQPage rich results
- `docs/seo/llms-endpoints.md` — the `/llms.txt` family, driven by the same `pages.<id>.*` tree
