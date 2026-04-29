# Handoff — indiecrafts-template

Snapshot of architecture + state, written for the next session. Pairs with
`CLAUDE.md` (detailed conventions) and `src/client/README.md` (per-client edits).

## What this is

A config-first, modular Next.js 16 template for client websites. Fork it, edit
config, ship. One template, many client sites.

## Current stack

- Next.js 16 (App Router, Turbopack, React 19, React Compiler on, proxy middleware)
- TypeScript strict
- Tailwind v4 (`@theme inline` in `globals.css`, `@custom-variant dark` for data-theme)
- next-intl v4 (locale-scoped routes, localized URL segments, hreflang)
- next-themes (system / light / dark with `data-theme` attribute)
- Zod (validates site + theme configs at module load)
- Vitest (happy-dom, 80% coverage target)
- Husky + lint-staged (pre-commit + pre-push guards)
- Storybook 10 (`@storybook/nextjs-vite`) — preview wraps every story with
  `ThemeProvider` + `NextIntlClientProvider` + `globals.css`

## Component libraries installed

- **shadcn/ui (new-york, zinc)** — 56 primitives in `src/components/ui/`
- **Magic UI** — 58 animated components in `src/components/ui/`
- **Aceternity UI** — 100 components in `src/components/ui/`
- **Tailark blocks** — 34 section blocks organized into category folders under `src/components/`
- **shadcn official blocks** — 42 flat `src/components/*.tsx` files (dashboards, sidebars, charts, auth)

All primitives are upstream/read-only; updated via `pnpm dlx shadcn@latest add`.
Excluded from ESLint + Prettier + tsc so re-downloads stay conflict-free.

## Page routing

```
src/app/[locale]/
├── page.tsx + page.config.ts + messages/{en,fr}.json    # home
├── about/page.tsx + page.config.ts + messages/{en,fr}.json
└── _dev/
    └── routes/page.tsx          # dev-only route directory (Storybook covers per-block previews)
```

Barrel aggregator in `src/config/pages/index.ts` pulls every `page.config.ts`
into the `PATHNAMES` table that feeds next-intl's pathnames router.

`pnpm new:page <id>` scaffolds a page folder + config + messages + route file
in one command. `pnpm verify:pages` cross-checks the registry matches `routes.types.ts`.

## `src/components/` taxonomy

Every component lives in its own folder. Two tiers: **section blocks** (the
typed Tailark catalog) and **scaffolding** (shadcn-sourced primitives).

### Section blocks — 34 typed Tailark blocks

```
src/components/
├── cta/cta-1/
├── contact/contact-1/
├── content/content-1..7/
├── faq/faq-1..4/
├── features/features-1..12/
├── footer/footer-1/
├── pricing/pricing-1/
├── pricing/pricing-comparator/
├── stats/stats-1..4/
├── team/team-1/
└── testimonials/testimonials-1/
```

### Scaffolding — shadcn-sourced, adapt on adoption

```
src/components/
├── auth/                          # LoginForm, SignupForm, ForgotPassword, Login, SignUp
├── charts/                        # ChartArea*, ChartBar* (15 blocks)
├── dashboard/                     # AppSidebar, DashboardHeader, SectionCards, Sidebar*, SettingsDialog, TeamSwitcher, VersionSwitcher
├── data/DataTable/                # reusable TanStack data table
├── forms/                         # DatePicker, SearchForm, Calendars
├── nav/                           # NavMain, NavUser, NavSecondary, NavDocuments, NavProjects, NavFavorites, NavWorkspaces, NavActions
├── layout/                        # SiteHeader, SiteFooter, SkipLink, LocaleSwitcher, DevRoutesMenu (the marketing site chrome)
├── logo/                          # Logo + LogoIcon
├── theme/                         # ThemeProvider, ThemeToggle
├── ui/                            # shadcn/ui primitives (read-only)
├── PageRenderer/ + custom/ + common.ts + messages.ts + registry.ts
└── <section categories above>
```

**Every scaffolding folder now uses the labels-prop pattern.** Each
component has `<Name>.tsx` + `defaults.ts` + `index.ts`:

- `defaults.ts` exports `<name>Defaults` (English copy) + its `Labels` type
- Component accepts an optional `labels?: Partial<Labels>` prop — merged
  with defaults at render time via `const l = { ...defaults, ...labels }`
- Barrel re-exports component, prop type, defaults, labels type, plus any
  item types consumers need (e.g. `NavMainItem`, `SectionCardItem`)

Swap the English copy at a call site by spreading next-intl output:

```tsx
const t = useTranslations("admin.sidebar");
<AppSidebar data={{ ...appSidebarDefaults, brandLabel: t("brand") }} />;
```

