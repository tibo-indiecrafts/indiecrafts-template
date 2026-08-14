# @indiecrafts/web

The Next.js 16 app. Run everything from the **repo root** (`pnpm dev/build/verify` →
turbo → `@indiecrafts/web`). Agent conventions → [`CLAUDE.md`](./CLAUDE.md) (sibling);
design tokens → [`DESIGN.md`](./DESIGN.md); product docs → [`../../docs/apps/web/`](../../docs/apps/web/).

## Blog (Sanity-powered, optional)

A full Sanity-backed editorial blog is wired in — feature-flagged so you can ship without it.

- **Turn it on** — set `features.blog: true` in `src/config/index.ts`, drop `NEXT_PUBLIC_SANITY_PROJECT_ID` + dataset into `.env.local`, run `pnpm dev`. Editor lives at <http://localhost:3000/studio>.
- **What you get** — `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/author/[slug]`, RSS + Atom feeds (per locale), Markdown export, draft preview, live content subscriptions, locale-filtered (EN + FR by default), embedded Sanity Studio at `/studio`.
- **Page-builder** — 13 modules (9 inline-embeddable inside post bodies, 4 layout-slot only). Editors compose post chrome from the `blog` singleton's `postModules` array; the body editor exposes H1-H6, lists, marks (incl. code / underline / strike), inline images, links, and 9 fancy module types.
- **Seed demo content** — `pnpm seed` populates 47 docs incl. a showcase article that exercises every editor primitive.

When `features.blog: false`, every route above 404s, sitemap drops the entry, the header link disappears, and `/studio` is the only Sanity surface that stays.

## How it's organised

Feature-based: shared code in flat top-level folders; each domain owns a `features/<name>/` folder. Full tree + rationale in [`CLAUDE.md`](./CLAUDE.md) § Architecture and [`../../docs/apps/web/config/project-organization.md`](../../docs/apps/web/config/project-organization.md).

```
messages/<locale>.json     Single source of truth for ALL user-facing copy
src/
├── app/[locale]/          Routes — (home), legal, error, not-found, llms.txt, studio, …
│   └── routes.ts          Auto-aggregates the `pages` map → ROUTES + PATHNAMES
├── config/                PURE DATA (index.ts) + types/helpers (types.ts)
├── features/blog/         Self-contained blog feature (user-interface/ sanity/ lib/)
├── user-interface/        Shared UI — ui/ (shadcn, READ-ONLY), homepage/sections/,
│                          error/ maintenance/ not-found/, shared/{layout,components}
├── lib/                   metadata.ts, fonts.ts, seo/{jsonld,jsonld-factories,page-markdown}
├── sanity/                Core Sanity infra (client, live, env, token, image, Studio)
└── hooks/ i18n/ types/ assets/fonts/
```

## Adding a page

1. Folder under `src/app/[locale]/<seg>/` with a `page.tsx`
2. Entry in the `pages` map (`src/config/index.ts`): `{ key, id, slug, seo: { keywords } }`
3. Key in `AppPathname` (`src/config/types.ts`)
4. `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`

Everything else propagates — sitemap, routing, llms.txt, SEO metadata, JSON-LD.

## Adding a section

1. Browse the sibling **[component-library](../../../component-library)** (`pnpm storybook`) and find a section variant.
2. Copy its `Component.tsx` into `src/user-interface/homepage/sections/<Name>.tsx`. If it ships a multi-file folder, flatten schema + config into one file as you copy. See `src/user-interface/homepage/sections/Features.tsx` for the target shape.
3. Drop its sample copy (`en.json`) into `messages/<locale>.pages.<id>.blocks.<simpleName>`. Drop the `-NN` variant suffix — production keys are clean.
4. Mount it in the route's `page.tsx` with a `namespace`/`pageId` prop. See `src/app/[locale]/(home)/page.tsx` for the live pattern.

The library is **never imported at runtime** — it's a Storybook-only browse surface. The app ships only the section files you've copied in.

## i18n

Single flat file per locale (`messages/<locale>.json`): `nav`, `common`, `site`, and `pages.<id>.{title, description, blocks}`. Adding a locale = one row in `locales` (`src/config/index.ts`) + matching `messages/<code>.json`. Routes, sitemap, switcher all pick it up automatically.

## SEO

Per-locale, every page automatically gets `<title>` + `<meta description>` (from `pages.<id>.title`/`.description`), canonical + hreflang × all locales + x-default, og/twitter, and JSON-LD (`Organization` + `WebSite` + `WebPage`). Override per page via `pages.<id>.seo` (keywords, noindex, openGraph.imageUrl, structuredData).

