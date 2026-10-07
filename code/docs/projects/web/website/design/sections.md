---
title: "Marketing sections"
description: "Sections are the reusable marketing blocks a home (or landing) page is built from: Features, Pricing, Testimonials, Cta, Faq, FeaturedArticles."
status: stable
---

# Marketing sections

Sections are the reusable marketing blocks a home (or landing) page is built from:
`Features`, `Pricing`, `Testimonials`, `Cta`, `Faq`, `FeaturedArticles`. They live in
`src/user-interface/homepage/sections/` and import via the
`@/user-interface/homepage/sections/*` alias. UI primitives come from the
`@indiecrafts/packages-web-ui` package (e.g. `@indiecrafts/packages-web-ui/web/card`).

## Where sections come from

The app has **zero runtime imports** from the sibling Storybook library (the
the component-library repo). That repo is a browse-only catalogue. To add a section:

1. Open Storybook in the library (`pnpm storybook` in the sibling repo).
2. Copy the variant's component into `src/user-interface/homepage/sections/<Name>.tsx`. If upstream ships a multi-file folder (`schema.ts` + `config.ts` + `en.json`), **flatten it into one `.tsx`** — `Features.tsx` is the target shape.
3. Drop the section's copy into `messages/<locale>.json` under `pages.<id>.blocks.<name>` (drop any `-NN` variant suffix from the upstream key).
4. Mount it in the route's `page.tsx`.

::: warning
Never add the library as a dependency, workspace, or symlink. The decoupling is the
design — you re-copy a file by hand when the library improves it, then re-run
`pnpm verify:quick`.
:::

## Anatomy of a section

`Features.tsx` is the canonical shape. Two things define it.

**A typed props contract** describing the block and its items — no copy, just
structure and an i18n `namespace`:

```ts
export type FeaturesBlock = {
  type: "features";
  id: string;
  /** i18n namespace, e.g. "pages.home.blocks.features". */
  namespace: string;
  items: readonly FeatureItem[];
};
```

**A `useTranslations(namespace)` read** — the component pulls every visible string
relative to the namespace it was handed. It never inlines copy:

```tsx
const t = useTranslations(props.namespace);
// t("title"), t("body"), t(`items.${item.id}.title`), …
```

So a section carries **structure** (how many cards, which icon, in what order) as
props, and **content** (the actual words) in `messages`. Structure is decided at the
mount site; content is edited per locale.

## Wiring content

Content lives under `pages.<id>.blocks.<name>` in each `messages/<locale>.json`. For
the home Features block:

```jsonc
"pages": {
  "home": {
    "blocks": {
      "features": {
        "title": "Built to cover your needs",
        "body": "Extensive customization, full control…",
        "items": {
          "customizable": { "title": "Customizable", "body": "…" },
          "fullControl":  { "title": "You have full control", "body": "…" },
          "poweredByAi":  { "title": "Powered by AI", "body": "…" }
        }
      }
    }
  }
}
```

The item **keys** (`customizable`, `fullControl`, …) must match the `id`s passed at
the mount site. Add the same block under every locale file — the same section on two
pages is just duplicated copy under each page id (cheap, and each page stays
independent).

## Mounting in a route

`src/app/[locale]/(home)/page.tsx` is the live pattern. Most sections take a single
`namespace` prop plus structural props:

```tsx
import { Features } from "@/user-interface/homepage/sections/Features";

<Features
  type="features"
  id="home-features"
  namespace="pages.home.blocks.features"
  items={[
    { id: "customizable", iconKey: "zap" },
    { id: "fullControl", iconKey: "settings" },
    { id: "poweredByAi", iconKey: "sparkles" },
  ]}
/>;
```

- `id` seeds the section's DOM ids (`home-features-title`) — keep it unique per page.
- `namespace` points at the `messages` subtree. (A few sections resolve copy differently: `Faq` takes `pageId="home"`, and `FeaturedArticles` takes already-resolved string props from the route — see [Featured articles](/projects/web/website/design/featured-articles).)
- Remaining props (`items`, `tiers`, `quotes`, …) are the structure. Icons are chosen by key from a small in-component `ICONS` map, so a client never wires an icon component through config.

Don't need a section on a given page? Delete its mount from `page.tsx` — the import
and its message keys can both go.

## Section conventions

Every section follows the same accessibility and layout rules, so copied blocks stay
consistent:

- **Landmark + label.** The outer element is `<section aria-labelledby="{id}-title">`, and the heading carries the matching `id={`${id}-title`}` — giving each block an accessible name from its own heading.
- **Heading level.** Sections open at `<h2>` (card titles inside step down to `<h3>`). The page's single `<h1>` is the route's own — on the home page it's visually hidden (`sr-only`).
- **Gutter + width.** Horizontal padding is `px-(--gutter)` (the `--gutter` CSS var, injected from `theme.container.gutter`), with an inner `max-w-*` wrapper. Never hard-code page margins.
- **Decorative icons** are `aria-hidden="true"` unless the icon is the only label.
- **Motion** respects `prefers-reduced-motion` via `motion-reduce:*` utilities.

See also: [Typography](/projects/web/website/design/typography), [Icons](/projects/web/website/design/icons), [Featured articles](/projects/web/website/design/featured-articles).
