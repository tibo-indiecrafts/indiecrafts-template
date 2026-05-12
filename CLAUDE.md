# Indiecrafts Template — CLAUDE.md

## Working principles

1. Don't assume. Don't hide confusion. Surface tradeoffs.
2. Minimum code that solves the problem. Nothing speculative.
3. Touch only what you must. Clean up only your own mess.
4. Define success criteria. Loop until verified.
5. Simplify code wherever you can.

## Design guidelines

- **Accessibility contrast.** Ensure WCAG AA contrast on every theme-token pair. Run `pnpm verify:contrast` after any theme/color change — CI will fail otherwise. See the deeper Accessibility section below for `<html lang>`, SkipLink, semantic-HTML, and reduced-motion rules.

> Config-first, modular Next.js template for client websites. Edit `src/config/*` + drop blocks into `src/components/sections-<type>/`, ship.

Read this top to bottom before touching code.

## The layer spine

Every page renders top-down through this chain. Each layer takes typed inputs and ships defaults (`config.ts` + `en.json` where applicable).

```
ui/                       primitives (shadcn, READ-ONLY)
  ↳ ui-effects/           aesthetic primitives — flat upstream files (Aceternity, READ-ONLY)
                          + branded wrapper FOLDERS (editable, e.g. CommandPalette/)
       ↳ sections-<type>/<variant>/   content blocks: schema + config + en.json + .stories
            ↳ pages-<name>/<variant>/   compositions: config (incl. SEO) + en.json + .stories
                 ↳ wrapped by layouts/<Name>Layout/   chrome (header / main / footer slots)
                      ↳ rendered by src/app/[locale]/<seg>/page.tsx   ROUTE FILE
```

**The mental model**:

- `src/components/` is THE library — edit it directly when customizing for a project, delete what you don't use.
- `src/app/[locale]/` is the boundary — Next.js routes import templates straight from `@/components/pages-<name>/<variant>`.
- No fork, no overlay, no indirection — one tree, edit in place.

**Two ways to customize**:

1. **Translations only** — edit root `messages/<locale>.json` to override `blocks.<key>.*`. No code changes.
2. **Edit in place** — open the section/template/layout under `src/components/`, change what you need. Delete components/templates you'll never use.

## Quick Reference

```bash
pnpm dev                # Dev server (port 3000, Turbopack). Runs gen:styles first.
pnpm build              # Production build. Runs gen:styles first.
pnpm tsc                # Type check (strict, no emit)
pnpm lint               # ESLint (~25 jsx-a11y rules enumerated)
pnpm format             # Prettier write
pnpm test               # Vitest (happy-dom, 80% coverage target)
pnpm gen:styles         # Regenerate src/app/_component-styles.css
pnpm new:page <id>      # Scaffold a page folder + route + messages
pnpm verify:contrast    # WCAG AA check on theme tokens
pnpm verify:pages       # Cross-validate the pages registry
pnpm verify:styles      # Drift-guard on the CSS aggregator
pnpm verify:quick       # tsc + lint
pnpm verify             # tsc + lint + format:check + contrast + pages + styles
pnpm storybook          # Storybook dev server
pnpm build-storybook    # Static Storybook build (runs gen:styles first)
```

## Tech Stack

- **Next.js 16** App Router, Turbopack, React 19, React Compiler enabled, `proxy.ts` (was middleware)
- **TypeScript strict** — no escape hatches without a written reason
- **Tailwind CSS v4** — CSS-first via `@theme inline` in `globals.css`; `@custom-variant dark` for `data-theme` toggling
- **next-intl v4** — locale-scoped routes, localized URL segments, hreflang
- **next-themes** — system / light / dark, FOUC-free
- **Zod** validates `siteConfig` + `themeConfig` at boot
- **Storybook 10** for visual review (titles mirror folder structure — see Storybook section)
- **shadcn/ui (new-york, zinc)** + Aceternity + Magic UI catalogs

## Project Structure

```
src/
├── app/                      # Next App Router (locale-scoped)
│   ├── layout.tsx            # passthrough root
│   ├── [locale]/layout.tsx   # html, fonts, providers, JSON-LD
│   ├── globals.css           # tokens + @import "_component-styles.css"
│   └── _component-styles.css # AUTO-GENERATED — do not edit
├── config/                   # SINGLE SOURCE OF TRUTH (edit here first)
│   ├── site.config.ts · locales.config.ts · theme.config.ts
│   ├── seo.config.ts · features.config.ts · llms.config.ts
│   ├── routes.types.ts · routes.config.ts · navigation.config.ts
│   └── pages/                # one folder per page
│       └── <id>/{page.config.ts, messages/{en,fr}.json}
├── components/
│   ├── ui/                          # staging dir — `shadcn add` drops here for review
│   ├── ui-primitives/               # vetted shadcn primitives (read-only, CLI-managed)
│   ├── ui-effects/                  # Aceternity / Magic UI flat files (read-only)
│   │   └── <Name>/                  #   branded wrapper folders (yours to edit)
│   ├── ui-illustrations/            # decorative React-component illustrations
│   │                                #   (mobile-wallet, product-illustration, line-chart …)
│   ├── ui-molecules/                # shared molecule-level building blocks (grouped by domain)
│   │   ├── ai/<molecule>/           #   AI-domain composites (conversation, message, prompt-input)
│   │   ├── auth-form/<molecule>/    #   auth form composites (login, signup) — used by pages-{login,signup}
│   │   ├── chart/{area,bar}/<variant>/ #   chart variants — single chart per file, no section semantics
│   │   ├── dashboard/<molecule>/    #   dashboard chrome composites (header, calendars, nav-*, …)
│   │   └── sidebar/<molecule>/      #   sidebar chrome composites (nav-collapse, nav-footer, …);
│   │                                #     multi-variant: <molecule>/<variant>/ (nav-main, team-switcher)
│   ├── layouts/                     # page templates + their owned chrome
│   │   ├── _shared/                 # cross-layout chrome: SkipLink, LocaleSwitcher,
│   │   │                            #   Logo, ThemeProvider, ThemeToggle
│   │   │   └── site-headers/        #   header variants catalog (header-1 … header-9);
│   │   │                            #     swappable via DefaultLayout's `header` slot
│   │   ├── DefaultLayout/           # DefaultLayout.tsx + SiteFooter/ (header pulled
│   │   │                            #   from _shared/site-headers/header-9 by default)
│   │   ├── DashboardLayout/         # DashboardLayout.tsx + DashboardHeader/
│   │   │   └── sidebars/            #   9 sidebar variants (sidebar-01 … sidebar-09);
│   │   │                            #   nav lists + widgets extracted to ui-molecules/
│   │   ├── FullBleedLayout/, ProseLayout/, SidebarLayout/
│   │   └── registry.ts
│   ├── sections-{cta,contact,content,faq,features,pricing,stats,team,testimonials}/
│   ├── sections-{dashboard,data,modals,lists,timelines,onboarding}/
│   ├── sections-{ai,file-upload,form}/   # command-menu promoted → ui-molecules/command-menu/{01,02,03}/
│   ├── sections-auth/               # forgot-password + login-01..09 (page-filler section variants)
│   │                                #   login/signup forms moved to ui-molecules/auth-form/{login,signup}/
│   └── pages-{landing,about,dashboard,login,signup,forgot-password,error,not-found}/   # full-page templates
├── i18n/
│   ├── routing.ts · request.ts
│   └── block-messages.ts     # aggregates en.json from every component bucket
├── lib/                      # metadata, logger, typography, seo/jsonld, zod-error-map
├── types/messages.ts         # MessageKey union (auto-derived from message tree)
└── proxy.ts                  # Next 16 locale routing
```

### Component-folder convention

| Bucket                                         | Atomic level | Edit? | Storybook group                              |
| ---------------------------------------------- | ------------ | ----- | -------------------------------------------- |
| `ui-primitives/`                               | atoms        | NO    | UI Primitives                                |
| `ui/`                                          | atoms        | NO    | UI Primitives (staging)                      |
| `ui-effects/<flat>.tsx`                        | atoms        | NO    | UI Effects/{Category}/{Name}                 |
| `ui-effects/<Name>/`                           | molecules    | YES   | UI Effects/{Category}/{Name}                 |
| `ui-illustrations/<flat>.tsx`                  | molecules    | YES   | UI Illustrations/{Name}                      |
| `ui-molecules/<domain>/<molecule>/`            | molecules    | YES   | UI Molecules/{Domain}/{Identifier}           |
| `ui-molecules/<domain>/<molecule>/<variant>/`  | molecules    | YES   | UI Molecules/{Domain}/{Identifier}/{Variant} |
| `layouts/_shared/<X>/`                         | molecules    | YES   | Layouts/Shared/{X}                           |
| `layouts/<Name>Layout/`                        | templates    | YES   | Layouts/{Name}                               |
| `layouts/<Name>Layout/<Chrome>/`               | organisms    | YES   | Layouts/{Name}/{Chrome}                      |
| `layouts/DashboardLayout/sidebars/sidebar-NN/` | organisms    | YES   | Layouts/Dashboard/Sidebars/Sidebar{NN}       |
| `sections-<type>/<variant>/`                   | organisms    | YES   | Sections/{Type}/{Variant}                    |
| `sections-auth/<variant>/`                     | organisms    | YES   | Sections/Auth/{Variant}                      |
| `pages-<name>/<variant>/`                      | templates    | YES   | Pages/{Name}/{Variant}                       |

