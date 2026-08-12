# Editing SEO in Sanity

The site's SEO surface is **edited in the Studio** — not in code, not in `messages`. Two singletons are the **sole runtime source**: one per-language, one shared. There is **no config/messages fallback** — a field left empty in Sanity is simply empty on the site (the framework default, if any, applies). `pnpm seed` populates both, so a seeded dataset is complete.

> The header + footer **menus** follow the same Sanity-only, no-fallback pattern in a separate `navigation` singleton — see [Navigation](../config/navigation.md).

## The two documents

### `siteMeta.<locale>` — per-language SEO (one per locale)

Doc title in the desk: **SEO par langue**. Fixed-id singletons (`siteMeta.en`, `siteMeta.fr`), one per registered locale — edited from the desk, **not** the translation menu. Read by `getSiteSeo(locale)`.

| Field (Studio label) | Drives |
| --- | --- |
| **Slogan** (`tagline`) | site title suffix (`{siteName} — {tagline}`), `/llms.txt` |
| **Description du site** (`description`) | site-wide default `<meta description>`, `/llms.txt` |
| **Mots-clés du site** (`keywords`) | site-level keywords |
| **Image de partage** (`ogImage`) | the default share card for this language (`og:image` + alt) |
| **Pages de listing** (`taxonomyPages`) | category / tag / author **index** page copy (heading, subheading, empty message). Falls back to `messages` per field |
| **Pages système** (`systemPages`) | maintenance + 404 page copy. Falls back to `messages` per field — see below |
| **SEO par page** (`pageSeo[]`) | full per-page override — see the field list below |
| **Résumé pour les assistants IA** (`llms`) | `/llms.txt` one-line summary + paragraph + external resources, and a site-level `full` intro prepended to `/llms-full.txt` |

**`pageSeo[]` entry** — pick the page from the dropdown (list built from the `pages` map), then set any of:

| Field | Drives |
| --- | --- |
| **Titre SEO** (`title`) | the page `<title>` (~60 char warning) |
| **Description** (`description`) | the page `<meta description>` (~160 char warning) |
| **Mots-clés** (`keywords`) | comma-separated page keywords |
| **Image de partage** (`ogImage`) | page-specific OG card (+ alt); empty = the language default |
| **Image pour Google** (`schemaImage`) | the image Google may show beside the result (WebPage JSON-LD `image`); empty = the OG image |
| **Adresse officielle** (`canonical`) | canonical URL override — only for a page that duplicates another |
| **Masquer des moteurs de recherche** (`noindex`) | drops the page from search **and** the sitemap **and** the LLM endpoints at once |
| **Informations Google en plus** (`structuredData[]`) | per-page JSON-LD (Service / Product / Person / Event) |
| **Résumé pour les IA** (`llmsSummary`) | the page's `/llms.txt` line (newlines flattened) |
| **Contenu complet pour les IA** (`llmsFull`) | the Markdown body for `/llms-full.txt` + `/llms/<page>` |

### `siteSettings` — language-independent (one, shared)

Doc title in the desk: **Paramètres du site (SEO)**. Read by `getSiteSettings()`.

| Field (Studio group) | Drives |
| --- | --- |
| **Logo & icônes** (`logo` / `logoDark` / `icon`) | header + footer logo (with a dark-theme variant), favicon + apple-touch + PWA icons |
| **Réseaux sociaux** (`social`) | footer follow block + `twitter:site`/`creator` + Organization `sameAs` (one source, `src/lib/social.ts`) |
| **Votre activité** (`businessType`) | schema.org `@type` — `Organization` or a LocalBusiness subtype (adds address / hours / geo / area served) |
| **Raison sociale / dénomination légale / autre nom** | Organization `name` / `legalName` / `alternateName` |
| **Adresse / contact / GPS / horaires / zones** | the LocalBusiness JSON-LD fields |
| **Infos Google en plus** (`globalSchemas[]`) | extra entities in the site `@graph` — Service / Product / Person / Event |
| **Indexation du site** (`robots`) | `noindex` / `nofollow` applied to **every page** — one switch to keep a staging/holding site out of search |
| **Vérification Google / Bing** (`verification`) | Search Console `<meta>` tags (`google` + `msvalidate.01`) |
| **Analytics & cookies** (`analytics`) | GA id + the cookie-consent banner toggle — see [Analytics](./analytics.md) |

## How it reaches the page

`getSiteSeo(locale)` + `getSiteSettings()` (`src/lib/seo/site-seo.ts`) are the only readers — both wrapped in React `cache()`, so `generateMetadata`, `<PageSchemas>`, the layout, and the `/llms*` routes share **one fetch per request**. On any Sanity error they return the empty shape (never throw), so the site still renders.

- **Per-page `<head>`** — `buildMetadata` (`src/lib/metadata.ts`)
- **JSON-LD** — `buildSiteSchemas` (layout) + `buildGlobalSchemas` + `<PageSchemas>` (`src/lib/seo/jsonld*`)
- **`/llms.txt` + `/llms-full.txt` + `/llms/<id>`** — the llms routes ([LLM endpoints](./llms-endpoints.md))

**Structural fields stay routing-derived**: hreflang alternates and the default canonical are built from `site.url` + the page's slug per locale; robots-index is a boolean layered from `siteSettings.robots` + per-page `noindex` (`page.seo.robots` in config still wins as a full override). The one editorial exception is `pageSeo.canonical`, which overrides the derived canonical when set.

## Notes

- **`og:image` is Sanity-only** — no `/public`, no convention route. Locale has no `ogImage` and the page has none → `buildMetadata` emits no `og:image`.
- **Logo & icons are Sanity-only too.** Empty `logo` → header/footer show the `{siteName}` wordmark; empty `icon` → no favicon `<link>` and an empty PWA `icons` array. Set `logoDark` only if the logo is unreadable on dark. Favicons don't theme-switch — one `icon` serves every theme.
- **Extra schemas are a curated subset** (Service / Product / Person / Event), mapped through `buildGlobalSchemas` in `src/lib/seo/jsonld-factories.tsx`; unknown `schemaType` values are skipped. An `Offer` attaches only when both `price` and `priceCurrency` are set.
- **Blog posts + taxonomy detail pages are not in `pageSeo`** — they carry their own doc-level `metadata` / `seoMeta`.
- Changes appear after **publish** + revalidation (the read client is published-only).
- **System pages keep a fallback** (unlike the rest of this page). Maintenance + 404 copy reads Sanity `?? messages/<locale>.json` per field — a failure page can't depend on Sanity being up. The **500 error page** is a client boundary and stays on `messages` entirely.

## See also

- [SEO metadata](./seo-metadata.md) — how `buildMetadata` composes the `<head>`
- [Structured-data cookbook](./structured-data-cookbook.md) — the JSON-LD factories
- [Robots & environments](./robots-and-environments.md) — the `noindex` / indexability gates