Lint and tsc run across all scaffolding folders — no ignore list beyond
`ui/` and `hooks/`. The upstream `href="#"`/demo-data issues are gone.

### Every block in the catalog is now converted

**All 34 blocks use the full typed/i18n 5-file pattern.** Every block has
`schema.ts` + `config.ts` + `en.json` + component + barrel. There are no
raw upstream Tailark blocks remaining.

Each block follows this shape:

```
<block>/
├── <Block>.tsx       # props-driven, MessageKey strings, theme tokens, aria-labelledby
├── schema.ts         # Block type with typed content fields
├── config.ts         # sample instance (images, URLs, MessageKey pointers)
├── en.json           # English sample translations at folder root
└── index.ts          # barrel — exports Section, Block type, sample
```

Use a converted block: `{ ...cta1Sample, id: "home-cta" }` in a page config.
Override one field: `{ ...cta1Sample, id: "home-cta", titleKey: "pages.home.cta.title" }`.

**Per-block heading rule:**

- `<h2>` for the block's section title (one per block; sr-only when the
  design has no visible title — e.g. bento blocks where the cards ARE the
  content). This owns the `aria-labelledby` target.
- `<h3>` for repeating sub-items inside the block (feature cards, pricing
  tiers, FAQ question rows, team member names).
- `<h1>` is reserved for the page title, rendered once per page above the
  sections.

**Heavy-decoration blocks (features-8/9/10/11):** the SVG illustrations,
charts, brand-tile grids, and avatar stacks stay baked in the `.tsx`. Only
the visible text (card headings, eyebrow labels, body copy) is
config-driven via MessageKey props. The decorations are marked
`aria-hidden="true"` so they don't pollute the accessibility tree.

## Storybook

Every component has a `<Name>.stories.tsx` next to its `<Name>.tsx` (~80
stories total). Two story patterns:

- **Section blocks** (typed Tailark): import `<Name>Sample` from `./config`,
  spread it as args. Title `Sections/<block-name>`, layout `fullscreen`.
- **Scaffolding primitives** (auth, charts, dashboard, data, forms, nav,
  layout, theme): default story renders with no props (uses the component's
  baked-in `defaults.ts`). Sidebar/dropdown components decorate with
  `<SidebarProvider>` so they have parent context.

`/.storybook/preview.tsx` wires the same provider stack the app uses
(`ThemeProvider` + `NextIntlClientProvider`) and merges the three-tier
messages tree (globals + per-page + per-block samples).

Dev: `pnpm storybook` (port 6006). Build: `pnpm build-storybook` →
`storybook-static/`.

## Three-tier i18n merge

`src/i18n/request.ts` builds the message tree at each request:

```ts
{
  ...globalMessages,       // messages/<locale>.json — client chrome + any blocks.* overrides
  pages: pageMessages,     // per-page — src/app/[locale]/<segment>/messages/
  blocks: mergedBlocks,    // deep-merged(blockSamples, clientRootBlocks)
}
```

### Override flow for block samples

Each converted block ships an `en.json` at its folder root. These merge
under `blocks.<type>.*` as the **floor**. The client's own
`messages/<locale>.json` can carry a `blocks` key that **wins per-key** via
deep merge. Example:

```json
// src/messages/fr.json (client's main locale file)
{
  "nav": { … },
  "blocks": {
    "cta-1": {
      "title": "Commencer",
      "submit": "C'est parti"
    }
  }
}
```

Any `blocks.cta-1.*` key the client provides overrides the English sample;
un-overridden keys fall back to English. This is how a French site
translates a Tailark block WITHOUT touching the template.

The merge is recursive (nested objects deep-merge, scalars and arrays
replace). Pattern lives in `src/i18n/request.ts` — see `deepMerge`.

## What belongs in each file per block

| File          | Owns                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `<Block>.tsx` | Component body. Reads props via the Block type. Uses `useTranslations()` + `t(props.xxxKey)`.                                      |
| `schema.ts`   | The Block type — discriminator + MessageKey-typed content fields + asset paths.                                                    |
| `config.ts`   | Sample instance: MessageKey pointers to `blocks.<type>.*`, image paths, URLs, icons, numbers, flags. **ALL non-translation data.** |
| `en.json`     | English sample translations for the keys `config.ts` references.                                                                   |
| `index.ts`    | Barrel: `export { Section, Block type, sample }`.                                                                                  |

Adding a NEW section (bespoke or converted Tailark): 5-file pattern as above.
If the block is only one page and won't reuse: use the `CustomBlock` escape
hatch (`type: "custom"`, `componentKey: "..."`) with a component in
`src/client/components/<Name>/`.

## What's NOT done / known gaps