**Chrome lives where it's used.** Cross-layout chrome (used by every layout — `SkipLink`, `LocaleSwitcher`, `Logo`, `ThemeToggle`, `ThemeProvider`) lives in `layouts/_shared/`. Site headers also live in `_shared/site-headers/<header-NN>/` because they're swappable across `DefaultLayout`, `ProseLayout`, `SidebarLayout`, `FullBleedLayout`. Layout-only chrome (e.g. `DashboardHeader` is dashboard-specific) lives **inside** the owning layout's folder.

**Site-header catalog.** Nine variants live at `layouts/_shared/site-headers/header-{1..9}/`. Variants 1-8 come from `@tailark-pro/header-{1..8}` (the upstream Tailark Pro registry; install via `pnpm dlx shadcn@latest add @tailark-pro/header-N` after setting `TAILARK_API_KEY` in `.env.local`). Header-9 is the project-default (originally `SiteHeader`, renamed to join the numbered family). Each variant follows the 5-file pattern: `Header.tsx` + `config.ts` (`header${N}Key`, `header${N}Namespace`) + `en.json` + `Header.stories.tsx` + `index.ts`. Per the file-name convention, the `.tsx` and `.stories.tsx` files DROP the variant number; the barrel re-aliases the bare `Header` export to `Header${N}` for consumers. Block keys (`header-1`, …, `header-9`) keep the number — they're the public API. **To swap headers app-wide**: change `DefaultLayout`'s default from `<Header9 />` to whichever variant you want. Per-page swap: pass `<DefaultLayout header={<Header3 />}>...</DefaultLayout>`. Variants 1-7 ship with hardcoded English demo content (TODO marker in their config) — extract to en.json before production use.

**`ui-illustrations/` — decorative React-component illustrations.** When a registry block (typically a Tailark Pro hero or feature) ships a complex illustration as a React component (e.g. a mocked product dashboard, a hand-drawn mobile-wallet preview, a stylized line chart), it lands in `src/components/ui-illustrations/` as a flat `.tsx` file. These are NOT primitives (they aren't shadcn-managed) and NOT effects (they aren't decorative animations) — they're presentational illustrations consumed by sections. Rules:

- Flat kebab-case files (`mobile-wallet.tsx`, `product-illustration.tsx`, `interactive-line-chart.tsx`) — same shape as `ui-effects/<flat>.tsx`.
- Each file gets a sibling `<name>.stories.tsx` titled `UI Illustrations/<Name>` so it's reviewable in isolation.
- Imports MUST route through the project's vetted paths: `@/components/layouts/_shared/logo`, `@/components/ui-primitives/svgs/*`, `@/components/ui-illustrations/<sibling>`. The shadcn CLI drops Tailark assets at `src/components/ui/illustrations/<name>.tsx` (staging); the post-install cleanup is to `mv` them to `ui-illustrations/<name>.tsx` and rewrite the imports.
- No translations baked in. Hardcoded text inside an illustration (mock UI labels like "Irung's Wallet" or "$13,452") is fine — they're decorative mock content, not user-facing copy. If the illustration has dynamic text the consumer cares about, hoist it into the consuming section's en.json and pass via props.

**Sidebars are layout chrome.** The 9 sidebar variants live at `layouts/DashboardLayout/sidebars/sidebar-NN/`. `DashboardLayout` consumes one (currently `Sidebar07`) — sidebars are owned by the layout, never iterated from `page.config.sections[]`.

**Shared molecules.** Four domain buckets sit under `ui-molecules/` because they are reused across multiple sidebar variants and section / page-template consumers:

- **`ui-molecules/ai/`** — AI-domain primitives (`Conversation`, `Message`, `PromptInput`) consumed by `sections-ai/`. Many named exports per file (`MessageContent`, `MessageResponse`, `PromptInputSubmit`, …) — these are upstream-style composables; the barrel `export *`'s.
- **`ui-molecules/auth-form/`** — auth form composites (`login`, `signup`) consumed by `pages-login/login-01/` and `pages-signup/signup-01/`. Default-exported from `<Leaf>.tsx`; the barrel re-aliases (`Login as LoginForm`, `Signup as SignupForm`) so consumers keep their existing identifiers. Block keys (`login-form`, `signup-form`) are unchanged from their previous `sections-auth/` location, so existing translations resolve untouched.
- **`ui-molecules/dashboard/`** — dashboard nav lists (`nav-main`, `nav-user`, `nav-workspaces`, …) and widgets (`calendars`, `date-picker`, `team-switcher`) plus the `header` chrome. Each sidebar variant picks the molecules it needs; barrels re-alias to `Dashboard<Identifier>` (e.g. `DashboardNavMain`, `DashboardHeader`).
- **`ui-molecules/sidebar/`** — sidebar-internal composites (`nav-collapse`, `nav-footer`, `nav-header`, `nav-notifications`, `nav-user`, `nav-main/{collapsible,grouped}`, `team-switcher/{grouped,toggle}`) composed by `layouts/dashboard-layout/sidebars/sidebar-NN/`. Barrels re-alias to `Sidebar<Identifier>`.

The domain prefix moves into the parent folder — leaf folders drop the redundant `dashboard-` / `sidebar-` / `ai-` prefix. The barrel re-aliases the short identifier back to the original full name (`Header as DashboardHeader`, `NavCollapse as SidebarNavCollapse`) so consumers don't have to change names.

This rule keeps `sections-*/` strictly for content blocks the page-renderer iterates from `page.config.sections[]`. Anything composed by a layout (and never put in a page config) is chrome, not a section.

### Folder casing convention

- **Component folders** under `src/components/` are **kebab-case** (e.g. `dashboard/header/`, `sidebar/nav-main/`, `cta-01/`).
- **Component files** inside (`<Name>.tsx`, `<Name>.stories.tsx`) are **PascalCase** matching the leaf folder (e.g. `Header.tsx`, `NavMainCollapsible.tsx`). For `ui-molecules/`, the domain prefix lives in the parent folder, not the file name; the barrel re-aliases the short identifier to the full consumer-facing name.
- **Exceptions:**
  - `layouts/_shared/` — intentional underscore prefix (sorts first; signals "private to layouts").
  - `ui-primitives/` — flat **kebab-case files** (e.g. `button.tsx`), shadcn upstream convention.
  - `ui-effects/<flat>.tsx` — flat **kebab-case files** (e.g. `meteors.tsx`), Aceternity / Magic UI upstream convention. Wrapper folders inside (e.g. `ui-effects/command-palette/`) follow the kebab-folder + PascalCase-file rule.

### File-name convention (variant folders)

**File names inside variant folders drop the variant number.** A variant folder `<bucket>-<NN>/` (e.g. `sections-ai/ai-01/`, `pages-landing/landing-01/`) contains a `<Bucket>.tsx` (e.g. `Ai.tsx`, `Landing.tsx`) exporting a `<Bucket>` component. The `index.ts` barrel re-aliases the component as `<Bucket><NN>Section` (or `<Bucket><NN>` for page-templates) so consumers always import the unique-named alias from the barrel, not the file directly. Type names follow the same drop-the-number rule (`<Bucket>Block`, not `<Bucket><NN>Block`); the barrel re-aliases types when needed. The block KEY, NAMESPACE, and SAMPLE / DEFAULTS consts in `config.ts` retain the `<bucket><NN>` prefix (those are the stable public API).

When the new bare component name would shadow an imported shadcn primitive (`Table`, `Dialog`, `Sidebar`, `TableRow`, …), the primitive is aliased on import as `UI<Name>` and JSX usages rewrite to match. The local component keeps the bare PascalCase name.

Example:

```ts
// sections-ai/ai-01/Ai.tsx
export default function Ai(props: Readonly<AiBlock>) { … }

// sections-ai/ai-01/index.ts
export { default as Ai01Section } from "./Ai";
export type { AiBlock as Ai01Block } from "./schema";
export { ai01Key, ai01Namespace, ai01Sample } from "./config";
```

```ts
// pages-landing/landing-01/Landing.tsx
export function Landing({ layout, header, footer }: LandingProps = {}) { … }

// pages-landing/landing-01/index.ts
export { Landing as Landing01, type LandingProps as Landing01Props } from "./Landing";
export { landing01Key, landing01Namespace, landing01Defaults } from "./config";
```

```ts
// sections-modals/dialog-01/Dialog.tsx — primitive collision
import { Dialog as UIDialog, DialogContent, … } from "@/components/ui-primitives/dialog";
export default function Dialog(props: Readonly<DialogBlock>) {
  return <UIDialog>…</UIDialog>;
}
```

Storybook titles stay variant-specific (`"Sections/Ai/Ai01"`) — the `<Bucket><NN>Section` alias keeps consumer-side identifiers stable across variants. Folders that don't follow the `<bucket>-<NN>` shape (e.g. `sections-cta/cta-01/CallToAction.tsx`, `sections-contact/contact-01/Contact.tsx`) keep their existing component file names — the rule only fires when the component file name ends in the same digits as the folder.

### Single- vs multi-variant molecules (and sections)

- **Single-variant** molecules / sections — flat folder. The component file matches the leaf folder name in PascalCase (no domain prefix — that lives in the parent). Example: `ui-molecules/sidebar/nav-collapse/NavCollapse.tsx`. Barrel re-aliases (`export { NavCollapse as SidebarNavCollapse }`) so consumers see the full identifier.
- **Multi-variant** molecules — group variants under a `<molecule>/<variant>/` parent folder. The parent has no `.tsx`; each variant is a leaf folder with its own component, stories, and (if it has its own labels) `config.ts` + `en.json`. Variant files keep a disambiguating suffix to avoid duplicate names across siblings. Example: `ui-molecules/sidebar/nav-main/{collapsible,grouped}/{NavMainCollapsible,NavMainGrouped}.tsx`, `ui-molecules/sidebar/team-switcher/{grouped,toggle}/{TeamSwitcherGrouped,TeamSwitcherToggle}.tsx`.
- **The rule of thumb**: when a second variant appears, promote the existing flat molecule into a parent folder and rename the original to a leaf (e.g. drop the solo suffix). When pruning back to a single variant, do the inverse — flatten and drop the parent.

