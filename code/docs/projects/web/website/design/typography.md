---
title: "Typography & fonts"
description: "Fonts are wired through a single registry (src/lib/fonts.ts) that assigns three roles — display, body, mono — to registered fonts, and exposes them as CSS va…"
status: stable
---

# Typography & fonts

Fonts are wired through a single registry (`src/lib/fonts.ts`) that assigns three
**roles** — display, body, mono — to registered fonts, and exposes them as CSS
variables the whole app reads.

## Three roles, three CSS variables

The active pairing lives in `@indiecrafts/packages-shared-config`:

```ts
export const fonts = {
  display: "satoshi", // headings → --font-display
  body: "geist", // body + UI → --font-sans
  mono: "geist-mono", // code / tabular → --font-mono
} as const satisfies FontRoles;
```

`FontRoles` and the allowed keys (`FontKey`) are defined in the config package
(`code/packages/shared/config/src/types.ts`) and re-exported from `@indiecrafts/packages-shared-config`:

```ts
export type FontKey = "geist" | "geist-mono" | "satoshi";

export type FontRoles = {
  display: FontKey; // set equal to `body` for a single-face design
  body: FontKey;
  mono: FontKey;
};
```

The `satisfies FontRoles` check keeps `fonts` honest — a typo'd or unregistered key
is a compile error.

## The registry (`src/lib/fonts.ts`)

`next/font` requires **statically-analyzable literal calls** — you can't do
`google[name]()`. So every font is instantiated once, each with its own `--f-<key>`
variable:

```ts
import { fonts, type FontKey } from "@/config"; // fonts app-owned; FontKey re-exported from @indiecrafts/packages-shared-config

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--f-geist",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--f-geist-mono",
});

const satoshi = localFont({
  src: [
    {
      path: "../assets/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--f-satoshi",
});

const REGISTRY = { geist, "geist-mono": geistMono, satoshi } satisfies Record<
  FontKey,
  { variable: string }
>;
```

- **Google fonts** (Geist, Geist Mono) are auto-subset, self-hosted, and preloaded by Next.
- **Local fonts** (Satoshi) are self-hosted from `src/assets/fonts/` — the two `.woff2` files are build-imported by `localFont(...)`. (URL-served fonts would go in `/public`; these are imported, so they belong under `src/assets/`.)
- All use `display: "swap"` with Next's size-adjusted fallback.

The registry then derives two exports:

- `fontClassName` — the `.variable` classes for the fonts **actually in use** (deduped), placed on `<html>`. These define the `--f-*` vars.
- `fontStyle` — inline `<html>` style pointing each role var at its chosen font's `--f-*` var:

```ts
"--font-display": "var(--f-satoshi)",
"--font-sans":    "var(--f-geist)",
"--font-mono":    "var(--f-geist-mono)",
```

Both are applied in `src/app/[locale]/layout.tsx` on the `<html>` element:

```tsx
<html className={`${fontClassName} antialiased`} style={{ colorScheme: "light dark", ...fontStyle }}>
```

## How the roles reach the page

`globals.css` (in `@indiecrafts/packages-web-ui-tokens`) maps the role vars onto elements inside
`@layer base` — so a Tailwind `font-sans` / `font-display` utility can still
override per element:

```css
body {
  font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family:
    var(--font-display, var(--font-sans)), ui-sans-serif, system-ui, sans-serif;
}
```

Headings fall back to `--font-sans` when `display` and `body` are the same key. The
base element rules also cascade into `.prose` / `.typeset` article bodies (the
typography plugin sets no heading font). Tailwind's `font-mono` utility resolves
through `--font-mono` (registered in the `@theme inline` block).

## Title highlights (`RichTitle`)

Any title can colour a word in the brand accent by wrapping it in `[[ ]]`:

```jsonc
// messages/en.json
"title": "Built to [[cover]] your needs"   // → "cover" renders in text-brand
```

