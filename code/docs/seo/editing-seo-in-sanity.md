# Editing SEO in Sanity

The site's SEO surface is **edited in the Studio, per language** — not in code.
Two singletons under **Studio → SEO & métadonnées** are the **sole runtime
source** for it. There is **no config/messages fallback**: a field left empty in
Sanity is simply empty on the site (the framework default applies), and the
`pnpm seed` demo populates both singletons so a seeded dataset is complete.

## The two documents

### `siteMeta.<locale>` — per-language SEO (one per locale)

Everything that changes per language:

| Field                                  | Drives                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slogan** (`tagline`)                 | `/llms.txt` blockquote                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Description du site**                | site-wide default `<meta description>`, `/llms.txt`                                                                                                                                                                                                                                                                                                                                                                                          |
| **Mots-clés du site**                  | site-level keywords                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Image Open Graph**                   | the share card for this language (`og:image`)                                                                                                                                                                                                                                                                                                                                                                                                |
| **Pages de listing** (`taxonomyPages`) | the category / tag / author **index** pages' copy (heading, subheading, empty message), per taxonomy. Falls back to `messages` per field                                                                                                                                                                                                                                                                                                     |
| **Pages système** (`systemPages`)      | the maintenance + 404 page copy (title, message, labels). The 500 error page stays on `messages` — see below                                                                                                                                                                                                                                                                                                                                 |
| **SEO par page** (`pageSeo[]`)         | full per-page override — pick the page from the dropdown, then set any of: `<title>`, description, keywords, OG share card (+ alt), rich-result image, **canonical URL**, **noindex**, **page-specific structured data** (Service / Product / Person / Event), a short **`llmsSummary`** for the `/llms.txt` index (a few sentences, flattened to the bullet line), and a **`llmsFull`** Markdown body for `/llms-full.txt` + `/llms/<page>` |
| **Résumé pour les IA** (`llms`)        | `/llms.txt` summary + paragraph + external resources, and a site-level **`full`** intro prepended to `/llms-full.txt`                                                                                                                                                                                                                                                                                                                        |

Fixed-id singletons (`siteMeta.en`, `siteMeta.fr`), one per locale in `@/config`.
Not plugin-translated — edited from the desk, not the translation menu.

### `siteSettings` — language-independent (one, shared)

| Field                                                | Drives                                                                                                     |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Logo & icônes** (`logo` / `logoDark` / `icon`)     | header + footer logo (with a dark-theme variant), favicon + apple-touch + PWA icons                        |
| **Réseaux sociaux**                                  | `twitter:site`, Organization `sameAs` (handle → profile URL)                                               |
| **Type d'entité**                                    | schema.org `@type` — `Organization` or a LocalBusiness subtype (adds address / hours / geo / area served)  |
| **Raison sociale / dénomination légale / autre nom** | Organization `name` / `legalName` / `alternateName`                                                        |
| **Adresse / contact / GPS / horaires / zones**       | the LocalBusiness JSON-LD fields                                                                           |
| **Schémas additionnels** (`globalSchemas[]`)         | extra entities in the site `@graph` — Service / Product / Person / Event                                   |
| **Indexation du site** (`robots`)                    | `noindex` / `nofollow` applied to **every page** — one switch to keep a staging/holding site out of search |
| **Codes de vérification** (`verification`)           | Google / Bing Search Console `<meta>` tags                                                                 |

## How it reaches the page

`getSiteSeo(locale)` + `getSiteSettings()` (`src/lib/seo/site-seo.ts`) are the
only readers — both wrapped in React `cache()`, so `generateMetadata`, the JSON-LD
`<PageSchemas>`, the layout, and the `/llms*` routes share **one fetch per
request**. On any Sanity error they return empty (never throw).

- **Per-page `<head>`** — `buildMetadata` (`src/lib/metadata.ts`)
- **JSON-LD** — `buildSiteSchemas` + `buildGlobalSchemas` (`src/lib/seo/jsonld*`)
- **`/llms.txt` + `/llms-full.txt` + `/llms/<id>`** — the llms routes

Structural fields (canonical, hreflang, robots) stay config/routing-derived — they
are not editorial copy.

## Notes

- **`og:image`** — Sanity-only (no `/public`, no convention route): when a locale
  has no `ogImage` and the page has none, `buildMetadata` emits no `og:image`.
- **Logo & icons are Sanity-only too** — no `/public` fallback. Empty `logo` → the
  header/footer show the `{site.name}` wordmark; empty `icon` → no favicon `<link>`
  and an empty PWA `icons` array. Set `logoDark` only if the logo is unreadable on
  the dark theme (a pure-CSS `data-theme` swap picks it, no flash). Favicons don't
  theme-switch — one `icon` serves every theme.
- **Extra global schemas** are a curated subset (Service / Product / Person /
  Event), mapped through the factories in `src/lib/seo/jsonld-factories.tsx`.
- **Blog posts + taxonomy pages** are not in `pageSeo` — they carry their own
  doc-level `metadata` / `seoMeta`.
- Changes appear after **publish** + ISR revalidation (reads are published-only).
- **System pages keep a fallback** (unlike the rest of this page). The maintenance +
  404 copy reads Sanity **`?? messages/<locale>.json`** per field — a failure page
  can't depend on Sanity being up. Leave a field blank → the bundled default shows.
  The **500 error page** is a client boundary and stays on `messages` entirely.