### Numbered vs descriptive folder names

A variant folder uses one of two shapes — pick deliberately:

- **Numbered** (`<bucket>-<NN>/`, two-digit) — when the folder is one of N variants of the same conceptual block, where ordering implies registry-like cataloging. Example: `sections-modals/dialog-01..12/`, `sections-stats/stats-01..15/`, `pages-landing/landing-01/`.
- **Descriptive kebab** (`<descriptive-name>/`, no digits) — when the folder is a unique singleton or distinct shape that benefits from a self-documenting name. Examples already in tree: `ui-molecules/chart/area/axes/`, `ui-molecules/chart/bar/default/`, `sections-data/data-table/`, `sections-modals/settings-dialog/`, `sections-dashboard/section-cards/`, `sections-pricing/pricing-comparator/`, `sections-auth/{login-form, signup-form}/`.

Mixing is allowed inside the same bucket (`sections-pricing/pricing-01/` + `sections-pricing/pricing-comparator/`). The rule of thumb: if you'd rather see what it does at a glance than where it sits in a sequence, use a descriptive name. If you'd rather have a stable slug to plug into `page.config.sections[].type`, use the numbered form.

**Folder discipline:** every component, section, and layout lives in its own folder with `<Name>.tsx` + `index.ts` barrel + optional `schema.ts`. Page-folders also co-locate `messages/{en,fr}.json`.

## Storybook sidebar — derived from folder paths

Story `title` follows the folder layout deterministically. `_shared` collapses to `Shared`; the `Layout` suffix on named layouts is stripped (`DefaultLayout` → `Default`). For `ui-molecules/`, titles nest under the domain parent — `UI Molecules/{Domain}/{Identifier}` for single-variant, `UI Molecules/{Domain}/{Identifier}/{Variant}` for multi-variant. The leaf in the title is the SHORT (no domain prefix) form because the parent folder already provides the domain context.

| File path                                                                    | Title                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------- |
| `ui-primitives/button.stories.tsx`                                           | `UI Primitives/Button`                      |
| `ui-effects/meteors.stories.tsx`                                             | `UI Effects/Particles & Effects/Meteors`    |
| `ui-effects/command-palette/CommandPalette.stories.tsx`                      | `UI Effects/Inputs/CommandPalette`          |
| `ui-molecules/auth-form/login/Login.stories.tsx`                             | `UI Molecules/AuthForm/Login`               |
| `ui-molecules/auth-form/signup/Signup.stories.tsx`                           | `UI Molecules/AuthForm/Signup`              |
| `ui-molecules/dashboard/header/Header.stories.tsx`                           | `UI Molecules/Dashboard/Header`             |
| `ui-molecules/dashboard/nav-main/NavMain.stories.tsx`                        | `UI Molecules/Dashboard/NavMain`            |
| `ui-molecules/sidebar/nav-collapse/NavCollapse.stories.tsx`                  | `UI Molecules/Sidebar/NavCollapse`          |
| `ui-molecules/sidebar/nav-main/collapsible/NavMainCollapsible.stories.tsx`   | `UI Molecules/Sidebar/NavMain/Collapsible`  |
| `ui-molecules/sidebar/nav-main/grouped/NavMainGrouped.stories.tsx`           | `UI Molecules/Sidebar/NavMain/Grouped`      |
| `ui-molecules/sidebar/team-switcher/grouped/TeamSwitcherGrouped.stories.tsx` | `UI Molecules/Sidebar/TeamSwitcher/Grouped` |
| `layouts/_shared/skip-link/SkipLink.stories.tsx`                             | `Layouts/Shared/SkipLink`                   |
| `layouts/default-layout/DefaultLayout.stories.tsx`                           | `Layouts/Default`                           |
| `layouts/_shared/site-headers/header-9/Header.stories.tsx`                   | `Layouts/Shared/SiteHeaders/Header9`        |
| `layouts/_shared/site-headers/header-8/Header.stories.tsx`                   | `Layouts/Shared/SiteHeaders/Header8`        |
| `layouts/dashboard-layout/sidebars/sidebar-07/Sidebar.stories.tsx`           | `Layouts/Dashboard/Sidebars/Sidebar07`      |
| `sections-cta/cta-01/CallToAction.stories.tsx`                               | `Sections/Cta/Cta01`                        |
| `ui-molecules/chart/area/axes/AreaAxes.stories.tsx`                          | `UI Molecules/Chart/Area/Axes`              |
| `ui-molecules/chart/bar/label-custom/BarLabelCustom.stories.tsx`             | `UI Molecules/Chart/Bar/LabelCustom`        |
| `sections-auth/login/Login.stories.tsx`                                      | `Sections/Auth/Login`                       |
| `pages-landing/landing-01/Landing.stories.tsx`                               | `Pages/Landing/Landing01`                   |
| `pages-about/about-01/About.stories.tsx`                                     | `Pages/About/About01`                       |
| `pages-dashboard/dashboard-01/Dashboard.stories.tsx`                         | `Pages/Dashboard/Dashboard01`               |
| `pages-login/login-01/Login.stories.tsx`                                     | `Pages/Login/Login01`                       |
| `pages-signup/signup-01/Signup.stories.tsx`                                  | `Pages/Signup/Signup01`                     |
| `pages-forgot-password/forgot-password-01/ForgotPassword.stories.tsx`        | `Pages/ForgotPassword/ForgotPassword01`     |
| `pages-error/error-01/Error.stories.tsx`                                     | `Pages/Error/Error01`                       |
| `pages-not-found/not-found-01/NotFound.stories.tsx`                          | `Pages/NotFound/NotFound01`                 |

If you add a story file by hand, set its `title` to match this convention so the sidebar stays clean.

**Top-level sort order** (canonical):

1. `Pages/*`
2. `Sections/*`
3. `Layouts/*`
4. `UI Molecules/*`
5. `UI Effects/*`
6. `UI Primitives/*`

The order goes from largest composition (full pages) down to smallest building blocks. Configured in `.storybook/preview.tsx`.

## ui-molecules — shared molecule-level building blocks

`src/components/ui-molecules/` holds molecule-level components consumed by both **layouts** (especially `layouts/DashboardLayout/sidebars/sidebar-NN/`) and **sections**. They sit between `ui-effects/` (decorative atoms) and `sections-*/` (organisms) in the layer spine — not big enough to be a section, not generic enough to be a primitive.

**Naming.** Domain parent + kebab leaf folder + PascalCase file (no domain prefix on the file — it lives in the parent). Single-variant molecules are flat; multi-variant molecules group variants under a `<molecule>/<variant>/` parent (see "Single- vs multi-variant" rule above). The barrel always re-aliases to the consumer-facing full identifier (`Header as DashboardHeader`, `NavMainCollapsible as SidebarNavMainCollapsible`):

```
ui-molecules/
├── ai/                              # AI-domain composites
│   ├── conversation/
│   │   ├── Conversation.tsx         # many named exports (Conversation, ConversationContent, …)
│   │   └── index.ts                 # export * from "./Conversation"
│   ├── message/        Message.tsx
│   └── prompt-input/   PromptInput.tsx
├── auth-form/                       # auth form composites — used by pages-{login,signup}
│   ├── login/                       # owns its own labels → has en.json
│   │   ├── Login.tsx                # default-export `Login`
│   │   ├── Login.stories.tsx        # title: "UI Molecules/AuthForm/Login"
│   │   ├── config.ts                # loginFormKey = "login-form" (UNCHANGED from prior location)
│   │   ├── en.json
│   │   └── index.ts                 # export { default as LoginForm, type LoginProps as LoginFormProps }
│   └── signup/                      # mirrors login/
│       ├── Signup.tsx               # default-export `Signup`
│       ├── Signup.stories.tsx       # title: "UI Molecules/AuthForm/Signup"
│       ├── config.ts                # signupFormKey = "signup-form" (UNCHANGED)
│       ├── en.json
│       └── index.ts                 # export { default as SignupForm, type SignupProps as SignupFormProps }
├── dashboard/                       # dashboard chrome composites
│   ├── header/                      # owns its own labels → has en.json
│   │   ├── Header.tsx               # exports `Header` + `HeaderProps`
│   │   ├── Header.stories.tsx       # title: "UI Molecules/Dashboard/Header"
│   │   ├── config.ts                # dashboardHeaderKey = "dashboard-header"
│   │   ├── en.json
│   │   └── index.ts                 # export { Header as DashboardHeader, …Props as DashboardHeaderProps }
│   ├── calendars/      Calendars.tsx          # no labels → no config/en.json
│   ├── nav-main/       NavMain.tsx
│   └── …               (date-picker, nav-{documents,favorites,secondary,user,workspaces}, team-switcher)
└── sidebar/                         # sidebar-internal composites
    ├── nav-collapse/                # single-variant, flat
    │   ├── NavCollapse.tsx          # exports `NavCollapse`
    │   ├── NavCollapse.stories.tsx  # title: "UI Molecules/Sidebar/NavCollapse"
    │   ├── config.ts                # sidebarNavCollapseKey = "sidebar-nav-collapse" (UNCHANGED)
    │   ├── en.json
    │   └── index.ts                 # export { NavCollapse as SidebarNavCollapse }
    ├── nav-main/                    # multi-variant parent (no .tsx of its own)
    │   ├── collapsible/
    │   │   ├── NavMainCollapsible.tsx        # disambiguating suffix kept on file name
    │   │   ├── NavMainCollapsible.stories.tsx  # title: "UI Molecules/Sidebar/NavMain/Collapsible"
    │   │   └── index.ts             # export { NavMainCollapsible as SidebarNavMainCollapsible }
    │   └── grouped/    NavMainGrouped.tsx
    └── team-switcher/               # multi-variant parent
        ├── grouped/    TeamSwitcherGrouped.tsx
        └── toggle/     TeamSwitcherToggle.tsx
```

