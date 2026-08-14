# @indiecrafts/web — app conventions

The web app (`code/apps/web`). Auto-loads when you work under here. Platform-wide
rules + the four-root layout live in the **root `CLAUDE.md`**; this file is the app's
_how to code_. **Design-context pair:** this file = _how to build_ · **[`DESIGN.md`](../../../packages/ui-tokens/DESIGN.md)** = _how it looks_ (tokens, imported below). (Product truth — users/purpose/positioning — is authored per project, not shipped in the template.)

**Stack:** Next.js 16.x (App Router) · React 19.x · TypeScript 5.x (strict) · Tailwind v4 · shadcn/ui · Sanity v5 · next-intl v4 · pnpm 10 / Node 22. Production-only — the Storybook component library is an internal component-library repo.

**Focused rules auto-load** (self-contained) from `.claude/rules/` when you work here: naming · accessibility · adaptive-design · component-architecture · design-token-usage · figma-handoff · sanity-images · sanity-legends — plus the ❌/✅ [`code-patterns`](rules/code-patterns.md) library and the [`self-review`](rules/self-review.md) checklist. Global `writing-style` auto-loads from the root.

**Repeatable multi-file tasks** — add a page · adapt a library section · add/remove a blog page-builder block — have step-by-step checklists in the internal dev framework. Follow the matching one instead of reconstructing the steps.

**Design system:** follow @../../../packages/ui-tokens/DESIGN.md. Before creating or modifying UI — (1) read the component implementation, (2) reuse existing tokens and parts, (3) check the responsive + accessibility + motion rules, (4) flag any `DESIGN.md` ↔ production-code conflict. Verify what's loaded with `/context`.

## Architecture

Shared code in flat top-level folders (`user-interface/`, `lib/`, `sanity/`, `i18n/`); heavy
features are extracted to workspace packages + modules (`@indiecrafts/*`), consumed as source.
Full rationale in `docs/apps/web/config/project-organization.md`.

**Workspace packages + module** (import via `@indiecrafts/*`):

- `@indiecrafts/config` — site config data + types/helpers
- `@indiecrafts/utils` — `cn` · logger · slugify · video-embed · format-date (subpath-only)
- `@indiecrafts/sanity` — Sanity infra: `client · live · env · token · structure` builders
- `@indiecrafts/ui` — shadcn primitives + `use-mobile`
- `@indiecrafts/ui-tokens` — `globals.css` · `typeset.css` · `DESIGN.md`
- `@indiecrafts/i18n` — shared next-intl navigation (`Link`) for modules
- `@indiecrafts/blog` — the blog module → `code/modules/blog`

The app (`src/`):

```
src/app/                   ROUTES ONLY (thin page.tsx / route.ts) — [locale]/<seg>, api/, studio/,
                           maintenance/; routes.ts aggregates the `pages` map → ROUTES + PATHNAMES
src/user-interface/        app UI, by page then category: homepage/sections/ · legal/ ·
                           shared/{layout,components}  (primitives → @indiecrafts/ui; the branded
                           maintenance/404/error status pages → @indiecrafts/system-pages)
src/lib/                   app services: metadata · fonts · theme · navigation · cookies · social ·
                           faq · system-pages · seo/{jsonld,jsonld-factories,page-markdown}
src/sanity/                app Sanity: {nav,legal,cookie,seo}-queries · schema/ · Studio.tsx
src/i18n/                  typed routing (PATHNAMES from app routes) — the app's typed `Link`
src/hooks/ src/types/ src/assets/fonts/   useConsent · ambient types · build-imported .woff2
sanity.config.ts           Studio config — registers `@indiecrafts/blog` schema + structure
messages/<locale>.json     chrome + pages.<id>.{title, description, blocks}
```

## i18n: single source of truth

`messages.<locale>.pages.<id>.*` powers EVERYTHING per page: SEO `<title>`/description, canonical, og/twitter, JSON-LD WebPage, llms.txt entries.

```jsonc
{
  "nav": { … }, "common": { … }, "site": { "tagline": "…", "description": "…" },
  "pages": {
    "home": {
      "title": "…",
      "description": "…",
      "blocks": {
        "features": { … },   // block keys drop the -NN variant suffix
        "cta":      { … }
      }
    }
  }
}
```

