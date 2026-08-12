# Changelog — app (`@indiecrafts/web`)

One shared record for **code and design** — every change that alters behavior,
config, a route/convention, or a design token lands here in plain language,
explaining the _why_, not just the _what_. Dev and design write to the same file
so an agent (or a client) reads one history, not two.

**Not here:** docs-site changes → [`docs/CHANGELOG.md`](../../../docs/CHANGELOG.md);
method/framework → [`method/CHANGELOG.md`](../../../method/CHANGELOG.md); lab →
[`work/CHANGELOG.md`](../../../work/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../CHANGELOG.md).

- **Design/token changes** are also governed by `DESIGN.md` (the token contract);
  **code/convention changes** by `CLAUDE.md`. This file is where both are logged.
- Format follows [Keep a Changelog](https://keepachangelog.com); versions are
  `[major.minor.patch]`. Categories: **Added · Changed · Deprecated · Removed ·
  Fixed**. Tag design-only entries with _(design)_ for quick scanning.
- After any token change, re-sync `theme.hexColors` and run `pnpm verify:contrast`.

## [Unreleased]

### Added

- **Sanity images sized at the CDN (`next/image` loader).** A `next/image` loader
  (`@indiecrafts/sanity/image`, wired via `images.loaderFile`) rewrites every image `src`
  to a CDN-sized source (`?w=&q=&auto=format&fit=max`) — Sanity + Unsplash resize/re-encode
  at the edge, so the full-resolution original is never downloaded and there's no
  double-fetch through Next's optimizer. Zero per-call changes (the 13 `next/image` sites
  already pass `sizes`/`fill`). Also fixed the three sites the loader can't reach: the
  gallery full-view raw `<img>` (`?w=1600`), the markdown export (`?w=1200`), and the
  `unoptimized` **logo** (raster logos now `?w=192`; the loader's SVG guard keeps vector
  logos untouched). _Why:_ covers previously shipped full-res originals into small slots.
  New rule `method/apps/web/rules/sanity-images.md` + NEVER in `CLAUDE.md`; guide
  `docs/apps/web/config/images.md`.
- **`DESIGN.md` — spacing scale + interaction-state tokens** _(design)_. Added a numeric
  `spacing` step scale (`xs 4 · sm 8 · md 16 · lg 24 · xl 32`) so layout gaps come from a
  fixed vocabulary, and tokenized the two button hover deltas as `button-primary-hover` /
  `button-secondary-hover` variants (hover = tint/`muted` fill, disabled = 50% opacity — no
  new hue). Also aligned the `components` block to the Google spec sub-token names
  (`textColor`/`rounded`), added a `primary` alias for `brand`, and fixed the `letterSpacing`
  + stale-path lint errors: `npx @google/design.md lint` now reports **0 errors** (was 3).
- **Chip contrast fix** _(design)_. Darkened light `--muted-foreground` `oklch(0.556)` →
  `oklch(0.52)` (`#737373` → `#696969`) so `muted-foreground` on `--muted` (chips, `text-xs`)
  clears WCAG AA — **5.05:1**, was 4.0:1. Surfaced by the Google linter, which our own
  `verify:contrast` missed. Added the `muted-foreground`/`muted` pair to
  `scripts/check-contrast.mjs` so the gate now covers it. Dark mode already passed (6.9:1);
  hex mirror synced in `DESIGN.md`.
- **Homepage page-builder demo (`BlocksShowcase`).** A server section on the home page that
  renders `stat-list`, `step-list`, and `card-list` through the shared
  `@indiecrafts/ui-components` renderers — visible proof marketing pages and blog posts paint
  the **same** blocks. Chrome (`eyebrow`/`title`/`body`) reads from
  `pages.home.blocks.blocks`; the block payloads are inline demo fixtures standing in for
  Sanity-authored content. _Known gap:_ the demo fixtures are English-only (they mimic CMS
  content, not translated copy) — real `page` documents feed localized content from Sanity.

### Changed

- **Extracted the app into workspace packages + a blog module** (deps point down: app → module → packages).
  Packages: `@indiecrafts/config` (site config + types; cut the `MessageKey` coupling → `PageSeo` keys
  are `string`), `@indiecrafts/utils` (`cn`/logger/slugify/video-embed/consent-signals/format-date),
  `@indiecrafts/sanity` (client/live/env/token + `structure` builders), `@indiecrafts/ui` (61 shadcn
  primitives + `use-mobile`), `@indiecrafts/ui-tokens` (the design system — `globals.css`/`typeset.css`/`DESIGN.md`),
  `@indiecrafts/i18n` (shared next-intl nav for modules). Module: `@indiecrafts/blog` → `code/modules/blog`
  (queries + Studio stay in the app; app registers its schema via `sanity.config`). Consumed as source via
  `transpilePackages`; Tailwind `@source` scans the ui + blog packages. Fixed a latent broken import
  (`carousel` → uninstalled `@tabler`, now lucide). tsc + build green, every route × locale prerenders.