**Block keys are stable.** The folder move does NOT change the kebab block key declared in `<name>Key = "..." as const`. `sidebarNavCollapseKey` stays `"sidebar-nav-collapse"`, `dashboardHeaderKey` stays `"dashboard-header"`, etc. — translation references under `blocks.<key>.*` and the `block-messages.ts` registry are unaffected.

**Translation patterns — there are three:**

1. **Owns its own labels** — molecule has fixed strings (group headings, dropdown items, ARIA labels) regardless of which section consumes it. Add `config.ts` (with `<name>Key` + `<name>Namespace`) and `en.json` under `blocks.<key>.*`. Component calls `useTranslations(<name>Namespace)` or `useScopedT(<name>Namespace)`. Example: `dashboard/header/`, `sidebar/nav-collapse/`, `sidebar/nav-footer/`.
2. **All text from parent's namespace** — molecule's labels are entirely variable per consumer. Component accepts `namespace: Parameters<typeof useScopedT>[0]` as a prop and reads everything via `useScopedT(namespace)` against the parent section's `en.json`. **No** `config.ts` / `en.json` of its own. Example: `sidebar/nav-main/grouped/`, `sidebar/nav-main/collapsible/`.
3. **Mixed** — molecule has some fixed labels of its own AND reads variable content from a passed `namespace`. Both patterns coexist: `useScopedT(<self>Namespace)` for fixed labels, `useScopedT(namespace)` (prop) for variable rows. Example: `sidebar/nav-notifications/`, `sidebar/team-switcher/grouped/`.

**No text at all.** If a molecule has zero `t(...)` calls and no hardcoded UI strings (e.g. `dashboard/calendars/`, `dashboard/date-picker/`, `dashboard/nav-secondary/`), it does NOT get a `config.ts` or `en.json` — they would be orphans. The `index.ts` only re-exports the component.

**Storybook title.** Always nests under the domain: `UI Molecules/<Domain>/<LeafIdentifier>` for single-variant (e.g. `UI Molecules/Sidebar/NavCollapse`, `UI Molecules/Dashboard/Header`); `UI Molecules/<Domain>/<Identifier>/<Variant>` for multi-variant (e.g. `UI Molecules/Sidebar/NavMain/Collapsible`, `UI Molecules/Sidebar/TeamSwitcher/Grouped`). The leaf in the title is the SHORT (no domain prefix) form because the parent folder already provides the domain context — keeps the Storybook sidebar tidy.

### Sidebar molecule ⇄ sidebar variant linkage

Each `layouts/dashboard-layout/sidebars/sidebar-NN/` variant composes a specific subset of `ui-molecules/`. Cross-referenced from each variant's actual imports:

| Sidebar variant (`layouts/dashboard-layout/sidebars/`) | Composes from `ui-molecules/`                                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `sidebar-01`                                           | `sidebar/nav-collapse`, `sidebar/nav-footer`, `sidebar/nav-header`, `sidebar/nav-main/collapsible`                                |
| `sidebar-02`                                           | `sidebar/nav-main/grouped`, `sidebar/nav-notifications`, `sidebar/team-switcher/grouped`                                          |
| `sidebar-03`                                           | `sidebar/nav-main/grouped`, `sidebar/nav-notifications`, `sidebar/team-switcher/grouped`                                          |
| `sidebar-04`                                           | `sidebar/nav-user`                                                                                                                |
| `sidebar-05`                                           | `sidebar/team-switcher/toggle`                                                                                                    |
| `sidebar-06`                                           | `sidebar/team-switcher/toggle`                                                                                                    |
| `sidebar-07`                                           | `dashboard/nav-main`, `dashboard/nav-user`, `dashboard/nav-secondary`, `dashboard/nav-documents`                                  |
| `sidebar-08`                                           | `dashboard/nav-main`, `dashboard/nav-favorites`, `dashboard/nav-secondary`, `dashboard/nav-workspaces`, `dashboard/team-switcher` |
| `sidebar-09`                                           | `dashboard/calendars`, `dashboard/date-picker`, `dashboard/nav-user`                                                              |

**Two domains, two patterns.** `sidebar-01..06` consume `ui-molecules/sidebar/*` — composites that are sidebar-shape-specific (nav-collapse, nav-footer, nav-header, nav-notifications, team-switcher variants). `sidebar-07..09` consume `ui-molecules/dashboard/*` — broader dashboard chrome that happens to render inside a sidebar shell (nav-main, nav-user, nav-workspaces, calendars, date-picker, …). The `ui-molecules/sidebar/` bucket is reserved for molecules whose contract is "I render inside a Sidebar primitive"; the `ui-molecules/dashboard/` bucket holds molecules whose contract is "I'm a dashboard fragment, drop me anywhere — including a sidebar".

**Inconsistency to flag.** `sidebar-07/08/09` only pull from `ui-molecules/dashboard/`, never `ui-molecules/sidebar/`. The split feels reasonable on its surface (their molecules genuinely are dashboard fragments first, sidebar-resident second), but it means the two domain folders are NOT a strict layer — the `dashboard/` domain provides molecules that are de-facto sidebar chrome too. If a future variant pulls from BOTH domains, that's a sign the split needs revisiting (either promote a `dashboard/*` molecule into `sidebar/*` if its only consumers are sidebars, or accept the looser convention as documented above).

### Dashboard page-template ⇄ layout ⇄ sidebar ⇄ molecules linkage

The full chain renders top-down through four layers — one page-template, one layout, one sidebar variant, N molecules. Cross-referenced from each file's actual imports:

```
pages-dashboard/dashboard-01/  ─┐
                                ├─ uses layout: dashboard
                                │     └─ layouts/dashboard-layout/
                                │           ├─ DashboardLayout.tsx                            (chrome wrapper: SkipLink + SidebarProvider + main + footer)
                                │           ├─ ui-molecules/dashboard/header  → DashboardHeader   (sticky header chrome above the inset)
                                │           └─ sidebars/sidebar-07            → Sidebar07         (default; offcanvas Sidebar)
                                │                 └─ ui-molecules/dashboard/{nav-main, nav-user, nav-secondary, nav-documents}
                                └─ renders sections: SectionCards, ChartAreaInteractive, DataTable
```

`DashboardLayout` also imports `SkipLink` from `layouts/_shared/skip-link` and `SiteFooter` from `layouts/default-layout/site-footer` (single-source footer reused across every layout).

The two non-default sidebar variants `sidebar-08` and `sidebar-09` consume different dashboard molecules — see the "Sidebar molecule ⇄ sidebar variant linkage" table above. Swapping which one `DashboardLayout` mounts is a one-line edit in `DashboardLayout.tsx`.

**Architectural smells (left in place — not load-bearing).** The `Dashboard.tsx` template still imports `SectionCards` from `sections-dashboard/section-cards/` and `DataTable` from `sections-data/data-table/`. `SectionCards` is functionally a kpi-card grid molecule and `DataTable` has no per-callsite content shape (the rows come from `sample-data.ts`); both are molecule-class fragments living in `sections-*/` buckets they don't really belong in. Promoting them to `ui-molecules/dashboard/{kpi-cards,data-table}/` would tighten the layer boundary; leaving them as-is is fine until someone needs a second consumer.

## Component-co-located CSS (auto-aggregated)

Animations and any other component-scoped styles live next to the component in a sibling `<name>.css` file:

```css
/* src/components/ui-effects/meteors.css */
@theme inline {
  --animate-meteor-effect: meteor-effect 5s linear infinite;
  @keyframes meteor-effect {
    0% {
      transform: rotate(215deg) translateX(0);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: rotate(215deg) translateX(-500px);
      opacity: 0;
    }
  }
}
```

`scripts/generate-component-styles.mjs` walks `src/components/**/*.css` and writes the sorted `@import` list to `src/app/_component-styles.css` (tracked, deterministic). `globals.css` only imports the aggregator. The codegen runs as `predev` / `prebuild` / `prebuild-storybook`, so dropping a new `.css` next to a component is enough — no edits to `globals.css`.

`pnpm verify:styles` regenerates and fails CI if the committed file is stale.

## The Config-First Principle

The default template ships rich defaults. When customizing for a real project, edit `src/config/*` + `messages/*` first; touch component code only when defaults can't express the change.

- Component code NEVER hard-codes brand strings, URLs, colors, nav links, or SEO copy — read them from `@/config/*`.
- Adding content is a config edit, never a component rewrite.
- New content surface area = new section variant, never inline JSX scattered across pages.
- Copying a component file to change two strings? Stop — push the strings into config or `messages/`.
- Don't need a section/template? Delete the folder. The codegen regenerates without it.

## Sections — the content model

Sections are content blocks that page-templates compose. They live in per-domain buckets:

