# Modules — product-feature docs

**Vertical product slices** — blog · shop · events · community · … — each feature-flagged,
composed from `code/packages/` bricks, and mounted by an app. This page is _what they are_;
the full build pattern lives in
[`method/modules/architecture.md`](../../method/modules/architecture.md).

## What a module is

- A **vertical, gated slice**: its routes, UI, and data live together, and every public
  surface 404s + drops from sitemap/nav when its flag is off.
- **Composed, not coupled**: a module may depend on `packages/` bricks and `db/`, but
  **never on an app** or another module. Deps point down: `app → module → package`.
- **Consumed as source** via the app's Next `transpilePackages` — no per-module build.

## Extracted

| Module | Package | Holds | Flag | Consumed by |
| --- | --- | --- | --- | --- |
| Blog | `@indiecrafts/blog` | the blog slice — `user-interface/ · sanity/ · lib/` + route-gate | `features.blog` | app |

`code/modules/blog/` is the **live reference** — self-contained, depending on all five
shared bricks (`config`/`utils`/`sanity`/`ui`/`i18n`) plus `@portabletext/react`,
`@sanity/icons`, `embla-carousel-react`, `lucide-react`, `next-intl`, `next-sanity`, and
`sanity ^5.26.0`. Its links use `@indiecrafts/i18n` navigation (the app keeps typed
routing). Read it before extracting a module here.

### Its src shape (`code/modules/blog/src/`)

- **`sanity/`** — `queries.ts`, `types.ts`, `structure.ts`, `portable-to-markdown.ts`, and
  `schema/` (documents `post`/`author`/`category`/`tag`/`quote`/`person` + the `blog`
  singleton, objects, and the 12 page-builder module schemas exporting `schemaTypes`).
- **`user-interface/`** — grouped by surface (`post/`, `category/`, `author/`, `tag/`,
  `blog/`, `shared/`, `renderers/`), each with `sections/` + `components/`.
- **`lib/`** — `route-gate.ts` (the single gating source: `isBlogRouteEnabled`,
  `requireBlogRoute`, `isRssEnabled`) and `llms.ts` (`getBlogLlmsLines`).

## How the app mounts it (six mechanisms)

The blog is a mixed `.ts`/`.tsx` package, so it wires differently from the single-extension
bricks:

1. **`exports`** — `"./*": "./src/*"` (no extension in the map; Next resolves the
   dir-index / `.ts` / `.tsx` at runtime).
2. **tsconfig `paths`** in `code/apps/web/tsconfig.json`:
   `"@indiecrafts/blog/*": ["../../modules/blog/src/*"]` — needed because the wildcard has
   no extension (the other bricks resolve via workspace symlinks + `exports`).
3. **`transpilePackages`** in `next.config.ts` lists `@indiecrafts/blog` alongside every
   `@indiecrafts/*` brick.
4. **`@source`** line in `tokens/globals.css` (`../../../modules/blog/src`) so Tailwind
   scans its UI for classes.
5. **`sanity.config.ts`** registration — imports `schemaTypes` from
   `@indiecrafts/blog/sanity/schema` and `structure` from
   `@indiecrafts/blog/sanity/structure`, merged into `schema.types` and `structureTool`.
6. **Feature flag** `features.blog` gates the public surface; taxonomy sub-routes gate on
   `features.blogTaxonomy.{authors,categories,tags}`. Independent of `features.studio`
   (Studio + draft mode).

## Adding a module

1. Read [`method/modules/architecture.md`](../../method/modules/architecture.md) for the
   full vertical-slice pattern.
2. Extract at a **genuine vertical slice or ≥2 consumers** (YAGNI) — the blog earned it as
   a self-contained, flag-gated feature; don't pre-extract a thin one.
3. On extraction: `git mv` the slice; give it a `package.json` (`@indiecrafts/<name>`,
   `exports`); add it to the app's `transpilePackages` + a tsconfig `paths` entry (for
   mixed `.ts`/`.tsx`); add a `@source` line in `tokens/globals.css`; register its Sanity
   schema/structure in `sanity.config.ts` if it has any; move its docs to
   `docs/modules/<name>/` (+ sidebar lines); add its own module-root `CLAUDE.md`; register it
   in [`code/modules/_registry.md`](../../code/modules/_registry.md); and log it in the area
   [`code/modules/CHANGELOG.md`](../../code/modules/CHANGELOG.md) (modules don't get a
   per-module changelog).

Reserved (names only): `shop · events · community · learning · booking · jobs · newsletter ·
support · crm`.

## Where it sits (the four-folder mirror)

`code/modules/` (build) ↔ `method/modules/` (how) ↔ `docs/modules/` (what — this page). A
`<name>` module gets its own `docs/modules/<name>/` folder once physically extracted to
`code/modules/<name>/`.

## Pointers

- [`method/modules/architecture.md`](../../method/modules/architecture.md) — how we build modules
- [`code/modules/CLAUDE.md`](../../code/modules/CLAUDE.md) — agent conventions for this slot
- [`code/modules/_registry.md`](../../code/modules/_registry.md) — the module roster + rule
- The live reference → `code/modules/blog/src/`