- **Analytics + cookie consent moved to Sanity; `features.cookieBanner` removed.**
  The GA measurement id and a `requireCookieConsent` toggle now live in
  `siteSettings.analytics` (Studio → Paramètres du site → Analytics & cookies),
  read by `getSiteSettings()`; the layout gates the GA script + Consent-Mode
  preamble + `<CookieBanner>` off those, and `CookieBanner` takes a `gaEnabled`
  prop (client can't read Sanity). Removed the `analytics` config export + the
  `cookieBanner` flag. Search-verification codes were already Sanity-driven — the
  dead `seoDefaults.verification` is gone and the seed now ships demo google/bing
  codes + a demo GA id. **CSP:** since the GA id is now a runtime value, `next.config.ts`
  allows Google's domains unconditionally (was build-narrowed). _Why:_ a client can
  paste their GA id + flip consent in the Studio with no redeploy, and the two are
  now coupled (consent actually gates GA). Also fixed a latent bug this surfaced:
  `<CookieBanner>` (a client component calling `useTranslations`) was rendered
  outside `NextIntlClientProvider` — dormant while the flag defaulted off, it
  500'd once Sanity enabled the banner; moved inside the provider.

- **Trimmed the `features` flag comments in `src/config/index.ts`** to one line each
  (the file dropped from ~51% comments). Full per-flag behavior already lives in
  `docs/apps/web/config/feature-flags.md` — the config now points there instead of
  duplicating it. _Why:_ one home per fact; duplicated docs drift.

### Added

- **Complete cookie-consent (CMP) in Sanity.** The old all-or-nothing bar becomes a full consent
  manager: a `cookieConsent` singleton (Studio → **Cookies & consentement**) holds banner copy,
  consent **categories** (necessary + analytics/marketing/preferences, each mapping to Google
  Consent-Mode signals), and a **cookie inventory**. The banner offers **Reject all / Customize /
  Accept all** (equal weight, GDPR); a **preferences dialog** (shadcn `Dialog` + `Switch`) toggles
  each category (optional default off); choices persist in `localStorage` with a `version` (bump →
  re-prompt) + timestamp and push a per-signal `gtag('consent','update')`. The cookie-policy page
  auto-renders the inventory (grouped cards) + a Manage-preferences button. **App consent slots:**
  `useConsent()` (`@/hooks`), `<ConsentGate category>` and `<ConsentScript category …>` load any
  third-party pixel/embed only after its category is granted (GA still loads always, gated via
  Consent Mode). Read path `getCookieConsent()` (`src/lib/cookies.ts`, React `cache()`, Sanity-only).
  Guide: `docs/apps/web/config/cookie-consent.md`.

- **Navigation + footer menus are now edited in Sanity.** The header menu and
  footer columns move out of `@/config` (`headerNav` / `footerNav` and the
  `NavLink` / `NavGroup` types are removed) into a new `navigation` singleton —
  the **sole runtime source, no config fallback** (same contract as the SEO
  surface). One shared structure with per-language labels (`localeString`); each
  link is a reusable `navItem` with an internal (typed route key) / external
  toggle. Internal links are flag-gated at read time, so a link to a disabled
  route (e.g. CGV, or any blog route) silently drops — no dead links. Read via
  `getNavigation(locale)` (`src/lib/navigation.ts`, React `cache()`, empty-on-
  error). _Why:_ a client can reorder, rename, add, or regroup menu items without
  a code edit. **Header dropdowns + rich links:** a header item can have a
  `children` submenu (renders as a shadcn `NavigationMenu` dropdown), and each
  dropdown link can carry a free-text Reicon `icon` + a `description`. A new
  Studio **Navigation** desk section; `pnpm seed` writes a starter menu (Home +
  Blog, a demo Resources dropdown, a Legal footer column). Guide:
  `code/docs/config/navigation.md`.
- **Legal pages: `/legal` split into five dedicated, Sanity-editable pages.** Renamed
  the single legal page to **Mentions légales** and added **Privacy policy** (RGPD),
  **Cookie policy**, **Terms of use (CGU)**, and **Terms of sale (CGV)** — each a
  static route with a per-locale slug (French primary) and its own `features.legal.*`
  toggle. The **body is edited in Sanity** (new core `legalPage` doc, translated,
  rendered by a minimal blog-decoupled `LegalBody` PortableText serializer); SEO comes
  from the existing `siteMeta.pageSeo`. A "Pages légales" Studio desk section + 10
  seeded boilerplate docs (LCEN / RGPD / ePrivacy structure, `[bracketed]` placeholders
  + a "have a lawyer review it" note). `features.legalPage` → `features.legal` group;
  footer now shows a **Legal** group of the enabled pages. Guide:
  `code/docs/config/legal-pages.md`.
- **Footer follow block + social profiles fully in Sanity.** The dead `site.social`
  config block is removed; `siteSettings.social` (clearer per-platform legends) is the
  sole source. A new `SocialFollow` footer block renders the profiles as icon links
  (`reicon-brands` marks via `BrandIcon` + a hand-declared LinkedIn), each icon taking
  its official brand color on hover/focus and carrying `rel="me"`. One helper
  `socialLinks` (`src/lib/social.ts`) drives **both** the visible links and the
  Organization `sameAs` JSON-LD, so they can't drift.

- **SEO, llms.txt, and structured data are now edited in Sanity Studio, per
  language** — the client-intake SEO data no longer requires a code edit after
  launch. Two singletons under **Studio → SEO & métadonnées** are the **sole
  runtime source** (no config/messages fallback): `siteMeta.<locale>` (tagline,
  description, keywords, OG card, llms.txt summary + resources, and per-page
  `pageSeo` title/description/keywords/share-card) and `siteSettings` (social
  profiles, schema.org business type + LocalBusiness fields, and an editor-picked
  list of extra global schemas — Service / Product / Person / Event). Read through
  `getSiteSeo` / `getSiteSettings` (`src/lib/seo/site-seo.ts`, React `cache()` —
  one fetch per request shared by metadata, JSON-LD, layout, and the `/llms*`
  routes). _Why:_ clients need to change their own titles, descriptions, share
  cards, and structured data without a developer. Guide:
  `docs/seo/editing-seo-in-sanity.md`.
- **Full per-page SEO overrides in Sanity.** Each `pageSeo` entry now also carries
  a **canonical URL**, a **noindex** toggle (drops the page from `robots`, the
  sitemap — per locale — and the llms.txt/llms-full index), a dedicated
  **rich-result image**, OG image **alt text**, and **page-specific structured
  data** (Service / Product / Person / Event, merged into that page's JSON-LD).
- **Site-wide base-metadata defaults in Sanity.** `siteSettings` gains
  **Search Console verification codes** (Google / Bing — now editor-set, replacing
  the config values in the `<head>`) and Organization identity fields
  (`legalName`, `alternateName`), all emitted in the Organization JSON-LD.
- **Logo + favicon/app icon are edited in Sanity.** `siteSettings` gains `logo`,
  `logoDark` (optional dark-theme logo), and `icon`. The header/footer logo swaps
  light↔dark with a pure-CSS `data-theme` variant (no JS, no flash, works for
  light / dark / system / forced). Favicon + apple-touch come from the layout's
  `generateMetadata.icons`; PWA icons from `manifest.ts`; Organization JSON-LD logo
  from `siteSettings.logo` — all Sanity-only, **no config fallback** (empty = wordmark
  / no favicon). Removed `app/icon.tsx` + `app/apple-icon.tsx`, the `site.logo` /
  `site.brandLogoPng` / `site.icon` config, and the now-unused `/public/logo.svg` +
  `/public/brand/{logo,apple-icon,icon-192,icon-512,icon-maskable-512}.png`.
- **The Open Graph card is also Sanity-only now** — moved out of `/public`. Removed
  `app/opengraph-image.tsx` + `site.ogImage` + `/public/brand/og*.png`; `og:image`
  comes from `siteMeta.<locale>.ogImage` / `pageSeo.ogImage` and is omitted when
  unset (`seed` uploads the defaults). **`/public` no longer holds any brand asset.**
- **Site-wide robots toggle in Sanity.** `siteSettings.robots` (`noindex` /
  `nofollow`) applies `noindex` / `nofollow` to every page — a one-switch way to keep
  a staging/holding site out of search, editor-controlled.
- **Per-page `llmsSummary` field** — a short summary (a few sentences, flattened to a
  single bullet line) for the `/llms.txt` index per page (`pageSeo.llmsSummary`, else
  the SEO description). Pairs with `llmsFull`.
- **Blog posts get llms overrides** — `metadata.llmsSummary` (the `## Blog` line, else
  the meta description) + `metadata.llmsFull` (the `/md` export body, else the
  serialized PortableText body).
- **Taxonomy pages (categories / tags / authors) now appear in the llms endpoints** —
  `getTaxonomyLlmsLines` emits `## Categories` / `## Tags` / `## Authors` sections in
  `/llms.txt` (one line per detail page) and `/llms-full.txt` (with each doc's
  `seo.llmsFull` body inlined). `seoMeta` gained `llmsSummary` + `llmsFull`; gated by
  `features.blogTaxonomy.*` + per-doc noindex.
- **Per-page `llmsFull` field; llms-full is now Sanity-only.** Each `pageSeo` entry
  gains a free Markdown **`llmsFull`** body that drives that page's section in
  `/llms-full.txt` + `/llms/<id>`. **Removed the entire auto-generation mechanism**
  that walked `messages.pages.<id>` into Markdown (plus the auto `## FAQ` block) —
  `renderPageMarkdown` is now head (Sanity title/description) + `llmsFull`, no
  messages fallback. `/llms.txt` (the one-line index) is unchanged. Also added an
  explicit `robots: noindex` to the 404 page (belt-and-suspenders; the 404/500 HTTP
  status already deindexes, and neither they nor `/maintenance` are in the sitemap or
  llms endpoints). Also added a **site-level `llms.full`** intro
  (`siteMeta.<locale>.llms.full`) prepended to `/llms-full.txt`.
- **Taxonomy index-page copy editable in Sanity.** The category / tag / author
  listing pages' heading + subheading + empty-state text move to
  `siteMeta.<locale>.taxonomyPages` (read `?? messages` per field — always-rendered
  UI keeps the bundled fallback). The ICU post-count + breadcrumb aria strings stay
  in `messages`.
- **System-page copy (maintenance + 404) editable in Sanity.**
  `siteMeta.<locale>.systemPages` holds the maintenance + 404 text; the pages read
  it via `getSystemPages` (`src/lib/system-pages.ts`) **`?? messages/<locale>.json`**
  per field — deliberately keeping the bundled fallback because these are failure
  pages that must render even when Sanity is down. The **500 error page** stays on
  `messages` only (Next client error boundary — can't safely fetch). `NotFound`
  became presentational; `not-found.tsx` + `maintenance/page.tsx` resolve the copy.

### Changed

- **The SEO documents moved from `features/blog` into core `src/sanity/`** so
  site-wide SEO survives with the blog feature removed. `sanity.config.ts` now
  registers `coreSchemaTypes` alongside the blog schema, and the blog desk composes
  the core `seoStructureItem`. A field left empty in Sanity is simply empty on the
  site (framework default); `pnpm seed` populates both singletons.

### Fixed

- `.prettierignore` no longer walks generated / read-only trees, so `pnpm verify`'s
  `format:check` (`prettier --check .`) stops failing on files it should never lint.
  Added `docs/.vitepress/dist/` + `docs/.vitepress/cache/` (VitePress build output —
  110 warnings the moment docs are built) and corrected the stale shadcn path
  `src/components/ui-primitives/` → `src/user-interface/ui/` (the UI reorg moved the
  CLI-managed primitives; prettier had been reformatting ~60 READ-ONLY files).
  One-time `pnpm format` cleared the pre-existing authored-file backlog. _Why:_
  `.prettierignore` had drifted from the real tree, so the format gate flagged
  hundreds of files nobody edits.

### Fixed

- Moved the `body` + `h1–h6` **font-family** rules in `globals.css` into `@layer base`.
  They were unlayered, so an unlayered element rule beat Tailwind's `font-sans`/
  `font-display` utilities — a `<h2 className="font-sans">` silently stayed on the
  display face. Now utilities win per element. Verified safe: `@tailwindcss/typography`
  sets no heading font-family, so the base rules still cascade into `.prose`/`.typeset`
  and headings keep the display face there. (No heading in the template hit this yet —
  it was a latent trap for client forks.)

### Changed

- OG images are now **one card per language, site-wide** — no per-page cards. Removed
  the home page's `og-home.png` override (it was a byte-identical duplicate of `og.png`)
  and deleted the file. `pageOgImage` resolves per locale: default → `/opengraph-image`
  (`/brand/og.png`), other locales → `/brand/og-<locale>.png`; added `og-fr.png`. The
  per-page `seo.openGraph.imageUrl` escape hatch still exists but no page uses it. Docs
  updated (seo-metadata, brand-setup, icons, new-client, README) + `og.png`/`og-home.png`
  had already been resized to a true 1200×630 this cycle.

- `module.custom-html` now forces any embedded `<iframe>` to its parent's full width
  (`[&_iframe]:w-full` on the render section). Editors paste embed codes with hard-coded
  `width`/`height` attributes; CSS now overrides the width so an embed (YouTube, Google
  Form, map…) never ships narrower than the content column. Height stays as authored.

- All **per-request** Sanity reads now go through `sanityFetchLive` (was plain
  `client.fetch` in four spots): the home page's featured posts, the RSS + Atom feed
  routes, and the `/api/i18n/translated-slug` locale-switcher. So live revalidation
  (via `<SanityLive>`) + draft preview work uniformly across the whole site, not just
  the blog routes — the code now matches what `blog-architecture.md` already prescribed.
  Trade-off: these opt into dynamic rendering (the home page is no longer fully static).
  **Build-time** fetches (`generateStaticParams` ×4 + `app/sitemap.ts`) stay on
  `client.fetch` — live fetch needs request scope (`draftMode()`) and would break static
  generation. Fixed the OG placeholders `og.png` / `og-home.png` to a true **1200×630**
  (they were 1179×630, mismatching the declared `og:image:width`).

- Footer maker-credit link preview now works on **mobile**. `MadeByCredit` swapped its
  Radix `HoverCard` (hover/focus only — never opened on a touch tap) for a **Popover**:
  tapping/clicking "Indiecrafts" opens the indiecrafts.dev link-preview card on both
  desktop and mobile, with Radix collision handling + `max-w-[calc(100vw-2rem)]` so it
  never overflows a phone screen; the card itself is the link to visit. Added
  `footer.previewLabel` (en + fr) for the trigger's aria-label. _Why:_ the preview was
  unreachable on touch devices.
- `defineModule` now accepts an optional `description` (shown in the Studio module
  picker) — required by the ported `module.gallery` schema; fixes a `tsc` error.

- Gated `reactCompiler` to production (`process.env.NODE_ENV === "production"`) in
  `next.config.ts`. The React Compiler's memoization pass ran on every edit in dev;
  prod-only keeps HMR fast while still shipping the optimization in the build. _Why:_
  biggest remaining dev-HMR cost after adopting Turbopack. (Applied across the Sanity
  repos — template, sensoria, indiecrafts.dev, yakarchitecture.fr.)

- Sanity `post` documents now open on the **All fields** tab instead of "Contenu".
  Removed `default: true` from the `content` field group — with no group pinned,
  Studio's built-in "All fields" tab is active, so the whole document (content +
  metadata) shows at once; "Contenu"/"Métadonnées" stay as filter tabs. _Why:_
  editors kept missing the metadata tab. (post is the only entity with field groups.)

- Wired prettier **format-on-save** in `.vscode/settings.json`
  (`editor.formatOnSave` + `editor.defaultFormatter: esbenp.prettier-vscode`) and
  added `.vscode/extensions.json` recommending the Prettier extension. Prettier was
  already connected at **commit** time (husky → `lint-staged` → `prettier --write` on
  staged files); this adds the every-save layer so formatting isn't deferred to the
  commit hook. _Why:_ catch formatting on each edit, not only when committing.

- `pnpm dev` now runs **Turbopack** (`next dev --turbopack`) instead of webpack.
  _Why:_ webpack dev spins a heavy compiler over the full module graph (Next 16 +
  embedded Sanity Studio + next-intl + shadcn + reicon + React Compiler), and the
  CPU cost multiplies when several template-based projects run at once. Turbopack is
  Rust/incremental — booted in ~2 s here vs webpack's 5–15 s, with far lower steady
  CPU. Config is Turbopack-compatible (no custom webpack); build stays on webpack.

- Aligned `BrandIcon` with `../sensoria`: it now types its `icon` prop as a
  structural **`BrandMark`** (`{ hex, title, svgContent }`) it exports, instead of
  importing `BrandIconFn` from `reicon-brands`. A `reicon-brands` icon still satisfies
  it, and a hand-declared mark (for a brand the set doesn't carry, e.g. LinkedIn) now
  works too. _Why:_ decouples the component from the library's internal type and
  supports custom marks. `IconShowcase` is unchanged; docs updated (`docs/design/icons.md`,
  CLAUDE.md). Note: `BrandIcon` can't be dropped for "direct" reicon use — `reicon-brands`
  icons are DOM factories that throw on SSR, and `reicon-react` doesn't ship the brand logos.

- **Every blog content document is now translated.** Wired `author`, `person`, and
  `quote` into `@sanity/document-internationalization` (`schemaTypes` now lists all
  six: post, category, tag, quote, author, person). Each gained a plugin-managed
  `language` field (`readOnly` + `hidden`); `quote` migrated off its old manual
  language radio for consistency. Added per-locale create templates + desk
  language-split for author/person. Added same-language reference filters on
  `post → author` and `person-list → person` (categories/tags/quote-list already had
  them), so an EN post can only link EN entities. Locale-filtered `authorBySlugQuery`
  - `authorsForLocaleQuery`, and made the author route emit per-locale static params
    (`allAuthorSlugsQuery` now returns `language`). _Why:_ author/person bio + role were
    shared across locales (EN text on FR pages), and quote used an inconsistent manual
    field — everything now follows one plugin-managed i18n model. Seed rewritten to
    match: authors + people are EN/FR pairs, all refs resolve same-language, and a new
    `buildTranslationMeta` emits `translation.metadata` docs linking every EN↔FR set
    (post/category/tag/quote/author/person) so the Studio and the front-end locale
    switcher (`/api/i18n/translated-slug`) can resolve counterparts. Docs updated
    (blog-architecture, sanity-setup) + `audit-dataset.mjs` now flags missing
    `language` on author/person too.

- Hardened the `@sanity/document-internationalization` setup to match the plugin's
  documented best practice. The `language` field on `post` / `category` / `tag` is
  now `readOnly` + `hidden` — the plugin writes it, so editors can no longer flip a
  document's language and desync it from its `translation.metadata` link. The Studio
  language set (`supportedLanguages`, per-locale create templates, and the desk's
  EN/FR split) now derives from `@/config`'s `locales` instead of hardcoded `en`/`fr`,
  so adding a locale to config extends Studio automatically — one source, no drift.
  The post/category/tag **slug** is excluded from translation copies
  (`options.documentInternationalization.exclude`), so a new-language version starts
  with an empty slug rather than duplicating the source URL. Plugin
  `translation.metadata` docs are hidden from Studio global search
  (`metadataOmnisearchVisibility: false`). _Why:_ prevents the most common
  document-i18n data-integrity bugs (language desync, duplicate slugs across locales)
  and keeps the locale list single-source across next-intl routing and Sanity.

- Moved the `tsc` typecheck from the pre-push hook to **pre-commit** and removed
  the pre-push hook entirely (matches `../sensoria`). The commit gate is now
  `pnpm lint-staged && pnpm tsc` — staged-file lint/format plus a full typecheck —
  and nothing runs on push. _Why:_ the pre-push `lint && tsc` re-ran checks the
  commit had already covered; one gate at commit + CI is enough. `verify:quick` is
  now a manual pre-PR check, not a hook. Docs updated: CLAUDE.md, README.md,
  `docs/setup/{scripts,environment,new-client}.md`.

### Removed

- Removed the `module.breadcrumbs` blog page-builder module (editor-authored manual
  breadcrumb trail). Dropped its renderer + schema, the `AnyModule`/registry/
  `MODULE_TYPES` entries, and updated module counts (13 modules, 4 layout-slot) across
  README, blog `CLAUDE.md`, and the blog docs. _Why:_ every blog route already builds a
  correct auto breadcrumb from route context (verified: parent crumbs link back to
  `/blog`, and the post's category crumb is `showCategories`-gated) — a hand-typed
  module duplicated that and could link at flag-disabled routes. The shared auto
  `Breadcrumbs` component (`shared/components/Breadcrumbs.tsx`) is unchanged.

- Removed the `module.search` blog page-builder module (client-side post search
  widget). Dropped its renderer + schema files, the `AnyModule`/registry/`MODULE_TYPES`
  entries, the now-orphaned `data-search-title` attribute on `BlogCard` (search was
  its only consumer), the `searchPlaceholder`/`searchLabel` message keys (en + fr),
  and updated every module-count reference (14 → 13 modules, 6 → 5 layout-slot) across
  README, blog `CLAUDE.md`, and the blog docs. _Why:_ the widget was a filter-visible-
  cards toy, not real search — not worth carrying as a first-class module.

- Removed the dead `STATIC_PATHNAME_KEYS` value re-export from `src/config/index.ts`
  — a config-audit found zero importers of the value. The const stays in
  `config/types.ts` (it derives the `StaticAppPathname` type, which is used); only
  the unused barrel re-export was dropped.

- _(design)_ Deleted the unused `theme.colors`, `theme.radii`, and `theme.fonts`
  mirrors from `src/config/index.ts` — an audit found zero consumers (`globals.css`
  is the real runtime source; `check-contrast.mjs` parses it directly, and the OG
  image is a static PNG so no Satori path reads oklch). `theme.hexColors` now keeps
  only `background`, the one hex the PWA manifest needs. _Why:_ a hand-maintained
  color mirror nobody read was pure drift risk with no enforcement. Rewrote the
  "keep in sync" contract in DESIGN.md, `docs/setup/brand-setup.md`,
  `design-token-usage.md`, and logged it in `docs/design-decisions.md`. Also removed
  the dead `TAILARK_API_KEY` from `.env.example` (wired to nothing — components.json
  has no registries block).

### Added

- **`pnpm shadscan`** script ([shadscan](https://github.com/TheOrcDev/shadscan),
  `pnpm dlx @shadscan/cli`) — a deterministic shadcn/ui fundamentals audit scoring UX
  0–100 across 6 categories (62 rules). Manual audit like `pnpm doctor`, not in the
  `verify` gate; no dependency added (runs via `dlx`). Documented in CLAUDE.md,
  command.md, and `docs/setup/scripts.md`.

- **Editor-controlled OG image per language** — new `siteMeta` Sanity singleton (one
  per locale, `siteMeta.en` / `siteMeta.fr`, in the Studio under **Métadonnées du site**)
  with an `ogImage` field. `resolveOgImage` (`@/lib/metadata`) now resolves the `<meta
og:image>` as: per-page override → editor's `siteMeta.<locale>.ogImage` → static
  `/brand/og[-<locale>].png`; a Sanity outage falls through to static, so metadata never
  breaks. `pageOgImage` stays sync (override or static) for JSON-LD. Seed: new
  `scripts/seed-media/` folder holds the OG cards (og.png / og-fr.png), uploaded via
  `uploadLocalMedia` and referenced by the seeded `siteMeta` docs. Docs updated
  (seo-metadata, brand-setup). Also fixed a latent `pageOgImage(page)` call in
  `jsonld.tsx` that was missing the `locale` arg.

- **Separate post `excerpt` field** — the SEO `metadata.description` was doubling as
  the visible teaser on cards + the post page. Added a dedicated `excerpt` (Contenu tab);
  cards/post now show `excerpt ?? metadata.description` (fallback keeps existing content
  working), and `metadata.description` is SEO-only again. Touched schema (`post.ts`),
  `PostListItem`, `POST_LIST_FRAGMENT` + `postBySlugQuery`, `BlogCard`, the post page,
  the `metadata.ts` help text, the seed (helper + showcase posts), and the editor guide.

- **Morphicons homepage demo** — added [`morphicons`](https://www.morphicons.com) +
  `lucide` (raw icon data), and a `MorphiconsShowcase` homepage section: a grid of
  tiles that morph between two icons on tap/click. SSR-safe and honors
  `prefers-reduced-motion` (instant swap), neutral tokens per DESIGN. Mounted after
  `IconShowcase` in `(home)/page.tsx`; copy in `messages/{en,fr}.json`
  (`pages.home.blocks.morphicons.*`); `lucide` added to `optimizePackageImports`.

- **`docs/features/blog/gallery.md`** — the missing doc for the `module.gallery`
  feature added earlier (editor guide + developer wiring), adapted from `../sensoria`
  to the template's neutral tokens. Synced into the VitePress sidebar + README index.
  _Why:_ the gallery feature shipped without its doc, against the template's own
  "docs are part of the change" rule.

- **`.claude/workflows/`** — step-by-step checklists for the repeatable, error-prone,
  multi-file procedures that were previously prose (or understated): `add-blog-module`
  - `remove-blog-module` (the ~8 code locations + 4 doc count-refs, e.g. the search/
    gallery/breadcrumbs module changes), `add-page`, `adapt-library-section`. Wired from
    `CLAUDE.md` and `src/features/blog/CLAUDE.md` (whose "schema + component + switch case"
    line understated the real surface). _Why:_ codifies the checklist so a missed location
    (Studio picker, TS exhaustiveness, stale doc counts) stops happening.

- **Atom 1.0 feed** at `/blog/atom.xml` — sibling of the RSS feed. Same
  `rssPostsQuery` data, same `isRssEnabled()` gate (blog + rss flags), same
  per-locale `[locale]` routing (one feed per language in `i18n.locales`); Atom
  serialization (ISO-8601 dates, `<feed>`/`<entry>`, stable `<id>`s). Wired the
  `<link rel="alternate" type="application/atom+xml">` discovery tag on the blog
  frontpage + every post, next to the RSS one. Docs updated (blog-architecture routes
  table, feature-flags, README).

- **Image gallery** blog module (`module.gallery`, ported from `../sensoria`) —
  swipeable embla carousel with a thumbnail strip, an editorial counter, and a
  click-to-zoom fullscreen lightbox; inline-embeddable in a post body. Adapted to
  template conventions: neutral tokens (no `decor-warm`), `rounded-xl`/`shadow-lg`,
  lucide icons. Added `embla-carousel-react` (also fixes the template's
  already-present-but-broken `ui/carousel.tsx`). GROQ projection resolves each image
  to CDN url + `lqip`. Message keys `pages.blog.gallery.*` (en + fr).

- _(design)_ DESIGN.md closed the gaps from the "10 lines" design.md pattern: new
  **Rejected Patterns** section (encodes what we tried and killed, with reasons, so
  an agent stops and asks instead of shipping a carousel or long modal) and
  **Required States** contract (Loading/Empty/Error each map to a real primitive —
  `Skeleton`/`Empty`/`Spinner` — "never a blank screen"). Folded in a destructive-
  confirm rule (verb-repeat + `AlertDialog`, non-destructive never confirms), a
  "match nearest existing screen" fallback, a spacing usage map, and table→stacked-
  cards below `md`. Skipped the rest — the file already exceeded the template.

- _(design)_ DESIGN.md hardened against the "7 DESIGN.md mistakes": CLAUDE.md now
  imports it via `@DESIGN.md` + a pre-UI checklist (mistake #7 — actually loaded);
  new **Interaction & States**, **Accessibility**, **Motion**, **Iconography**,
  **Product Content**, and **Maintenance & Validation** sections (#5); deduped the
  restated Responsive bullet and folded the shadcn-conventions block into a pointer
  to `.claude/rules/component-architecture.md` (#6). Skipped component-anatomy
  expansion and semantic color renames.

- _(design)_ Typography levels `subheading`, `title`, `lead`, `caption` — filled
  the 5→9 gap so an agent building an `h3`/lead/caption has a token instead of a
  guess. Each maps to a Tailwind size already in use (`text-sm` was the most-used
  size with no token).
- _(design)_ `elevation` tokens (`flat/card/raised/overlay`) — the Elevation
  section was prose-only; the depth steps are now machine-readable.
- _(design)_ Component tokens `button-secondary` and `focus-ring`; `card` now
  cross-links `{elevation.card}`.
- _(design)_ "How to read this system" precedence header — states that tokens win
  over hardcoded values and where the runtime source of truth lives.
- This shared `CHANGELOG.md`.
- Opt-in **CodeGraph** support for AI coding agents — `.codegraph/` gitignored,
  guarded `codegraph:init` / `codegraph:status` scripts, and `docs/setup/codegraph.md`.
  Kept out of the committed `.mcp.json` so it never spawns for client sites that
  didn't opt in; MCP registration is per-developer (global).

- Scaffolded the template toward the Babich "design project" structure (Phases 1–4):
  `MEMORY.md`, `CLAUDE.local.md` (gitignored), `.claude/settings.json`,
  `reference/` (screenshots/competitors/moodboards/flows/research), `docs/design-decisions.md`,
  `.claude/rules/` (naming, accessibility, component-architecture, design-token-usage,
  figma-handoff — CLAUDE.md now points to them), 3 project agents (design-system-reviewer,
  accessibility-reviewer, ux-reviewer), and 3 project skills (design-system-check,
  accessibility-pass, visual-polish). `.gitignore` refined to commit the `.claude`
  team toolkit while ignoring personal/machine state. Skipped `design-tokens.json`
  (would fork the OKLCH source of truth).

### Changed

- `CLAUDE.md` front-loaded: a stack line + top-5 non-negotiables now open the file
  so the highest-attention lines carry the load-bearing rules; Working principles
  and the docs section tightened.
- _(design)_ Colors prose now pairs each role with its resolved value
  (`brand — oklch(0.55 0.18 260) · #4f69d9`) so agents don't cross-reference.
- Added rules (CLAUDE.md + DESIGN.md) to maximise the `frontend-design` skill and
  require all UI to be responsive/optimised for every supported screen size
  (verify 375 / 768 / 1280).
