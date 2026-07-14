# Project organization & architecture

How the codebase is laid out and where new code goes. The guiding idea:
**shared, cross-cutting code lives in flat top-level folders; anything owned by
one domain lives under `features/<name>/`.** Flipping a `features.*` flag should
map cleanly onto a folder.

## Top-level `src/`

```
src/
├── app/            Next.js App Router — ROUTES ONLY (thin page.tsx / route.ts)
│   ├── [locale]/       localized pages + route handlers (llms, rss, md)
│   ├── api/            draft-mode enable/disable
│   ├── studio/         embedded Sanity Studio (own root layout)
│   ├── maintenance/    maintenance page (own root layout)
│   ├── layout.tsx      passthrough root layout
│   ├── globals.css     Tailwind v4 entry + @theme tokens
│   └── icon/manifest/robots/opengraph/sitemap …  metadata routes
│
├── features/       DOMAIN FEATURES — self-contained, one folder per feature
│   └── blog/
│       ├── components/   views, cards, hero, TOC + modules/ page-builder
│       ├── sanity/       schema/ + queries.ts + types.ts + structure.ts + portable-to-markdown.ts
│       └── lib/          route-gate.ts (blog route gating)
│
├── components/     SHARED, cross-feature UI
│   ├── ui/             shadcn primitives (CLI-managed — see components.json)
│   ├── layout/         production chrome: Header, Footer, ThemeToggle, CookieBanner…
│   ├── sections/       marketing blocks: Features, Pricing, Faq, IconShowcase…
│   ├── pages/          full-page composites: Error, NotFound, Maintenance
│   ├── svgs/           238 brand/illustration SVG components (Tailark)
│   └── BrandIcon.tsx   reicon-brands wrapper
│
├── config/         single source of truth (site, theme, fonts, i18n, features, pages…)
├── lib/            SHARED utilities/services: metadata, seo/, theme, fonts, logger, slugify, utils, faq, video-embed
├── sanity/         CORE Sanity infra: client, live, env, token, image, Studio
├── hooks/  i18n/  types/     shared React hooks / routing / ambient types
├── assets/         build-IMPORTED files (fonts/*.woff2 for next/font/local)
└── (public/)       — sibling of src/ — URL-served static files (favicons, /brand/*.png, robots)
```

## The three "where does a file go?" rules

1. **Used by exactly one feature → `features/<name>/`.** Blog views, its GROQ,
   its schema, its route-gating all live under `features/blog/`. Deleting a
   feature = deleting one folder.
2. **Used site-wide or by ≥2 features → a shared top-level folder** (`components/`,
   `lib/`, `hooks/`, `config/`).
3. **Routes stay in `app/`.** Next's App Router _is_ the routing layer; a
   `page.tsx` should be thin and import its heavy lifting from `features/*` or
   `components/*`.

## `public/` vs `src/assets/` vs `components/svgs/`

- **`public/`** — files referenced by a **URL string**, served verbatim:
  favicons, `/brand/og-*.png`, `logo.svg`, robots. Never bundled.
- **`src/assets/`** — files **`import`ed into code**: the `.woff2` fonts read by
  `next/font/local`. Never URL-served images; never fonts in `public/`.
- **`src/components/svgs/`** — `.tsx` **React components**, not assets.

## Imports & conventions

- Alias: `@/*` → `src/*`. No per-feature alias needed — `@/features/blog/...`
  resolves for free.
- **No barrel files.** Import deep (`@/features/blog/components/DefaultPostLayout`),
  not through an `index.ts`. A single barrel would taint on `route-gate`'s
  `server-only` import and defeat tree-shaking.
- Naming: `PascalCase.tsx` for components, `kebab-case.ts` for lib/util modules,
  matching the existing tree.
- Never import from `next/link` / `next-intl/navigation` directly — use
  `@/i18n/routing`. Never edit `components/ui/**` by hand (shadcn CLI-managed).

## Adding a new feature

Mirror `features/blog/`: create `features/<name>/{components,lib,sanity?}`, add a
`features.<name>` flag in `config`, gate its routes with a `require<Name>Route`
helper in `features/<name>/lib`, and keep its `app/` routes thin. Shared pieces it
needs (a new UI primitive, a generic util) go in `components/ui` or `lib/`, not in
the feature.

> Migration history: this structure was reached from a flat type-based layout via
> `docs/migration-feature-based.md` (7 phased, verified commits).
