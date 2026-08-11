# indiecrafts.dev — CLAUDE.md

Config-first, modular template for client sites. Production-only — the Storybook
component library is the sibling repo `../indiecrafts-library`.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind v4 · shadcn/ui · Sanity · next-intl.

**Top non-negotiables** (full list → [Critical rules](#critical-rules-the-nevers)):

- Read from `@/config` — never hard-code brand strings, URLs, colors, or nav.
- Route via `@/i18n/routing` — never `next/link` / `next-intl/navigation`.
- User-facing strings live in `messages/<locale>.json` — never inline.
- Don't edit `src/user-interface/ui/**` (shadcn CLI) or depend on the library at runtime.
- `pnpm verify:quick` before opening a PR (no pre-push hook — the commit hook runs `tsc` + staged lint).

**Two briefs:** this file (`CLAUDE.md`) is _how to code_ — architecture, conventions, workflow. **`DESIGN.md`** (repo root) is _how to design_ — the visual token contract (color roles, type scale, spacing, elevation, motion). Read both; visual tokens never go here, code rules never go there.

**Dev framework (in-repo).** The whole `claude-tasks` framework lives here, in three zones — dev with all context at once:

- **`.platform/`** — _how we work_ + the reusable engineering brain. `process/` (7-phase sprint `WORKFLOW`, `DECISION-MATRIX`, `PROJECT-BOOTSTRAP`, `SYSTEM-RULES`), `engineering/` (principles · feature-architecture · api-and-data · infra · testing · tech-debt · database · observability · git-and-pr · engineering-standards), `context/` (how-I-work · voice · audience), `templates/` (sprint templates). Read-only reference — refresh from canon, don't hand-edit.
- **`docs/`** — _what this product is + why_ (the official VitePress canon). Decisions that stick graduate here.
- **`work/`** — _the lab_: think · plan · develop · reflect. `features/<name>/0X_*` (per-branch sprint, stamped from `.platform/templates/feature`), `project/` (set-once), `outputs/`, `archive/`, `backlog.md`, `scratch/` (gitignored). **Write drafts and thinking here, never into `docs/`.**

Rule: think in `work/`, build to `.platform/engineering`, promote what sticks to `docs/`.

**Focused rules** live in `.claude/rules/` — load the relevant one when the task touches it: [`naming`](.claude/rules/naming.md), [`accessibility`](.claude/rules/accessibility.md), [`component-architecture`](.claude/rules/component-architecture.md), [`design-token-usage`](.claude/rules/design-token-usage.md), [`figma-handoff`](.claude/rules/figma-handoff.md), [`writing-style`](.claude/rules/writing-style.md) (how the agent writes its own output — docs, comments, commits — STE-informed; not UI copy), [`sanity-legends`](.claude/rules/sanity-legends.md) (Studio field labels + descriptions written for non-technical editors). Long-term context/decisions → `MEMORY.md`.

**Repeatable multi-file tasks** have step-by-step checklists in [`.claude/workflows/`](.claude/workflows/) — follow the matching one instead of reconstructing the steps: [`add-page`](.claude/workflows/add-page.md), [`adapt-library-section`](.claude/workflows/adapt-library-section.md), [`add-blog-module`](.claude/workflows/add-blog-module.md), [`remove-blog-module`](.claude/workflows/remove-blog-module.md).

**Design system:** follow @DESIGN.md. Before creating or modifying UI — (1) read the component implementation, (2) reuse existing tokens and parts, (3) check the responsive + accessibility + motion rules, (4) flag any `DESIGN.md` ↔ production-code conflict. Verify what's loaded with `/context`.

## Working principles

Guardrails against common LLM coding mistakes — bias to caution over speed (use judgment on trivial tasks).

**1. Think before coding.** State assumptions; if uncertain, ask. Multiple interpretations → present them, don't pick silently. Simpler approach exists → say so, push back when warranted. Unclear → stop, name it, ask.

**2. Simplicity first.** Minimum code that solves the problem, nothing speculative — no unrequested features, abstractions, flexibility, or error handling for impossible cases. If 200 lines could be 50, rewrite.

**3. Surgical changes.** Touch only what the request needs; match existing style; don't "improve" adjacent code, comments, or formatting. Notice unrelated dead code → mention it, don't delete. Every changed line traces directly to the request.

**4. Goal-driven execution.** Turn tasks into verifiable goals (bug → failing repro, then fix; "add validation" → tests for bad input, then pass). Multi-step → brief plan + per-step verify, then loop until green.

## Commands

```bash
pnpm dev / build / tsc / lint / format    # standard
pnpm verify                               # CI gate (tsc + lint + format + contrast + react-doctor on changed code)
pnpm verify:quick                         # tsc + lint (manual pre-PR check)
pnpm shadscan                             # shadcn/ui fundamentals audit — scores UX 0–100 (62 rules); --prompt for an AI fix-plan
```

**`pnpm shadscan`** (`@shadscan/cli`) — deterministic scan of shadcn UI fundamentals (foundation, interaction, states, a11y, forms, polish). No config, no build, no app secrets. Manual audit like `pnpm doctor`; not in the `verify` gate. Add `--json` for CI (`--fail-under <n>`) or `--prompt` to hand the remediation plan to an agent.

Pre-commit hook: `lint-staged` (eslint --fix + prettier on staged files) then `tsc`. No pre-push hook — CI is the backstop. Code must be type-checked and lint-clean, but that's gated at commit time — don't pre-run `tsc`/`lint` after every edit; the commit is the gate.

## Documentation site (VitePress)

Human-facing docs live in `docs/` as a standalone **VitePress** site — own `docs/package.json` + `docs/.vitepress/config.mts`, **npm-managed and isolated** from the pnpm app (deps never touch the app tree). Root scripts delegate via `npm --prefix docs`; `README.md` indexes every page; static build deploys to Vercel.

```bash
pnpm docs:install          # once (npm install inside docs/)
pnpm docs                  # dev server → http://localhost:3002
pnpm docs:build            # static output → docs/.vitepress/dist
```

Folders: `setup/ config/ design/ seo/` (topic guides), `features/<name>/` (mirrors `src/features/<name>/`), `client-intake/` (per-language client forms). Adding a doc: drop the `.md`, add one sidebar line in `docs/.vitepress/config.mts`, **and** a README index row — keep those three in sync. `docs/{node_modules,.vitepress/cache,.vitepress/dist}` are gitignored.

## Architecture

Feature-based: shared code in flat top-level folders; each domain owns a
`features/<name>/` folder. Full rationale in `docs/config/project-organization.md`.

```
src/config/index.ts        Pure data — site, theme, fonts, locales, features, navigation, seoDefaults, llms, pages, analytics
src/config/types.ts        Types + helpers (isLocale, FontRoles, …)

src/app/                   ROUTES ONLY (thin page.tsx / route.ts)
   [locale]/<seg>/         One route per folder (page.tsx). Home = (home) route group.
   routes.ts               Auto-aggregates `pages` map → ROUTES + PATHNAMES
   studio/  maintenance/   embedded Studio + maintenance page (own root layouts)

src/features/blog/         THE BLOG FEATURE (self-contained, gated by features.blog)
   user-interface/         organized by route (like src/user-interface/) — blog/ post/ author/
                           category/ tag/, each split into sections/ components/ layout/ as needed;
                           + renderers/ (page-builder) + shared/{sections,components} (multi-page)
   sanity/                 schema/ + queries.ts + types.ts + structure.ts + portable-to-markdown.ts
   lib/route-gate.ts       requireBlogRoute / isBlogRouteEnabled / isRssEnabled

src/user-interface/        SHARED, cross-feature UI — organized by page, then category
   ui/                     shadcn primitives (READ-ONLY, CLI-managed → components.json)
   homepage/sections/      marketing blocks — copy targets from the sibling library
   error/ maintenance/ not-found/   per-page folders, each: components/<Composite>
   shared/layout/          chrome: DefaultLayout, Header, Footer, ThemeToggle, CookieBanner…
   shared/components/      BrandIcon (SSR-safe wrapper — renders any BrandMark; reicon-brands or hand-declared)

src/lib/                   SHARED utils/services
   metadata.ts             buildMetadata({ page, locale }) — inherits site → page
   fonts.ts                next/font registry (Geist google + Satoshi local) → --font-* vars
   faq.ts  theme.ts  video-embed.ts  slugify.ts  logger.ts  utils.ts
   seo/jsonld.tsx          Auto-emitted: Organization + WebSite + WebPage (+ FAQ)
   seo/jsonld-factories.tsx  On-demand: Article, Service, Product, LocalBusiness, Person, Breadcrumb
   seo/page-markdown.ts    Backs /llms.txt + /llms-full.txt + /llms/<id> (all pages)

src/sanity/                CORE Sanity infra: client, live, env, token, image, Studio
src/hooks/  src/i18n/  src/types/   shared hooks / routing / ambient types
src/assets/fonts/          build-imported .woff2 (next/font/local). URL-served files → /public
sanity.config.ts           Studio config — registers features/blog/sanity/schema + structure

messages/<locale>.json     Single flat tree — chrome + pages.<id>.{title, description, blocks}
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

_Checklist: [`.claude/workflows/add-page.md`](.claude/workflows/add-page.md)._

1. `src/app/[locale]/<seg>/page.tsx`
2. Entry in `pages` (config/index.ts): `{ key, id, slug, seo: { keywords } }`
3. Key in `AppPathname` (`src/config/types.ts`)
4. `pages.<id>.title` + `pages.<id>.description` in every `messages/<locale>.json`

Propagates automatically: sitemap, routing, llms.txt × locales, SEO metadata, JSON-LD WebPage.

## Working with the library (shadcn/ui + `../indiecrafts-library`)

_Checklist: [`.claude/workflows/adapt-library-section.md`](.claude/workflows/adapt-library-section.md)._

Two building blocks feed the UI: **shadcn/ui** primitives (`src/user-interface/ui`, CLI-managed) and the sibling **`../indiecrafts-library`** — a Storybook-only browse surface with **zero runtime imports** from the app. The pattern is always **copy then adapt to the template's conventions**, never depend.

**Reuse before create.** Before adding UI: reuse an existing part → add a backward-compatible variant → compose primitives → new shared part (`user-interface/`) → page-specific. Never duplicate a part just because it has a different name. When sources disagree, authority runs: `user-interface/ui` + `config`/`globals.css` tokens (canonical) → the library (a reference to adapt, not copy verbatim) → screenshots.

To adapt a library section:

1. Browse the variant in Storybook (`cd ../indiecrafts-library && pnpm storybook`).
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

**Auto-emitted JSON-LD:** Organization, WebSite (layout), WebPage (per page via `<PageSchemas>`). Per-page extras → `page.seo.structuredData[]` using factories from `@/lib/seo/jsonld-factories`. Cookbook in `docs/seo/structured-data-cookbook.md`.

**FAQ is the highest-ROI rich result** for B2B. Wire it via `buildFAQPageSchema(...)`.

## LLM endpoints

`/<locale>/llms.txt`, `/<locale>/llms-full.txt`, `/<locale>/llms/<id>` — all auto-built from `messages.<locale>.pages.*`. **Zero per-page config.** Add a page → it appears in all three, in every locale. Published blog posts are appended to `llms.txt` + `llms-full.txt` as a `## Blog` section (each links to its `/blog/<slug>/md` export) via `getBlogLlmsLines` in `features/blog/lib/llms.ts` — gated by `features.blog`, `noIndex` posts excluded.

## Sanity + blog (feature-flagged)

Two independent flags in `config`: **`features.blog`** (public surface — every blog route 404s and drops from sitemap + llms.txt + header nav when off) and **`features.studio`** (the Studio at `/studio` + draft-mode preview; independent of `blog`). Public-blog gating is centralized in `@/features/blog/lib/route-gate`.

Details live with the code they describe (Claude Code auto-loads these when you work in those dirs):

- Blog feature — schema, page-builder modules, per-post layout, gating → **`src/features/blog/CLAUDE.md`**
- Sanity infra — client, live/draft-mode, env, "never new `createClient`" → **`src/sanity/CLAUDE.md`**
- Human-facing docs → `docs/blog/`.

## Accessibility (structural)

The **visual system** — colors, typography, spacing, dark mode, motion, contrast — lives in **`DESIGN.md`** (repo root). CLAUDE.md keeps only the structural, code-level rules:

- `<html lang>` + `dir` from the active locale. `SkipLink` first in the body, targets `#main`. Exactly one `<main id="main" tabIndex={-1}>` per layout. Sections use `<section aria-labelledby="…">`. Icons `aria-hidden="true"` unless the sole label.
- `jsx-a11y` rules are errors (eslint); `pnpm verify:contrast` gates WCAG AA on the theme tokens (see Verification).

## Critical rules (the NEVERs)

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries — read from `@/config`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER add `as any` — fix the type, or eslint-disable with a one-line reason.
- NEVER edit `src/user-interface/ui/**` (shadcn — managed via CLI).
- NEVER depend on `../indiecrafts-library` at runtime — it's browse-only, copy what you need.
- NEVER swallow errors — `logger.error(...)` minimum.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- NEVER instantiate a Sanity `createClient` per route — use `@/sanity/client`.
- NEVER expose `SANITY_API_READ_TOKEN` (or any non-public Sanity token) under a `NEXT_PUBLIC_` prefix.
- ALWAYS maximise use of the `frontend-design` skill when building or reshaping UI — lean on it for aesthetic direction, typography, and layout so nothing reads as a templated default.
- ALWAYS ship responsive UI optimised for every screen size we support (Tailwind `sm 640 · md 768 · lg 1024 · xl 1280`, mobile-first) — verify each change at **375 / 768 / 1280** before shipping. See `DESIGN.md` § Responsive behavior.
- ALWAYS `setRequestLocale(locale)` at the top of server components using translations or metadata.
- ALWAYS update the docs when you change what they describe — every change to a feature, flag, config shape, route, or convention updates the matching `docs/` page **and** the README index **and** the `docs/.vitepress/config.mts` sidebar (add/rename/remove in lockstep). Docs are part of the change, not a follow-up.
- ALWAYS log behavior/config/route/convention **and** design-token changes in the shared root `CHANGELOG.md` (one file for code + design) with a plain-language _why_.
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