Render the title through `RichTitle` (`@indiecrafts/packages-web-ui-components/web/RichTitle`)
instead of a raw `<hN>`:

```tsx
import { RichTitle } from "@indiecrafts/packages-web-ui-components/web/RichTitle";

<RichTitle as="h2" className="text-4xl font-semibold text-balance">
  {t("title")}
</RichTitle>;
```

- **The reusable title primitive** — use it for app section titles (`messages/`) **and** Sanity
  titles (an editor types `[[…]]` in the string field). One `[[word]]` parser serves both; it is
  **i18n-agnostic** (the marker lives inside each already-localised string).
- **`className` is the class-customisation surface** — `RichTitle` owns no type scale; pass the
  element's Tailwind classes per call site (`cn`-merged, last wins). `as` picks the element
  (`h1`–`h4`, `p`, `span`).
- **Brand only** — the highlight is always `text-brand` (theme-aware; flips in dark mode via the
  token). No palette, no per-span colour — see [`DESIGN.md`](../../../../code/packages/web/ui-tokens/DESIGN.md) § Colors.
- **Safe to adopt anywhere** — a marker-free string renders as one plain segment, so wrapping an
  existing title changes nothing until someone adds `[[…]]`.

## Prose (long-form body copy)

`@tailwindcss/typography` is enabled at the top of `globals.css`
(`@plugin "@tailwindcss/typography"`). Blog article bodies opt in with:

```tsx
<div className="prose prose-neutral dark:prose-invert max-w-none">
```

See `code/modules/web/blog/src/user-interface/renderers/Prose.tsx`. `dark:prose-invert`
flips prose colors for dark mode; the heading rule above ensures prose headings
still use the display face.

## Swapping a font

**Change the pairing only** (both fonts already registered): edit `fonts` in
`@indiecrafts/packages-shared-config` — e.g. set `display: "geist"` for a single-face look. Nothing
else to touch.

**Add a new font:**

1. Register it in `src/lib/fonts.ts` — a `Google(...)` or `localFont(...)` call with its own `--f-<key>` variable. Drop any `.woff2` files in `src/assets/fonts/`.
2. Add its key to `FontKey` in `code/packages/shared/config/src/types.ts`. The `satisfies` checks on `REGISTRY` and `fonts` keep everything in lockstep.
3. Point a role at it in `fonts`.

::: tip
`--font-display`, `--font-sans`, and `--font-mono` are the only font names anything
else in the app should reference. Never hard-code a font family in a component.
:::

## Typeset preset (long-form prose)

For rendered markdown / articles the template also ships shadcn's
[**Typeset**](https://ui.shadcn.com/docs/typeset) preset — `typeset.css` in
`@indiecrafts/packages-web-ui-tokens`, imported right after Tailwind in `globals.css`
(`@import "./typeset.css"`).

Wrap rendered content in the preset:

```tsx
<div className="typeset typeset-docs">{renderedMarkdown}</div>
```

- `typeset` enables the base styles; `typeset-docs` is the long-form rhythm preset.
- **One owner for the pairing, no duplication.** Typeset does **not** re-declare heading/body fonts — the pairing lives in `fonts` → `--font-display` / `--font-sans` / `--font-mono`, applied app-wide by the base `body` + `h1–h6` rules in `globals.css`, which cascade into `.typeset`. So swapping `fonts` re-fonts Typeset automatically. It only sets `--font-mono` for code (the one role the base rules don't cover), and colors read the theme tokens (flip light/dark with no `dark:`).

::: info Typeset vs. `prose`
Typeset coexists with `@tailwindcss/typography` (`prose`), which the blog renderers
still use. Reach for whichever a surface calls for; both inherit the same
config-driven fonts and theme tokens. Typeset owns only the **rhythm** (sizes +
spacing) — to regenerate a different scale, use the
[Typeset builder](https://ui.shadcn.com/typeset); leave the fonts to the config.
:::