- Marketing → `src/components/sections-marketing-{type}/<variant>/` (cta, faq, features, pricing, …)
- App → `src/components/sections-app-{type}/<variant>/` (dashboard, data, modals, lists, timelines, onboarding). Charts moved to `ui-molecules/chart/{area,bar}/<variant>/` since they are molecule-class — single chart per file, no section semantics. Dashboard nav lists, widgets, and sidebar-internal molecules live in `ui-molecules/`; sidebar variants live inside `layouts/DashboardLayout/sidebars/sidebar-NN/`; the `DashboardHeader` chrome lives in `ui-molecules/dashboard/header/` — see Chrome rule above.
- Auth → `src/components/sections-auth/<variant>/`. Current contents: `forgot-password/` (page-template-shaped — candidate for refactor into `pages-forgot-password/`) and `login-01..09/` (page-filler section variants). The reusable login + signup form molecules moved to `ui-molecules/auth-form/{login,signup}/` since they are consumed by `pages-login/login-01/` and `pages-signup/signup-01/` rather than iterated from `page.config.sections[]`.

**Section folder layout** (5-file pattern):

```
sections-ai/ai-01/
├── Ai.tsx                     # component (file name drops the variant number)
├── schema.ts                  # typed Block shape (AiBlock — also drops the number)
├── config.ts                  # sample data (ai01Sample export — KEEPS the number)
├── en.json                    # source-of-truth English strings
├── Ai.stories.tsx             # Storybook (title "Sections/Ai/Ai01" — keeps the number)
└── index.ts                   # barrel — re-aliases as Ai01Section / Ai01Block
```

**Adding a section variant** (the happy path):

1. Drop a new folder under the right bucket: `sections-cta/cta-02/`.
2. Add the 5-file pattern. The component file is `<Bucket>.tsx` (no digits) but `<bucket><NN>Key`, `<bucket><NN>Namespace`, and `<bucket><NN>Sample` consts in `config.ts` carry the variant number.
3. Run `pnpm gen:i18n` — the codegen picks up the new `en.json` automatically and updates `block-messages.ts` + `types/messages.ts`.
4. Reference the section directly inside whichever page-template needs it (`<Cta02Section {...cta02Sample} id="..." />`).
5. `pnpm verify` — done.

**Section variants in one component** — when 2–4 looks share the same content shape, add a `variant?: "default" | "compact"` discriminator to the schema instead of a new section type. Rule of thumb: more than 2 optional fields only relevant for one variant → split into a separate section.

**Generic item keys for tab/slide arrays.** Sections in `sections-features-carousel/` and `sections-features-expandable/` (and any other section that exposes a positional array of tabs, slides, or pills) use **positional generic keys** in `config.ts` and `en.json` rather than descriptive names tied to a specific feature. Carousels use `slide1`, `slide2`, …; expandables use `tab1`, `tab2`, … The key is what shows up in the i18n path (`blocks.<variant>.items.tab1.title`), not the rendered label — labels stay human-readable and project-specific.

```ts
// config.ts — keys are positional, illustration / icon / device discriminators stay descriptive
items: [
  {
    illustration: "modelsCredits",       // discriminator — keeps semantic meaning
    iconKey: "brain",                    // discriminator — keeps semantic meaning
    titleKey: "blocks.features-expandable-1.items.tab1.title",
    bodyKey:  "blocks.features-expandable-1.items.tab1.body",
  },
  {
    illustration: "map",
    iconKey: "globe",
    titleKey: "blocks.features-expandable-1.items.tab2.title",
    bodyKey:  "blocks.features-expandable-1.items.tab2.body",
  },
],
```

```jsonc
// en.json — generic keys, descriptive labels
"items": {
  "tab1": { "title": "Multi-model AI access", "body": "..." },
  "tab2": { "title": "Global infrastructure",  "body": "..." }
}
```

Why: the position in the array is the only thing that's truly stable across customisations. A consumer who decides to swap `models` for `analytics` shouldn't have to rename every i18n key — they keep `tab1` and just change the labels. Discriminator fields (`illustration`, `iconKey`, `device`, etc.) ARE descriptive because they're functional pickers (they choose which icon / illustration component to mount), not translation keys.

## Layouts — per-page chrome

Each page-template picks a layout via its `<name>Defaults.layout` (overridable per-callsite via the `layout` prop). The registry in `src/components/layouts/registry.ts` exposes:

- `default` — no wrapper; sections control their own containers
- `dashboard` — admin shell
- `full-bleed` — edge-to-edge (auth flows, full-screen landings)
- `prose` — narrow reading column (legal pages, blog posts)
- `sidebar` — two-column with sticky aside (docs, knowledge bases)

**Adding a layout:** drop `<Name>Layout/<Name>Layout.tsx` in `src/components/layouts/`, register in `registry.ts`, extend `LayoutName`.

### Chrome ownership — layouts, not the locale layout

`[locale]/layout.tsx` only mounts providers (`ThemeProvider`, `NextIntlClientProvider`) and the JSON-LD graph. The chrome — `SkipLink`, header, `<main id="main" tabIndex={-1}>`, footer — lives **inside** each layout. That makes Storybook show pages with their real chrome AND lets each layout pick the right defaults.

**Configurable slots.** Every layout accepts `header?: boolean | ReactNode` and `footer?: boolean | ReactNode`:

- `true` → render the layout's default (e.g. `<Header9 />` for `DefaultLayout`, `<DashboardHeader />` for `DashboardLayout`, `<SiteFooter />` for the footer slot everywhere).
- `false` → render nothing.
- `ReactNode` → render that node in place of the default.

**Every layout guarantees**: `<SkipLink />` mounted first, exactly one `<main id="main" tabIndex={-1}>`, a header slot (default rendered unless noted), and a footer slot defaulting to `<SiteFooter />`. Pass `header={false}` / `footer={false}` to opt out, or pass a `ReactNode` to swap in a custom slot.

**Default chrome per layout** (every layout ships a footer; pass `footer={false}` to opt out):

| Layout            | Default header                                       | Default footer                                      |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `DefaultLayout`   | `<Header9 />` (swap via header prop, see catalog)    | `<SiteFooter />`                                    |
| `ProseLayout`     | `<Header9 />`                                        | `<SiteFooter />`                                    |
| `SidebarLayout`   | `<Header9 />`                                        | `<SiteFooter />`                                    |
| `FullBleedLayout` | none (opt-in via `header` prop)                      | `<SiteFooter />`                                    |
| `DashboardLayout` | `<DashboardHeader />` (fixed; `header` prop ignored) | `<SiteFooter />` (inside the inset, below `<main>`) |

**The single-`<main>` rule still holds.** Each layout MUST render exactly one `<main id="main" tabIndex={-1}>`. If you need shadcn's `<SidebarInset>` (which is itself a `<main>`), inline its classes onto a `<div>` like `DashboardLayout` does, and put `<main>` on the inner content wrapper.

**Bare routes** (auth, error, not-found) must wrap themselves in a layout — typically `FullBleedLayout` for auth and `DefaultLayout` for error/404 — so they get the SkipLink target. Don't render forms or sections directly under the locale layout.

## Page templates — `pages-*/`

`src/components/pages-{category}/<variant>/` ships ready-made compositions of one layout + N section samples. Each template is a real React component used by both Storybook (`Pages/{Category}/{Variant}`) and live routes — `[locale]/page.tsx` imports `Landing01`, `[locale]/dashboard/page.tsx` imports `Dashboard01`, etc. Categories mirror the section buckets: `pages-landing/`, `pages-about/`, `pages-dashboard/`, `pages-login/`, `pages-signup/`, `pages-forgot-password/`, `pages-error/`, `pages-not-found/`. Current starter set:

| Folder                                                        | Default layout | Used by route      |
| ------------------------------------------------------------- | -------------- | ------------------ |
| `pages-landing/landing-01/Landing.tsx`                        | `default`      | `/`                |
| `pages-about/about-01/About.tsx`                              | `default`      | `/about`           |
| `pages-dashboard/dashboard-01/Dashboard.tsx`                  | `dashboard`    | `/dashboard`       |
| `pages-login/login-01/Login.tsx`                              | `full-bleed`   | `/login`           |
| `pages-signup/signup-01/Signup.tsx`                           | `full-bleed`   | `/signup`          |
| `pages-forgot-password/forgot-password-01/ForgotPassword.tsx` | `full-bleed`   | `/forgot-password` |
| `pages-error/error-01/Error.tsx`                              | `default`      | `error.tsx`        |
| `pages-not-found/not-found-01/NotFound.tsx`                   | `default`      | `not-found.tsx`    |

**Folder shape — same 5-file pattern as sections:**

```
pages-landing/landing-01/
├── Landing.tsx            # component (layout + sections) — file name drops the number
├── Landing.stories.tsx    # default + layout-variant stories
├── config.ts              # `<name><NN>Defaults` (layout, section ids, …) + namespace
├── en.json                # page-scoped translations under `blocks.<key>.*`
└── index.ts               # barrel — re-aliases as Landing01 / Landing01Props
```

**Configurable props (every template).** All page-templates accept these so the same component renders differently in Storybook stories and live routes:

- `layout?: LayoutName` — override the wrapping layout (default in `config.ts`).
- `header?: boolean | ReactNode` — forwarded to the layout's header slot.
- `footer?: boolean | ReactNode` — forwarded to the layout's footer slot.

**SEO defaults are part of the template.** Each template's `config.ts` exports a `<name>Defaults.seo` of type `PageSeo` (titleKey, descriptionKey, keywords, openGraph, …). Routes pass that object as `templateSeo`, and `buildMetadata` merges it with any `seo:` declared on the route's `page.config.ts` (route wins per field):

