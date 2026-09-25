---
title: "Editing SEO in Sanity"
description: "The site's SEO surface is edited in the Studio — not in code, not in messages."
status: stable
---

# Editing SEO in Sanity

The site's SEO surface is **edited in the Studio** — not in code, not in `messages`. Site-wide defaults live in **two singletons** (one per-language, one shared); **per-page SEO lives on each document a route renders**, under a collapsible **SEO & visibilité** section. Sanity is the **sole runtime source** — there is **no config/messages fallback**, so a field left empty in Sanity is simply empty on the site (the framework default, if any, applies). `pnpm seed` populates them, so a seeded dataset is complete.

> The header + footer **menus** follow the same Sanity-only, no-fallback pattern in a separate `navigation` singleton — see [Navigation](/projects/web/website/config/navigation).

## The two documents

### `siteMeta.<locale>` — per-language site-wide defaults (one per locale)

Doc title in the desk: **SEO par langue**. Fixed-id singletons (`siteMeta.en`, `siteMeta.fr`), one per registered locale — edited from the desk, **not** the translation menu. Holds only site-wide **defaults**, not per-page SEO. Read by `getSiteSeo(locale)`.

| Field (Studio label)                       | Drives                                                                                                                                                                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slogan** (`tagline`)                     | site title suffix (`{siteName} — {tagline}`), `/llms.txt`                                                                                                                                                                                           |
| **Description du site** (`description`)    | site-wide default `<meta description>`, `/llms.txt`                                                                                                                                                                                                 |
| **Mots-clés du site** (`keywords`)         | site-level keywords                                                                                                                                                                                                                                 |
| **Image de partage** (`ogImage`)           | the default share card for this language (`og:image` + alt)                                                                                                                                                                                         |
| **Pages de listing** (`taxonomyPages`)     | category / tag / author **index** page copy (heading, subheading, empty message). Falls back to `messages` per field                                                                                                                                |
| **Pages système** (`systemPages`)          | maintenance + 404 page copy. Falls back to `messages` per field — see below                                                                                                                                                                         |
| **Résumé pour les assistants IA** (`llms`) | `/llms.txt` one-line summary + paragraph + external resources + a **last-reviewed date** (`reviewedAt`) shown in the header + the **section order** (`sectionOrder`) for the page list, and a site-level `full` intro prepended to `/llms-full.txt` |

**Per-page SEO — on the document, not here.** Each document a route renders carries its own SEO under a collapsible **SEO & visibilité** section (the shared `seoMeta` object): the home `page`, each `legalPage`, each post, and the `waitlistSettings` singleton. The taxonomy list pages (author / category / tag) are edited on the **Blog** singleton under **SEO des pages de listing** (`indexSeo`). Every SEO section exposes the same fields:

| Field                                                | Drives                                                                                                                                                           |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre SEO** (`title`)                              | the page `<title>` (~60 char warning)                                                                                                                            |
| **Description** (`description`)                      | the page `<meta description>` (~160 char warning)                                                                                                                |
| **Mots-clés** (`keywords`)                           | comma-separated page keywords                                                                                                                                    |
| **Image de partage** (`image`)                       | page-specific OG card (+ alt); empty = the language default                                                                                                      |
| **Image pour Google** (`schemaImage`)                | the image Google may show beside the result (WebPage JSON-LD `image`); empty = the OG image                                                                      |
| **Adresse officielle** (`canonical`)                 | canonical URL override — only for a page that duplicates another                                                                                                 |
| **Masquer des moteurs de recherche** (`noIndex`)     | drops the page from search **and** the sitemap **and** the LLM endpoints at once                                                                                 |
| **Informations Google en plus** (`structuredData[]`) | per-page JSON-LD (Service / Product / Person / Event)                                                                                                            |
| **Section pour les IA** (`llmsSection`)              | the `## H2` this page groups under in `/llms.txt` (e.g. « Guides »); empty = the default « Pages ». Ordered per language by `sectionOrder` on the site singleton |
| **Résumé pour les IA** (`llmsSummary`)               | the page's `/llms.txt` line (newlines flattened)                                                                                                                 |
| **Contenu complet pour les IA** (`llmsFull`)         | the Markdown body for `/llms-full.txt` + `/llms/<page>`                                                                                                          |

> **Single-value SEO on shared singletons.** The `blog` and `waitlistSettings` singletons are locale-independent, so `/blog`, `/author`, `/blog/category`, `/blog/tag`, and `/waitlist` have **one** SEO value, not one per locale — a deliberate "as few models as possible" trade. The `home` page and legal pages keep **per-locale** SEO (their documents are translated).

### `siteSettings` — language-independent (one, shared)