1. **Tailark `hero-section-*` blocks** didn't install — they depend on
   `@motion-primitives/*` which is behind Vercel bot protection and rejects
   the shadcn CLI user-agent. Workaround: use a `CustomBlock` for the hero.
2. **`/dashboard`, `/login`, `/signup`** routes exist from shadcn block
   downloads. They live outside `[locale]` so don't participate in i18n.
   `/dashboard` now uses the new `DashboardLayout` from
   `src/layouts/DashboardLayout/` — swap nav labels + data arrays in the
   AppSidebar when a client adopts it. Move routes into `[locale]/` (or
   delete) per project needs.
3. **4 stubbed logo SVGs** — `linear`, `slack`, `spotify`, `twilio` in
   `src/components/ui/svgs/` are placeholder circles. Swap for real logos
   if you use the blocks that reference them (features-11, content-1, stats-4).
4. **Client registries** (`src/client/sections/registry.ts` and
   `src/client/components/registry.ts`) are empty stubs — no bespoke
   sections or custom blocks ship with the template.

## Core commands

```bash
pnpm dev              # dev server (Turbopack)
pnpm build            # production build
pnpm start            # run the production build
pnpm lint             # ESLint — zero-warning target, includes jsx-a11y
pnpm format           # Prettier write
pnpm tsc              # type-check (strict, no emit)
pnpm test             # Vitest
pnpm analyze          # ANALYZE=1 next build (bundle reports)
pnpm new:page <id>    # scaffold a new page
pnpm verify           # tsc + lint + format:check + contrast + pages
```

## Config surface — per-page

```ts
definePage({
  key: "/about",                                // must match AppPathname
  id: "about",                                  // messages bucket id
  slugs: { en: "/about", fr: "/a-propos" },    // localized URL segments
  enabled: true,                                // per-page on/off
  moduleKey: "blog",                            // gated by features.modules.*
  moduleKeys: ["blog", "comments"],             // multi-module gate
  layout: "default",                            // or function of locale
  aside: { componentKey: "...", props: {…} },  // fills <SidebarLayout>'s aside slot
  seo: {
    titleKey: "pages.about.title",
    descriptionKey: "pages.about.description",
    keywords: [...],
    canonical: StaticAppPathname | `http${string}`,
    noindex: false,
    robots: {...},
    openGraph: { type: "article", imageUrl: "/og/about.png" },
    structuredData: [JsonLdObject, ...],        // typed @type union
  },
  sections: [
    { ...cta1Sample, id: "about-cta" },         // converted block w/ sample
    { type: "features-3", id: "about-f" },      // raw block (content in .tsx)
    { type: "custom", id: "x", componentKey: "..." }, // escape hatch
  ],
});
```

## Testing

- `tests/unit/typography.test.ts` — 10 tests on locale formatting helpers
- `tests/unit/zod-error-map.test.ts` — 3 tests on Zod→translation mapping
- No component tests yet. Add under `tests/unit/<name>.test.tsx` using
  `@testing-library/react` (already installed).

## Build health as of handoff

```
pnpm tsc       ✓
pnpm lint      ✓ (only flat `src/components/*.tsx` shadcn blocks excluded)
pnpm format    ✓
pnpm build     ✓ — 16 routes prerendered
pnpm verify    ✓ — contrast + pages registry pass
pnpm test      ✓ — 13 tests
```

## Priorities for next session (if any)

1. If promoting another Tailark block: pick one (e.g. `features-2` or
   `content-1`), do the 5-file rewrite, register its `en.json` in
   `src/components/messages.ts` and `src/types/messages.ts`.
2. If the client needs French translations for converted blocks:
   add a `blocks.<type>.*` section to `messages/fr.json` — deep-merge
   handles partial overrides, no template changes required.
3. If adding real images: drop them in `public/` and reference via
   `config.ts#<anyAssetField>`. Update `next.config.ts#images.remotePatterns`
   if they're remote.

## Critical rules (cross-cutting, don't violate)

- `src/components/ui/*` — shadcn primitives, never hand-edit.
- `src/components/*.tsx` — flat block downloads (shadcn blocks), not modified.
- `src/components/<category>/<block>/<Block>.tsx` — every block is ours
  (converted from raw Tailark + rewritten to the 5-file pattern).
- Root `messages/<locale>.json` — client site only. Never put block defaults there.
- Per-page `messages/` — client site only. Never put block defaults there.
- Block defaults live ONLY in `<block>/en.json` (English only).
- `PATHNAMES` cycle: `page.config.ts` must import block samples from
  `.../<block>/config.ts` directly, NOT through the barrel. Going through
  the barrel pulls in the component which imports `@/i18n/routing` which
  depends on PATHNAMES — circular init crash at build time.
- MCP servers in `.mcp.json`: `shadcn` and `magicui`. Restart Claude Code to load.