```tsx
// src/app/[locale]/page.tsx — route just wires defaults + page config.
import homePage from "./page.config";
import { Landing01, landing01Defaults } from "@/components/pages-landing/landing-01";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: homePage,
    templateSeo: landing01Defaults.seo,
    locale,
  });
}
```

**To expand SEO per page**, declare overrides on the route's `page.config.ts`:

```ts
// src/app/[locale]/page.config.ts
export default definePage({
  key: "/",
  id: "home",
  slugs: "/",
  layout: "default",
  seo: {
    keywords: ["holiday", "campaign"],
    noindex: true,
    structuredData: [
      /* page-specific JSON-LD */
    ],
  },
});
```

Any field set here overrides the template default. Fields you omit fall back to the template. Adding SEO to a new page = one field in `page.config.ts`, no spread plumbing in the route.

**Adding a template:**

1. `mkdir src/components/pages-<category>/<variant>/`
2. Drop the 5 files. Choose `<name>Key = "<variant>"`. Make `<name>Defaults.seo` point its `titleKey`/`descriptionKey` at `"blocks.<variant>.title"` / `"blocks.<variant>.description"` and add those keys to `en.json`.
3. Pull section copy from each section's `<type>Sample` export — never inline strings.
4. Run `pnpm gen:i18n` — codegen picks up the new `en.json` automatically and updates `block-messages.ts` + `types/messages.ts`.
5. Reference from a route: `import { <Name>, <name>Defaults } from "@/components/pages-<category>/<variant>"`.

**Customizing a template** — open `src/components/pages-{bucket}/<variant>/` and edit. `.tsx`, `config.ts`, `en.json` are all source-of-truth. No fork, no overlay, no swap-export ritual: change what you need where it lives. Delete templates you'll never use — codegen rebuilds without them.

## Routing

- ALL routes live under `src/app/[locale]/` — including admin routes like `/dashboard` (renders as `/en/dashboard`, `/fr/dashboard`). Keeping the dashboard inside the locale tree means it inherits the locale layout's `ThemeProvider` and `NextIntlClientProvider` instead of duplicating providers (the chrome itself comes from the in-page layout each route picks).
- Internal pathnames declared once in `src/config/routes.config.ts` with per-locale translations.
- ALWAYS import `Link`, `useRouter`, `redirect`, `usePathname`, `getPathname` from `@/i18n/routing` — never from `next/link` or `next-intl/navigation`.
- `StaticAppPathname` excludes dynamic segments — use it in nav config + section schemas. `AppPathname` for sitemap/metadata.

## i18n workflow

Three tiers merge at request time into a single `next-intl` tree:

1. **Global** → `messages/<locale>.json` at repo root. Cross-cutting strings: `nav`, `cta`, `footer`, `common`, `typography`, `llms`.
2. **Per-route** → `src/app/[locale]/<seg>/messages/<locale>.json`. Merged under `pages.<id>.*`. Useful when a route needs custom strings the template doesn't provide.
3. **Per-block / per-template** → `src/components/<bucket>/<variant>/en.json`. Aggregated by `src/i18n/block-messages.ts` under `blocks.<key>.*` (English only — non-English locales override at root tier 1).

**Adding a locale:** push into `SUPPORTED_LOCALES`, mirror `messages/<locale>.json` at root + every per-page folder, add the static imports to `src/config/pages/messages.ts`.

**Rules:**

- Never inline user-facing strings — pass `…Key` props that resolve via `useTranslations()`.
- Keep key trees identical across every locale JSON.
- ALWAYS `setRequestLocale(locale)` at the top of server components that use translations or metadata.

### Storybook isolation

**Why it exists.** The app at request time merges three message tiers (root + per-page + ~500 per-block `en.json`) into one big tree — every component can resolve any key. That's right for the app but wrong for Storybook: a story for `Sections/Faq/Faq01` should NOT silently borrow translations from `cta-01` or `dashboard-header`. The isolation system gives each story its own messages tree so a missing key inside its own `en.json` shows up immediately as a missing translation, not as a coincidentally-resolved one from a sibling.

**How it works.** `pnpm gen:i18n` writes two generated maps alongside `MessageKey`:

- `src/i18n/block-messages.ts` — the FULL tree, exposed via `loadBlockMessages()`. Used by `src/i18n/request.ts` at request time. App runtime behavior is unchanged.
- `src/i18n/story-messages.ts` — a `STORY_MESSAGES` map shaped `{ [storyTitle]: { [blockKey]: enJson } }`. One entry per `*.stories.tsx` that has a sibling `en.json` (folder-shared `en.json` OR flat `<basename>.en.json`). The generator parses each story's `title:` string and pairs it with its own `en.json` content.

`.storybook/preview.tsx`'s decorator picks a path per render based on `ctx.title`:

| Story title prefix                       | Messages path                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `Pages/*`, `Layouts/*`                   | **Full tree** — root + `loadPageMessages()` + `loadBlockMessages()`.             |
| Anything ELSE that's in `STORY_MESSAGES` | **Isolated** — root + `{ blocks: { [thisBlockKey]: thisEnJson } }`, `pages: {}`. |
| Anything ELSE not in `STORY_MESSAGES`    | **Full tree** (fallback — ui-primitives etc. without own `en.json`).             |

Root chrome (`messages/<locale>.json` — `nav`, `cta`, `footer`, `common`, `typography`, `llms`) is loaded in EVERY path so layout chrome still renders.

**Why Pages and Layouts use the full tree:** page-templates compose multiple section samples (Hero + Features + CTA + …), and layouts mount default chrome (header + footer + sidebar variants). Each inner block reads from its OWN namespace, so the parent's `en.json` alone wouldn't cover them. Strict isolation would render those stories with missing strings everywhere — not a useful preview.

**Why Sections / Molecules use isolation:** these are leaf or near-leaf components. Their `en.json` covers all the strings the component itself reads. If the section embeds a molecule that has its own translations, the molecule strings WILL show as missing in the story preview — that's the signal: "this section's own `en.json` doesn't tell the whole story; the molecule needs its own entry or the consumer needs to pass props." Easy to spot in isolation; invisible in a full-tree render.

**Drift guard.** `pnpm verify:i18n` regenerates both maps + the type tree and `git diff --exit-code`s them, so any new `*.stories.tsx` or `en.json` that lands without running the generator fails CI. Storybook itself does NOT call the generator — it imports the committed `story-messages.ts` directly.

**Adding a new story:** just write the story file with a `title: "Bucket/Sub/Name"` and a sibling `en.json` (if it has its own strings). Run `pnpm gen:i18n`. The story shows up in `STORY_MESSAGES` and gets isolation automatically.

**Adding a translation-less story (effect / primitive):** no `en.json` needed. The story title won't appear in `STORY_MESSAGES`; the decorator falls back to the full tree. No special handling.

**Opting out of isolation** for a leaf-shaped story that secretly composes blocks (rare): give it a title that starts with `Layouts/` or `Pages/`, OR remove its `en.json` (the fallback path kicks in). There's no per-story parameter today — the title prefix IS the switch.

**App runtime is untouched.** `src/i18n/request.ts` continues to call `loadBlockMessages()` + `loadPageMessages()` and deep-merge with root overrides. Production users get the same composed tree they always did. Isolation is a Storybook-only optimization for translator-friendly previews.

### Customizing translations (the three patterns)

```jsonc
// 1. Override one block string for one locale — ROOT messages.
// messages/fr.json
{
  "blocks": {
    "cta-01": {
      "title": "Mon CTA personnalisé"
    }
  }
}

// 2. Page-specific override — PER-ROUTE messages, then aim a section/template
//    prop at the new key. messages/<locale>.json under pages.<id>.*:
// src/app/[locale]/messages/en.json
{
  "home": {
    "heroTitle": "Welcome"
  }
}
// Then in the template (edit src/components/pages-landing/landing-01/Landing.tsx):
// <Features01Section ... titleKey="pages.home.heroTitle" />

// 3. Add a brand-new translation key — bundle it with the template's
//    en.json under blocks.<key>.*. `pnpm gen:i18n` picks it up.
```

### MessageKey type

`src/types/messages.ts` derives a dotted-path union from the merged English message tree. `titleKey`, `descriptionKey`, etc. on every section schema is typed as `MessageKey` — typos are compile errors. No codegen step.

## Feature flags — three tiers

`src/config/features.config.ts`:

- **Global** — `analytics`, `cookieBanner`, `llmsTxt`, `localeSwitcher`, `newsletter`
- **Modules** (`features.modules.*`) — `blog`, `shop`, `search`, `comments`. Pages attach via `moduleKey: "blog"`; off → 404
- **Per-page / per-section** (`enabled?: boolean`) — hide a single page/section without touching modules

Route files gate with `isPageVisible(page)` then `notFound()`. Sitemap filters via the same helper.

## SEO + JSON-LD

- `buildMetadata({ blueprint, locale, params? })` is the only way to set `<head>` tags. Builds canonical + full hreflang map.
- `siteConfig.url` must be the production origin in every environment (`NEXT_PUBLIC_SITE_URL`).
- `sitemap.ts` lists static routes × locales — append for dynamic sources (blog slugs etc).
- JSON-LD lives in `src/lib/seo/jsonld.tsx` — `buildOrganizationSchema()`, `buildWebSiteSchema()`, `composeGraph()`. Root layout emits Organization + WebSite via one graph; per-page schemas go in `page.seo.structuredData[]` and route files emit them inline alongside `generateMetadata`.
- **Satori gotcha:** `next/og` doesn't understand `oklch()` — that's why `themeConfig.hexColors` exists alongside `themeConfig.colors`. Update both in the same commit when rebranding.