Doc title in the desk: **Paramètres du site (SEO)**. Read by `getSiteSettings()`.

| Field (Studio group)                                 | Drives                                                                                                                                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Logo & icônes** (`logo` / `logoDark` / `icon`)     | header + footer logo (with a dark-theme variant), favicon + apple-touch + PWA icons                                                                                              |
| **Réseaux sociaux** (`social`)                       | footer follow block + `twitter:site`/`creator` + Organization `sameAs` (one source, `src/lib/social.ts`)                                                                         |
| **Votre activité** (`businessType`)                  | schema.org `@type` — `Organization` or a LocalBusiness subtype (adds address / hours / geo / area served)                                                                        |
| **Raison sociale / dénomination légale / autre nom** | Organization `name` / `legalName` / `alternateName`                                                                                                                              |
| **Adresse / contact / GPS / horaires / zones**       | the LocalBusiness JSON-LD fields                                                                                                                                                 |
| **Infos Google en plus** (`globalSchemas[]`)         | extra entities in the site `@graph` — Service / Product / Person / Event                                                                                                         |
| **Indexation du site** (`robots`)                    | `noindex` / `nofollow` applied to **every page** — one switch to keep a staging/holding site out of search                                                                       |
| **Vérification Google / Bing** (`verification`)      | Search Console `<meta>` tags (`google` + `msvalidate.01`)                                                                                                                        |
| **Analytics & cookies** (`analytics`)                | GA id + the cookie-consent banner toggle — see [Analytics](/projects/web/website/seo/analytics)                                                                                  |
| **Partage** (`share`)                                | the site-wide share row (site footer **and** blog posts) — a master on/off plus a checkbox per network (X / LinkedIn / Facebook / copy-link). One shared setting, not blog-owned |

## How it reaches the page

`getSiteSeo(locale)`, `getSiteSettings()`, and `getPageSeo(pageId, locale)` (`src/lib/seo/site-seo.ts`) are the readers — all wrapped in React `cache()`, so `generateMetadata`, `<PageSchemas>`, the layout, and the `/llms*` routes share **one fetch per request**. `getPageSeo` dispatches each static route to its owning document's `.seo` (home → the home `page`; `/blog` + the taxonomy list pages → the `blog` singleton; legal pages → the matching `legalPage`; `/waitlist` → `waitlistSettings`). On any Sanity error they return the empty shape (never throw), so the site still renders.

- **Per-page `<head>`** — `buildMetadata` (`src/lib/metadata.ts`)
- **JSON-LD** — `buildSiteSchemas` (layout) + `buildGlobalSchemas` + `<PageSchemas>` (`src/lib/seo/jsonld*`)
- **`/llms.txt` + `/llms-full.txt` + `/llms/<id>`** — the llms routes ([LLM endpoints](/projects/web/website/seo/llms-endpoints))

**Structural fields stay routing-derived**: hreflang alternates and the default canonical are built from `site.url` + the page's slug per locale; robots-index is a boolean layered from `siteSettings.robots` + per-page `noIndex` (`page.seo.robots` in config still wins as a full override). The one editorial exception is the document's `seo.canonical`, which overrides the derived canonical when set.

## Notes

- **`og:image` is Sanity-only** — no `/public`, no convention route. Locale has no `ogImage` and the page has none → `buildMetadata` emits no `og:image`.
- **Logo & icons are Sanity-only too.** Empty `logo` → header/footer show the `{siteName}` wordmark; empty `icon` → no favicon `<link>` and an empty PWA `icons` array. Set `logoDark` only if the logo is unreadable on dark. Favicons don't theme-switch — one `icon` serves every theme.
- **Extra schemas are a curated subset** (Service / Product / Person / Event), mapped through `buildGlobalSchemas` in `src/lib/seo/jsonld-factories.tsx`; unknown `schemaType` values are skipped. An `Offer` attaches only when both `price` and `priceCurrency` are set.
- **Blog posts + taxonomy detail pages carry their own `seo`** — the same shared `seoMeta` object as every other document.
- Changes appear after **publish** + revalidation (the read client is published-only).
- **System pages keep a fallback** (unlike the rest of this page). Maintenance + 404 copy reads Sanity `?? messages/<locale>.json` per field — a failure page can't depend on Sanity being up. The **500 error page** is a client boundary and stays on `messages` entirely.

## See also

- [SEO metadata](/projects/web/website/seo/seo-metadata) — how `buildMetadata` composes the `<head>`
- [Structured-data cookbook](/projects/web/website/seo/structured-data-cookbook) — the JSON-LD factories
- [Robots & environments](/projects/web/website/seo/robots-and-environments) — the `noindex` / indexability gates
