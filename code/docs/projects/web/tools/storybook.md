---
title: "@indiecrafts/web-tools-storybook"
description: "Live, browsable documentation for the design system — every @indiecrafts/packages-web-ui primitive, every @indiecrafts/packages-web-ui-components block rende…"
status: stable
---

# @indiecrafts/web-tools-storybook

Live, browsable documentation for the design system — every `@indiecrafts/packages-web-ui` primitive, every
`@indiecrafts/packages-web-ui-components` block renderer, the `@indiecrafts/packages-web-announcement` + `@indiecrafts/packages-web-locale-suggest`
component stories, and the `@indiecrafts/packages-shared-ui-tokens` token system, in one Storybook. Flip **light / dark**
from the toolbar to see everything invert together.

> Lives at **`code/projects/web/tools/storybook`** (a deployable static-site project, not a shared brick).
> It stories the design-system bricks by resolving them by package name, so it's location-independent.

|               |                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Run**       | `pnpm --filter @indiecrafts/web-tools-storybook storybook` (dev, <http://localhost:6006>) · `… storybook:build` (static → `storybook-static/`)                                                                            |
| **Framework** | `@storybook/nextjs-vite` — renders `next/image`, `next/font`, and async React Server Components (`experimentalRSC`)                                                                                                       |
| **Deps**      | `storybook`, `@storybook/nextjs-vite`, `@storybook/addon-docs`, `@storybook/addon-themes`, `@storybook/addon-a11y`, `@storybook/addon-vitest`, `@tailwindcss/vite` + the workspace `@indiecrafts/*` packages it documents |
| **Consumers** | none — it's a leaf docs app                                                                                                                                                                                               |

## How it's organized

- **Stories are colocated** — `button.stories.tsx` sits beside `button.tsx` in `@indiecrafts/packages-web-ui`,
  `Callout.stories.tsx` beside `Callout.tsx` in `@indiecrafts/packages-web-ui-components`. This package only
  aggregates them (`.storybook/main.ts` globs into the siblings). Docs never drift from source.
- **Every story surfaces its `.md`** — each story imports its colocated usage doc as raw markdown
  (`import docs from "./button.md?raw"`) and sets it as the autodocs description, so the full
  written doc renders on the component's **Docs** tab. `@indiecrafts/packages-web-ui` primitives already shipped
  a `.md` each; the `@indiecrafts/packages-web-ui-components` renderers now carry a colocated `.md` too.
- **Concept docs** are MDX pages under `stories/`: the token references (Colors, Sidebar & Charts,
  Typography & Radius) painting live `var(--token)` swatches so the theme toolbar flips them, plus
  **Adaptive & container queries** — a drag-to-resize demo showing a container query change columns
  on the element's own width (the doctrine's live counterpart to `docs/.../adaptive-responsive.md`).
- **Adding a component ⇒ adding its story**, same change (see the block workflow + the
  component-architecture rule in the dev framework).

## Config notes

- **Theme** — `@storybook/addon-themes` `withThemeByDataAttribute` sets `data-theme` on `<html>`,
  exactly what the token system keys on, so one toolbar switch drives colors, sidebar palette,
  shiki, and typeset.
- **Tailwind v4** — `@tailwindcss/vite` compiles `.storybook/preview.css`, which imports
  `@indiecrafts/packages-shared-ui-tokens/globals.css` (Tailwind entry + `@source` scan paths).
- **next-intl mock** — two renderers read translations (`GalleryCarousel` client, `QuoteList`
  server). `.storybook/main.ts` aliases `next-intl` + `next-intl/server` to
  `.storybook/next-intl-mock.tsx` (a static message map) — no real i18n request or provider needed.

Full source: [`code/projects/web/tools/storybook/`](../../code/projects/web/tools/storybook/).