## Theming

- Tailwind v4 + CSS variables. Tokens live in `theme.config.ts`, mirrored in `globals.css :root` as `oklch(...)`.
- Two dark triggers (precedence): `html[data-theme="dark"]` (user choice via next-themes), then `@media (prefers-color-scheme: dark)`.
- `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` makes `dark:` utilities match on the attribute.
- ThemeToggle (in `theme/`) cycles system → light → dark via `useSyncExternalStore` (SSR-safe).
- Container: `max-w-(--max-container)` + `px-(--gutter)`.
- `pnpm verify:contrast` parses globals.css, asserts WCAG AA across theme-token pairs. Run after any theme change.

## Accessibility (WCAG 2.1 AA target)

- `<html lang>` + `dir` come from the active locale.
- `components/layout/SkipLink` is mounted first in the body, targets `#main`.
- `<main id="main" tabIndex={-1}>` in `[locale]/layout.tsx`.
- Every section: `<section aria-labelledby="…">` pointing at its heading.
- Prefer semantic HTML over ARIA. `<button type="button">`, `<a>`, `<input>` — ARIA roles only when no native element fits.
- Icons `aria-hidden="true"` by default; `aria-label` only when the icon is the sole label.
- Never `onClick` on `<div>`/`<span>` — use a button.
- Respect `prefers-reduced-motion` (handled in `globals.css`).

## Critical rules

- NEVER commit `.env*` (only `.env.example`).
- NEVER hard-code brand strings, URLs, colors, or nav entries in components — read from `@/config/*`.
- NEVER import from `next/link` or `next-intl/navigation` — use `@/i18n/routing`.
- NEVER add `as any` — fix the type. If genuinely impossible, eslint-disable with a one-line reason.
- NEVER swallow errors — at minimum `logger.error(...)` from `@/lib/logger`.
- NEVER flatten a component into a bare file — folder + `index.ts` barrel.
- NEVER put page-specific strings in `messages/<locale>.json` (root) — they belong under `src/config/pages/<id>/messages/`.
- NEVER edit `src/components/ui-primitives/**` (vetted shadcn primitives, CLI-managed) or the FLAT files at `src/components/ui-effects/*.tsx` (upstream Aceternity / MagicUI). Wrapper folders inside `ui-effects/` (e.g. `ui-effects/command-palette/`) are yours to author. New shadcn drops land in `src/components/ui/` for review before being promoted into `ui-primitives/`.
- NEVER set state inside `useEffect` to mark hydration — use `useSyncExternalStore`.
- ALWAYS `setRequestLocale` at the top of server components using translations or metadata.
- ALWAYS run `pnpm verify` before pushing. Pre-push hook runs lint + tsc; full verify also covers format + contrast + pages + styles.

## File-size discipline

- Components < 200 lines. Split at the natural seam.
- Page blueprints < 150 lines. New section type instead of inlining variation.
- Config files exempt — as long as the data requires.

## Security baseline

- No `dangerouslySetInnerHTML` from user input. Static JSON-LD is the only allowed use.
- No secrets in `NEXT_PUBLIC_*`.
- Validate external data at boundaries (server actions, API routes) with Zod.
- Security headers + CSP set globally in `next.config.ts` (uses `getCSPConnectSources()` from `environments.config.ts`).
- Restrict remote image hosts in `next.config.ts#images.remotePatterns`.

## Adding things — the four happy paths

Same mental model for everything: drop the file in the right shape, run `pnpm gen`, verify. Codegen picks up `en.json` + `page.config.ts` automatically — no manual registry edits.

### Adding a `ui-primitives/` (shadcn primitive)

shadcn primitives are **upstream** — you don't author them. The `shadcn` CLI drops files into `src/components/ui/` (the staging dir per `components.json` aliases). You review them there, then promote into `ui-primitives/`.

```bash
pnpm dlx shadcn@latest add button             # lands in src/components/ui/button.tsx
pnpm lint                                     # the staging dir IS linted; review findings
mv src/components/ui/button.tsx \
   src/components/ui-primitives/button.tsx    # promote once you accept the diff
```

If the primitive already exists in `ui-primitives/`, diff first; usually delete the staging copy. Always import from `@/components/ui-primitives/<name>` everywhere — never from `@/components/ui/`.

### Adding a `ui-effects/` block (Aceternity / MagicUI / blocks-so / etc.)

External registries are wired in `components.json` under `registries`. Use the `@<registry>/<name>` syntax:

```bash
pnpm dlx shadcn@latest add @blocks-so/table-02
```

This drops the FLAT block file at `src/components/<name>.tsx` plus any required primitives in the staging `ui/` dir. Two cleanup steps:

1. **Move the block** out of the components root and into a section or wrapper folder:
   - **If it's content** (a table, a hero, a feature grid …) → wrap into a section under `src/components/sections-<type>/<variant>/` using the 5-file pattern (see "Adding a section" below). This is what was done for `@blocks-so/table-01` → `sections-data/table-1/` and `@blocks-so/table-02` → `sections-data/table-2/`.
   - **If it's a decorative effect** (animation primitive, background, etc.) → keep it as a flat file under `src/components/ui-effects/<slug>.tsx`. If you need to brand or localize it, add a wrapper folder `ui-effects/<Name>/` next to it (see WRAPPERS.md).

2. **Repoint primitive imports** from `@/components/ui/<name>` → `@/components/ui-primitives/<name>` and delete the staging duplicates.

3. **Write a real `config.ts` and `en.json`.** Do NOT leave stub markers (e.g. `_marker: "extract later"`) or TODOs in place of real content. Every install MUST result in:
   - `config.ts` exporting `<name>Key`, `<name>Namespace`, and any extracted demo arrays (id + href + iconKey shape — never raw English strings here).
   - `en.json` with EVERY visible string the component renders. Hardcoded English in the component (titles, descriptions, button labels, sr-only text, aria-labels) is a violation. Replace with `t(...)` calls and add the corresponding key to `en.json`.
   - Component imports `useScopedT(<name>Namespace)` (or `useTranslations` against the namespace) and reads all labels through it. Never inline `<span>Some Label</span>` in committed registry components — the translation step is part of the install, not a future TODO.

   Why: registry blocks ship hardcoded English. Skipping the translation step right after install means later customizers have to grep the component to find every string, and every CI check (`pnpm verify:i18n`) keeps the orphan demo strings in scope. Do it once, do it now.

Run `pnpm gen:i18n` after — auto-discovers any new `en.json`.

### Adding a section (the 5-file pattern)

```
src/components/sections-<type>/<variant>/
├── <Name>.tsx          # component
├── schema.ts           # typed Block (`type: "<variant>"`, MessageKey props)
├── config.ts           # <name>Key + <name>Namespace + <name>Sample export
├── en.json             # English copy under `blocks.<variant>.*`
├── <Name>.stories.tsx  # title: "Sections/<Type>/<Variant>"
└── index.ts            # barrel
```

Required exports per file:

- **`config.ts`** — `<name>Key = "<variant>" as const`, `<name>Namespace = "blocks.<variant>"`, `<name>Sample: Omit<<Name>Block, "id">` for callers to spread.
- **`schema.ts`** — `<Name>Block` type with `type: "<variant>"` discriminator, `id: string`, all visible strings as `MessageKey` props.
- **`<Name>.tsx`** — uses `useTranslations(<name>Namespace)`, accepts `<Name>Block` as readonly props, renders `<section aria-labelledby={...}>`.
- **`index.ts`** — re-exports `default as <Name>Section` (component), the Block types, and the config constants.

Steps:

1. `mkdir src/components/sections-<type>/<variant>/`
2. Drop the 5 files. Pick a unique `<variant>` (e.g. `cta-02`, `pricing-03`). The component file is `<Bucket>.tsx` (no digits); the barrel re-aliases as `<Bucket><NN>Section`.
3. `pnpm gen:i18n` → codegen picks up `en.json` and updates `block-messages.ts` + `MessageKey`.
4. Reference from a page-template: `<NameSection {...nameSample} id="page-name" />`.
5. `pnpm verify` — done.

### Adding a page (route + template)

Pages have two pieces: a **page-template** (composition under `src/components/pages-<name>/<variant>/`) + a **route** (`src/app/[locale]/<seg>/page.tsx`). The template is reusable; the route is the Next.js boundary.

1. **Create the page-template** — same 5-file pattern as a section, plus an SEO default:

   ```
   src/components/pages-<name>/<variant>/
   ├── <Name>.tsx              # composes layout + section samples
   ├── config.ts               # <name>Defaults: { layout, seo: PageSeo, ... }
   ├── en.json                 # title + description (used by SEO defaults)
   ├── <Name>.stories.tsx      # title: "Pages/<Name>/<Variant>"
   └── index.ts
   ```

2. **Create the route folder** and a slim `page.config.ts`:

   ```ts
   // src/app/[locale]/<seg>/page.config.ts
   import { definePage } from "@/config/pages/types";
   export default definePage({
     key: "/foo",
     id: "foo",
     slugs: { en: "/foo", fr: "/foo-fr" }, // per-locale slugs supported
     layout: "default",
     // optional per-route SEO override (merges over template defaults)
     seo: { keywords: ["holiday-campaign"] },
   });
   ```

3. **Run `pnpm gen`** — picks up the new `page.config.ts` (regenerates `routes.types.ts` + `pages/registry.generated.ts`) AND the new `en.json`.