- Drop variant suffix in production keys: library's `sections-features/features-01/` → `pages.home.blocks.features`.
- Same block on multiple pages = duplicate copy under each page (cheap, independent).
- Adding a locale: append to `locales` array + drop `messages/<code>.json`.

## Adding a page

_Checklist: the internal add-page workflow._

1. `src/app/[locale]/<seg>/page.tsx`
2. Entry in `pages` (config/index.ts): `{ key, id, slug, seo: { keywords } }`
3. Key in `AppPathname` (`src/config/types.ts`)
4. `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`

Propagates automatically: sitemap, routing, llms.txt × locales, SEO metadata, JSON-LD WebPage.

## Working with the library (shadcn/ui + `<your-component-library>`)

_Checklist: the internal adapt-library-section workflow._

Two building blocks feed the UI: **shadcn/ui** primitives (`@indiecrafts/ui`, CLI-managed) and your **component library** — a Storybook-only browse surface with **zero runtime imports** from the app. The pattern is always **copy then adapt to the template's conventions**, never depend.

**Reuse before create.** Before adding UI: reuse an existing part → add a backward-compatible variant → compose primitives → new shared part (`user-interface/`) → page-specific. Never duplicate a part just because it has a different name. When sources disagree, authority runs: `user-interface/ui` + `config`/`globals.css` tokens (canonical) → the library (a reference to adapt, not copy verbatim) → screenshots.

To adapt a library section:

1. Browse the variant in Storybook (`cd <your-component-library> && pnpm storybook`).
2. Copy its file into `src/user-interface/homepage/sections/<Name>.tsx`. Flatten a multi-file folder (schema.ts + config.ts + en.json) into one `.tsx`, and rework it to template patterns: strings → `messages/`, colors/nav → `@/config`, links → `@/i18n/routing`. See `src/user-interface/homepage/sections/Features.tsx` for the target shape.
3. Drop the matching copy into `messages/<locale>.pages.<id>.blocks.<simpleName>` (drop the -NN suffix).
4. Mount in the route's `page.tsx`, passing a `namespace` (e.g. `pages.home.blocks.cta`) or `pageId` prop. Live pattern: `src/app/[locale]/(home)/page.tsx`.

Never add the library as a workspace, dependency, or symlink — the decoupling is the design. When the library improves a component, re-copy by hand + re-run `pnpm verify:quick`.

## SEO + JSON-LD

**Inheritance chain (lowest → highest precedence):**

1. `site.*` (brand, url, social)
2. `seoDefaults.*` (titleTemplate, robots, OG type/siteName, twitter card, verification)
3. Auto-derived from `page.id`: titleKey, descriptionKey, og:image=`/opengraph-image`, canonical
4. `page.seo.*` overrides

`buildMetadata({ page, locale })` (`@/lib/metadata`) composes the chain. Layout uses `generateMetadata` so site-wide metadata is also locale-aware.

**Auto-emitted JSON-LD:** Organization, WebSite (layout), WebPage (per page via `<PageSchemas>`). Per-page extras → `page.seo.structuredData[]` using factories from `@/lib/seo/jsonld-factories`. Cookbook in `docs/apps/web/seo/structured-data-cookbook.md`.

**FAQ is the highest-ROI rich result** for B2B. Wire it via `buildFAQPageSchema(...)`.

## LLM endpoints

`/<locale>/llms.txt`, `/<locale>/llms-full.txt`, `/<locale>/llms/<id>` — all auto-built from `messages.<locale>.pages.*`. **Zero per-page config.** Add a page → it appears in all three, in every locale. Published blog posts are appended to `llms.txt` + `llms-full.txt` as a `## Blog` section (each links to its `/blog/<slug>/md` export) via `getBlogLlmsLines` in `code/modules/blog/src/lib/llms.ts` — gated by `features.blog`, `noIndex` posts excluded.

## Sanity + blog (feature-flagged)

Two independent flags in `config`: **`features.blog`** (public surface — every blog route 404s and drops from sitemap + llms.txt + header nav when off) and **`features.studio`** (the Studio at `/studio` + draft-mode preview; independent of `blog`). Public-blog gating is centralized in `@indiecrafts/blog/lib/route-gate`.