**`NEXT_PUBLIC_SITE_URL` MUST be set in production** — when unset, `robots.ts` serves `Disallow: /` (staging gate).

Per-page rich results: add `structuredData` via factories in `@/lib/seo/jsonld-factories` (`buildFAQPageSchema`, `buildArticleSchema`, `buildServiceSchema`, `buildProductSchema`, `buildLocalBusinessSchema`, `buildPersonSchema`, `buildBreadcrumbSchema`). **FAQ is the highest-ROI rich result** for B2B. Cookbook: [`../../docs/apps/web/seo/structured-data-cookbook.md`](../../docs/apps/web/seo/structured-data-cookbook.md).

**Brand assets** are all edited in Sanity (Studio → SEO & métadonnées): logo (`siteSettings.logo`/`logoDark`), favicon/app icon (`siteSettings.icon`), OG card per language (`siteMeta.<locale>.ogImage`). Nothing brand-related lives in `/public`; `pnpm seed` uploads defaults from `scripts/seed-media/`. See [`../../docs/apps/web/seo/editing-seo-in-sanity.md`](../../docs/apps/web/seo/editing-seo-in-sanity.md).

## LLM endpoints

All per-locale, all auto-built from `messages.<locale>.pages.*` — no separate config:

- `/<locale>/llms.txt` — site summary + page list ([llmstxt.org](https://llmstxt.org) spec)
- `/<locale>/llms-full.txt` — every page's content concatenated as Markdown
- `/<locale>/llms/<id>` — single page as Markdown

## Deployment (Cloudflare Workers)

The app deploys to **Cloudflare Workers** via OpenNext, across **dev / staging / prod**, with an R2-backed ISR cache and GitHub Actions auto-deploy (push to `main` → prod). Deploy scripts are **app-namespaced** — `pnpm deploy:web:{dev,staging,prod}` from the root. Config: `wrangler.toml`, `open-next.config.ts`. Set `NEXT_PUBLIC_SITE_URL` on the prod worker before launch (until then `robots.ts` serves `Disallow: /` — the staging gate). **Full runbook** (R2 buckets, secrets, custom domain, first-deploy checks): [`docs/apps/web/setup/deployment.md`](../../../docs/apps/web/setup/deployment.md).

## Forms

Forms POST to **API routes**, not a host feature — so they work the same on any deploy target. The template ships the newsletter (`/api/newsletter`) and blog comments (`/api/comments`): a client form + honeypot → a gated route → a server-only Sanity write (or an email provider). Copy that pattern for a contact form. See [Newsletter](../../../docs/apps/web/config/newsletter.md) + [Comments](../../../docs/modules/blog/comments.md).

## Cookie banner + legal page (feature-flagged)

Both default OFF — turn on in `src/config/index.ts` under `features` (`cookieBanner`, `legalPage`):

- **`cookieBanner: true`** — bottom-fixed Accept/Reject banner at first visit (and `?cookies=manage`); stores `localStorage["cookie-consent"]`; if `analytics.googleAnalyticsId` is set, GA loads with [Consent Mode v2](https://developers.google.com/tag-platform/security/guidance/consent-mode) `denied` defaults, flipped to `granted` on accept. Copy in `messages.<locale>.cookies.*`.
- **`legalPage: true`** — `/legal` route enabled (sitemap, routing, llms.txt pick it up). Content from `messages.<locale>.pages.legal.*`; sections adjustable in both the JSON and the `SECTIONS` list in `src/app/[locale]/legal/page.tsx`.

For most B2B sites with no analytics, leave both off (strictly-necessary cookies don't need consent under GDPR). For EU traffic with GA, turn both on.

## Critical rules

Full list in [`CLAUDE.md`](./CLAUDE.md) § Critical rules. The essentials:

- Never inline user-facing strings — use `messages/`.
- Never `import Link from "next/link"` — use `@/i18n/routing`.
- Never edit `src/user-interface/ui/**` (shadcn-managed).
- Never depend on `../../../component-library` at runtime — browse-only.
- Always `setRequestLocale(locale)` in server components that use translations.
- Always run `pnpm verify:quick` before opening a PR.

## Links

|                  | URL                                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| Live site        | `<https://your-domain.com>`                                              |
| Repo             | `<https://github.com/you/your-repo>`                                     |
| Deploy dashboard | `<Cloudflare Workers project URL>`                                       |
| Sanity Studio    | `<https://your-domain.com/studio>` — local: http://localhost:3000/studio |
| Product docs     | `<https://docs.your-domain.com>` — local: http://localhost:3002          |

<!-- Template placeholders — fill in per project. -->