4. **Add the route file**:

   ```tsx
   // src/app/[locale]/<seg>/page.tsx
   import newPage from "./page.config";
   import { Template, templateDefaults } from "@/components/pages-<name>/<variant>";
   import { buildMetadata } from "@/lib/metadata";

   export async function generateMetadata({ params }: Props) {
     const { locale } = await params;
     return buildMetadata({ page: newPage, templateSeo: templateDefaults.seo, locale });
   }

   export default async function Page({ params }: Props) {
     const { locale } = await params;
     setRequestLocale(locale);
     return <Template />;
   }
   ```

5. Optional: nav entry in `navigation.config.ts`, `opengraph-image.tsx` in the segment.
6. `pnpm verify` — done.

### Porting a full marketing page from a third-party registry

When `pnpm dlx shadcn@latest add @tailark-pro/<page>` (or any registry that ships a multi-section composition) drops a whole `src/app/(marketing)/...` tree plus a stack of bare files at `src/components/<flat>.tsx`, **don't reuse the project's curated versions** of components that look similar. They almost always diverge: cleaned-up illustrations, fixed typos (`DocumentIllustation` → `DocumentIllustration`), Card primitive with `flex flex-col gap-6 py-6 border` baked in (vs upstream's plain `Card`), different prop interfaces, etc. Your faithful port will silently break.

The integrate-as-it-arrives workflow:

1. **Install with `--overwrite`** so the upstream versions land cleanly on top of any prior staging:
   ```bash
   pnpm dlx shadcn@latest add @tailark-pro/<page> --overwrite
   ```
2. **Relocate every staged file** with a disambiguating prefix (e.g. `<page>-*`) so it co-exists with the project's curated equivalents:
   - `src/components/illustrations/*.tsx` → `src/components/ui-illustrations/<prefix>-*.tsx`
   - `src/components/<flat>.tsx` (illustrations like `map.tsx`) → `ui-illustrations/<prefix>-*.tsx`
   - `src/components/ui/{card,button,accordion,navigation-menu}.tsx` → `ui-primitives/<prefix>-*.tsx`
   - `src/components/ui/text-effect.tsx` → `ui-effects/text-effect.tsx` (rare upstream flat — fits there)
   - `src/components/ui/svgs/*.tsx` → `ui-primitives/svgs/<prefix>-*.tsx`
   - `src/components/logo.tsx` → `ui-primitives/<prefix>-logo.tsx` (then **relink the navbar/footer to the project's existing `@/components/layouts/_shared/logo`** — branding is project-curated and should be reused even in dark-landing ports).
3. **Fix imports** inside the relocated illustrations — they reference `@/components/logo` / `@/components/illustrations/*` / `@/components/ui/button`, all of which now point to the relocated paths.
4. **Port each section** to its bucket (`sections-{hero,cta,features,...}/<variant>/`) using the 5-file pattern. Preserve JSX **verbatim** — the only edits are translatable strings flowing through `tRoot(...)` calls against `blocks.<key>.*`. Don't refactor; the layout is the section's identity.
5. **Compose the page-template** under `pages-<category>/<variant>/` — its `Landing.tsx` defaults `header={<HeaderN />}` and `footer={<SiteFooterN />}` so the full chrome ships out of the box.
6. **Cleanup** the staging dirs: delete `src/app/(marketing)/`, `src/components/{header,footer,logo,logo-cloud,call-to-action,testimonials-section,map}.tsx`, the `src/components/ui/` dir, `src/lib/const.ts` (avatars — re-inline inside the testimonials section's config).
7. **Theme-compatibility audit** (run after porting each illustration / section — third-party registries assume dark mode):
   - Hardcoded fixed-shade colors (`from-slate-900/50`, `bg-gray-900`, `bg-blue-950 mix-blend-color`, etc.) → `from-foreground/<n>` / `bg-foreground/<n>` (theme-aware tokens).
   - "Selected text" / inline highlights with single-mode contrast (`bg-indigo-900/25 text-indigo-300`) → `bg-indigo-500/15 text-indigo-700 dark:text-indigo-300` so both modes have AA contrast.
   - Heavy single-mode shadows (`shadow-black/55`, `shadow-black/65`, bare `shadow-black`) → `shadow-black/15` works in both modes.
   - Dark-only image screenshots (the upstream ships only a dark PNG) → render inside an always-dark inner frame (`bg-zinc-950`) so the dark image looks like an intentional device-chrome screenshot in light mode.
   - `data-theme="dark"` overrides on a section force it dark regardless of the user's theme — drop them when the page is meant to be theme-compatible.
   - Hero-style outer rounded frame + inner rounded image: align radii (outer `rounded-2xl` + inner `rounded-xl` with matching padding) so the inner clip lands cleanly inside the outer curve.
8. **Verify**: `pnpm gen:i18n && pnpm verify:quick` — expects 0 TS errors, 0 lint errors. The `<page>-*` prefix on illustrations means `MessageKey` paths stay disjoint from existing entries.

The result is a self-contained section family the user can fork in place, while the project's existing `Logo`, `Card`, `Button`, etc. stay untouched for the rest of the codebase.

## shadcn/ui — the upstream rule

- `src/components/ui-primitives/**` is the vetted shadcn surface — READ-ONLY. New `pnpm dlx shadcn@latest add <component>` drops land in `src/components/ui/` (staging) where lint runs against them; promote into `ui-primitives/` once they pass review.
- Need a variant? Drop a wrapper folder inside `src/components/ui-effects/<Name>/` (the same directory holds upstream flat files; folder children are editable).
- `@/lib/utils` holds the canonical `cn()` (clsx + tailwind-merge) — don't rename, shadcn writes against it.
- `.mcp.json` wires `shadcn` (`npx shadcn@latest mcp`) and `magicui` (`npx -y @magicuidesign/mcp@latest`) MCP servers. Run `/mcp` to verify.

## Aceternity / Magic UI — same upstream rule

The FLAT files at `src/components/ui-effects/*.tsx` are hand-copied upstream code. Read-only by the same logic — patches risk being clobbered by future updates. Variants go in **wrapper folders** that live in the same directory (`src/components/ui-effects/<Name>/`); the folder shape mirrors a section's 5-file pattern and is yours to edit.

Both flat upstream files and shadcn primitives carry per-file `/* eslint-disable */` + `// @ts-nocheck` headers documenting their upstream status. The headers list the exact rules being suppressed so the divergence stays visible in code review.

### UI Effects sidebar categories

Storybook stories under `UI Effects/` are grouped by element type. When adding a new wrapper or upstream import, drop its story title under one of:

- **3D & Devices** — 3d-card, iphone, macbook-scroll, terminal, …
- **Backgrounds** — aurora, beams, grid patterns, lamp, vortex, …
- **Buttons** — pulsating, rainbow, ripple, shimmer, stateful, …
- **Cards** — bento, magic-card, glare, hero-parallax, timeline, wobble, …
- **Code** — code-block, code-comparison
- **Data display** — animated-list, apple-cards-carousel, file-tree, file-upload
- **Globes & Maps** — globe, world-map, icon-cloud
- **Hover & Interactions** — animated-tooltip, glowing-effect, lens, pointer, spotlight, …
- **Inputs** — combobox, command-palette, gooey-input, vanish-input
- **Loaders & Progress** — number-ticker, scroll-progress, multi-step-loader, …
- **Marquees & Scroll** — infinite-moving-cards, parallax-scroll, scroll-velocity, …
- **Modals & Overlays** — animated-modal, hero-video-dialog, sticky-banner
- **Nav** — dock, floating-navbar, navbar-menu, resizable-navbar, sidebar-trigger
- **Particles & Effects** — confetti, dither-shader, meteors, particles, sparkles, webcam-pixel-grid, …
- **Social** — animated-testimonials, avatar-circles, tweet-card, tweet-not-found, …
- **Text** — aurora-text, layout-text-flip, sparkles-text, text-generate-effect, typewriter, …

## Logging

`logger.debug/info/warn/error` from `@/lib/logger` — never raw `console.*` in committed code (CI lint catches it).

## ESLint — jsx-a11y enumerated

`eslint.config.mjs` enumerates ~25 `jsx-a11y` rules as `error`. Catches `<img>` without `alt`, `onClick` on `<div>`, missing `<html lang>`, redundant ARIA roles, positive `tabIndex`, and so on.

## Git hooks

Husky pre-commit runs `pnpm lint-staged` (eslint + prettier on staged files). Pre-push runs `pnpm lint && pnpm tsc`. Bypass only in emergency (`--no-verify`).

## Known gotchas

- **Tailwind v4 CSS vars** — use `max-w-(--foo)` (the v4 arbitrary-value syntax). Don't revert to `max-w-[var(--foo)]`.
- **next-intl typed `t()`** — `AppConfig.Messages` is intentionally loose so config-driven `t(key)` compiles. Missing keys appear as runtime warnings.
- **Dynamic pathnames** — pass through the object form `{ pathname: "/blog/[slug]", params: { slug } }`.
- **LocaleSwitcher + dynamic routes** — swaps the locale segment in the URL directly so it works on `/blog/[slug]`.
- **Next 16 `proxy.ts`** — same API as the old `middleware.ts`, new name only.

## Verification — what CI runs

1. `pnpm tsc` — strict, no emit
2. `pnpm lint` — zero warnings
3. `pnpm format:check`
4. `pnpm verify:contrast`
5. `pnpm verify:pages`
6. `pnpm verify:styles` — drift-guard on `_component-styles.css`
7. `pnpm build` — prerenders every static route × locale

Treat warnings as errors. A clean tree is a shippable tree.
