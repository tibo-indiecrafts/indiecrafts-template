# Project organization & architecture

How the codebase is laid out and where new code goes. The guiding idea: **shared,
cross-cutting code is a package; a self-contained product feature is a module; app-specific
code stays in the app.** Flipping a `features.*` flag maps cleanly onto a folder.

## Four root folders

The repo root holds four sibling pillars that mirror each other's shape:

```text
code/     EXECUTION — the pnpm + Turbo workspace (workspace root = repo root)
method/   HOW we work — 7-phase sprint, rules, workflows (read-mostly canon)
work/     DOING — per-feature sprint deliverables + MEMORY.md / backlog.md
docs/     CANON — product docs (this VitePress site)
```

`docs/`, `method/`, `work/` are **npm-isolated** from the pnpm workspace (each has its own
lockfile + `node_modules`). Run app scripts from the repo root — `pnpm dev`/`build`/… delegate
to `--filter @indiecrafts/web`.

## `code/` internals

```text
code/
├── apps/web/       the Next.js app (@indiecrafts/web) — its src/ is detailed below
├── packages/       shared bricks (config · utils · sanity · ui · ui-tokens · i18n)
├── modules/        product features — blog (@indiecrafts/blog); shop/events… reserved
├── db/  infra/     reserved (schema·migrations·seed · envs·iac·ci)
```

The **workspace root is the repo root** (`package.json`, `pnpm-workspace.yaml`, `turbo.json`).

### Packages — `code/packages/*`

Extracted when **≥2 consumers** use them; consumed **as source** (no build step) via Next
`transpilePackages` + pnpm workspace symlinks.

| Package | Holds | Exports |
| --- | --- | --- |
| `@indiecrafts/config` | site config data + types/helpers; `localizedPathname` | `.`, `./types` |
| `@indiecrafts/utils` | `cn` · logger · slugify · video-embed · consent-signals · format-date | `.` (barrel) |
| `@indiecrafts/sanity` | Sanity infra: client · live · env · token · structure | subpath-only (no `.`) |
| `@indiecrafts/ui` | shadcn primitives + `use-mobile` | `./*` → `src/*.tsx`, `./use-mobile` |
| `@indiecrafts/ui-tokens` | `globals.css` · `typeset.css` · `DESIGN.md` | CSS-only (`./globals.css`, `./typeset.css`) |
| `@indiecrafts/i18n` | shared next-intl navigation for **modules** (untyped `Link`) | `.` |

### The blog module — `code/modules/blog`

`@indiecrafts/blog` is a self-contained vertical slice (`user-interface/ sanity/ lib/`),
gated by `features.blog` + `features.studio`. It's wired into the app by six mechanisms:
a tsconfig `paths` entry (`"@indiecrafts/blog/*": ["../../modules/blog/src/*"]`), the
`transpilePackages` list, an `@source` line in `tokens/globals.css` (Tailwind scans its UI),
schema + structure registration in `sanity.config.ts`, the `route-gate`, and the `blog` flag.

## App internals — `code/apps/web/src/`

```text
src/
├── app/            App Router — ROUTES ONLY (thin page.tsx / route.ts)
│   ├── [locale]/       localized pages + route handlers (llms, rss, atom, md)
│   ├── api/            draft-mode enable/disable, i18n slug helpers
│   ├── studio/         embedded Sanity Studio (own root layout)
│   ├── maintenance/    maintenance page (own root layout)
│   ├── routes.ts       aggregates the `pages` map → ROUTES + PATHNAMES
│   └── manifest/robots/sitemap …  metadata routes
│
├── user-interface/ app UI — by page, then category
│   ├── homepage/       homepage-specific UI → sections/
│   ├── error/ maintenance/ not-found/ legal/   per-surface folders
│   └── shared/         layout/ (Header, Footer, ThemeToggle, CookieBanner…) + components/
│
├── lib/            app services: metadata · seo/ · theme · fonts · navigation · cookies ·
│                   social · faq · system-pages
├── sanity/         app Sanity: {nav,legal,cookie,seo}-queries · schema/ (core) · Studio.tsx
├── i18n/           typed routing (PATHNAMES from app routes) — the app's typed Link
├── hooks/  types/  useConsent · ambient types
├── assets/fonts/   build-IMPORTED .woff2 (Satoshi) for next/font/local
└── (public/)       — sibling of src/ — URL-served static files
```

App primitives come from the `@indiecrafts/ui` **package**, not a local `ui/` dir. Note
`src/config/` is an **empty** directory — the canonical config import is `@indiecrafts/config`
(there is no `@/config` tsconfig path).

## The "where does a file go?" rules

1. **Used by exactly one product feature → `code/modules/<name>/`.** The blog's views, GROQ,
   schema, and route-gating all live under `code/modules/blog/`. Deleting a feature = deleting
   one module.
2. **Used by ≥2 consumers (app + module, or app #2) → a `code/packages/` brick.** Extract only
   at that second consumer — one consumer means it stays in the app (YAGNI).
3. **App-specific + site-wide → a flat top-level folder in the app** (`user-interface/`,
   `lib/`, `hooks/`).
4. **Routes stay in `app/`.** A `page.tsx` should be thin and import its heavy lifting from a
   module or `user-interface/`.

## `public/` vs `src/assets/`

- **`public/`** — files referenced by a **URL string**, served verbatim. Brand assets (logo,
  favicon/app icon, OG card) are edited in **Sanity**, not here; `robots.txt`/`sitemap.xml`
  are App Router routes.
- **`src/assets/`** — files **`import`ed into code**: the `.woff2` fonts read by
  `next/font/local`. Never URL-served images; never fonts in `public/`.

(A `.tsx` that renders an `<svg>` is a **component**, not an asset — it lives in
`user-interface/`.)

## Imports & conventions

- Alias: `@/*` → `src/*`. Only `@/*` and `@indiecrafts/blog/*` are declared in tsconfig
  `paths`; the other `@indiecrafts/*` packages resolve via pnpm workspace symlinks + their
  `exports` maps.
- **No barrel files.** Import deep
  (`@indiecrafts/blog/user-interface/post/layout/DefaultPostLayout`,
  `@/user-interface/homepage/sections/Features`), not through an `index.ts` — a single barrel
  would taint on `route-gate`'s `server-only` import and defeat tree-shaking.
- Naming: `PascalCase.tsx` for components, `kebab-case.ts` for lib/util modules.
- Never import from `next/link` / `next-intl/navigation` directly — use `@/i18n/routing`.
  Never hand-edit shadcn primitives in `@indiecrafts/ui` (CLI-managed).

## Adding a new feature module

Mirror `code/modules/blog/`: create `code/modules/<name>/` with `package.json`
(`@indiecrafts/<name>`, `exports`), add a `features.<name>` flag in `@indiecrafts/config`,
gate its routes with a `require<Name>Route` helper in `lib/`, and keep its `app/` routes thin.
Wire it in: `transpilePackages` + tsconfig `paths` + an `@source` line in `tokens/globals.css`
+ schema/structure registration in `sanity.config.ts`. The full extraction checklist lives
in `code/modules/CLAUDE.md`.