Details live with the code they describe (Claude Code auto-loads these when you work in those dirs):

- Blog feature — schema, page-builder modules, per-post layout, gating → **`code/modules/blog/CLAUDE.md`**
- Sanity infra — client, live/draft-mode, env, "never new `createClient`" → **`src/sanity/CLAUDE.md`**
- Human-facing docs → `docs/modules/blog/`.

## Accessibility (structural)

The **visual system** — colors, typography, spacing, dark mode, motion, contrast — lives in **`code/packages/ui-tokens/DESIGN.md`**. This file keeps only the structural, code-level rules:

- `<html lang>` + `dir` from the active locale. `SkipLink` first in the body, targets `#main`. Exactly one `<main id="main" tabIndex={-1}>` per layout. Sections use `<section aria-labelledby="…">`. Icons `aria-hidden="true"` unless the sole label.
- `jsx-a11y` rules are errors (eslint); `pnpm verify:contrast` gates WCAG AA on the theme tokens (see Verification).

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries — read from `@/config`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER add `as any` — fix the type, or eslint-disable with a one-line reason.
- NEVER render a Sanity/remote image at full resolution — use `next/image` (the `loaderFile` sizes it at the CDN) or, for a rare raw `<img>`, append `?w=…&auto=format&fit=max&q=`. See `rules/sanity-images.md`.
- NEVER hand-edit `@indiecrafts/ui` primitives (shadcn — managed via CLI).
- NEVER depend on `<your-component-library>` at runtime — it's browse-only, copy what you need.
- NEVER swallow errors — `logger.error(...)` minimum.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- NEVER instantiate a Sanity `createClient` per route — use `@/sanity/client`.
- NEVER expose `SANITY_API_READ_TOKEN` (or any non-public Sanity token) under a `NEXT_PUBLIC_` prefix.
- ALWAYS maximise use of the `frontend-design` skill when building or reshaping UI — lean on it for aesthetic direction, typography, and layout so nothing reads as a templated default.
- ALWAYS be **adaptive-aware**: same content reflowing = **responsive** (the default, one markup tree); different content by context = **adaptive**, for that component only — **name the mechanism** in the PR. Design each device class deliberately (Tailwind `sm 640 · md 768 · lg 1024 · xl 1280`, mobile-first; container queries where a component's width drives layout; `pointer`/`hover` for input method). Verify at **375 / 768 / 1280** (the floor, not the definition). See `DESIGN.md` § Responsive & adaptive behavior + `rules/adaptive-design.md`.
- ALWAYS `setRequestLocale(locale)` at the top of server components using translations or metadata.
- ALWAYS update the docs when you change what they describe — every change to a feature, flag, config shape, route, or convention updates the matching `docs/` page **and** the `docs/.vitepress/config.mts` sidebar (add/rename/remove in lockstep). Docs are part of the change, not a follow-up.
- ALWAYS log behavior/config/route/convention **and** design-token changes in the **app** changelog `code/apps/web/CHANGELOG.md` (one file for code + design) with a plain-language _why_. Other areas log elsewhere (docs-site → `docs/CHANGELOG.md`); the root `CHANGELOG.md` is the release roll-up. Log a change in exactly one area log.
- ALWAYS run `pnpm verify:quick` before opening a PR — there's no pre-push hook, so nothing blocks a push; the commit hook only runs `tsc` + staged-file lint.

## File-size discipline

- Components < 200 lines. Split at the natural seam.
- Page templates < 150 lines.
- Config files exempt — as long as the data requires.

## Verification (CI runs all of these)

1. `pnpm tsc` — strict, no emit
2. `pnpm lint` — zero errors
3. `pnpm format:check`
4. `pnpm verify:contrast` — WCAG AA on theme tokens
5. `pnpm doctor:changed` — React Doctor, `--scope changed --base main` (fails only on issues your branch introduced, not legacy debt)
6. `pnpm build` — prerenders every static route × locale

Treat warnings as errors in /app + /lib + /config. A clean tree is a shippable tree.
