# Legal pages

The template ships **five legal pages**, each a real route with a per-locale slug (French
primary), its own feature flag, and a **client-editable body in Sanity**.

| Page | `features.legal.*` | EN slug | FR slug | Standard |
| --- | --- | --- | --- | --- |
| Mentions légales | `notice` | `/legal-notice` | `/mentions-legales` | LCEN |
| Politique de confidentialité | `privacy` | `/privacy-policy` | `/politique-de-confidentialite` | RGPD |
| Politique de cookies | `cookies` | `/cookie-policy` | `/politique-de-cookies` | ePrivacy |
| Conditions générales d'utilisation | `terms` | `/terms` | `/conditions-generales-utilisation` | — |
| Conditions générales de vente | `sales` | `/terms-of-sale` | `/conditions-generales-de-vente` | for selling |

> The **cookie-policy** page appends a live cookie declaration (the inventory + a "Manage
> preferences" button) below its editable intro — see [Cookie consent](./cookie-consent.md).

> ⚠️ **The seeded content is a starter template, not legal advice.** Every page opens with a
> warning and `[bracketed]` placeholders. **Have a lawyer review and complete each page**
> before launch. In France, missing/incorrect mentions légales can be fined up to €75,000
> (individual) / €375,000 (company).

## How they work

- **Content** — edited in Sanity: Studio → **Pages légales → [language]**. Each is a
  `legalPage` doc (`pageKey`, `title`, `lastUpdated`, rich-text `body`), translated per
  locale. `pnpm seed` populates all ten (5 × EN/FR) with boilerplate. An empty doc renders
  a "not published yet" placeholder — never a blank page.
- **SEO** — the `<title>` / description come from `siteMeta.<locale>.pageSeo` like every
  other page (see [Editing SEO in Sanity](../seo/editing-seo-in-sanity.md)), not the doc.
- **Routing** — static entries in the `pages` map (`legalNotice`, `privacy`, `cookies`,
  `terms`, `termsOfSale`); per-locale slugs resolve via next-intl.
- **Flags** — turn any page off with `features.legal.<key> = false`: it 404s and drops from
  the footer, sitemap, and llms endpoints. `sales` (CGV) is **off by default** — enable it
  only if you sell online.
- **Footer** — enabled pages surface through the Sanity `navigation` doc (a Legal column) —
  see [Navigation](./navigation.md).

## Which pages do you need?

- **Always** (any French site that collects data — contact form, analytics): mentions
  légales + confidentialité + cookies.
- **Recommended**: CGU (terms of use).
- **Only if selling online**: CGV (`features.legal.sales = true`).
- **Optional add-on** — an **accessibility statement** (déclaration d'accessibilité, RGAA) is
  legally required for public-sector bodies and large companies (>250 staff / €50M
  turnover). Add it as a sixth page following the same pattern if needed.

## Editing

1. Studio → **Pages légales** → pick the language → the page.
2. Fill in the `[bracketed]` fields, adjust sections, set **Dernière mise à jour**.
3. Publish. Repeat for the other language.
