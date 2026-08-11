# Typography &amp; fonts

Fonts are wired through a single registry (`src/lib/fonts.ts`) that assigns three **roles** — display, body, mono — to registered fonts, and exposes them as CSS variables the whole app reads.

## Three roles, three CSS variables

The active pairing lives in `src/config/index.ts`:

```ts
export const fonts = {
  display: "satoshi", // headings → --font-display
  body: "geist", // body + UI → --font-sans
  mono: "geist-mono", // code / tabular → --font-mono
} as const satisfies FontRoles;
```

`FontRoles` and the allowed keys (`FontKey`) are defined in `src/config/types.ts`:

```ts
export type FontKey = "geist" | "geist-mono" | "satoshi";

export type FontRoles = {
  display: FontKey; // set equal to `body` for a single-face design
  body: FontKey;
  mono: FontKey;
};
```

The `satisfies FontRoles` check keeps `config.fonts` honest — a typo'd or unregistered key is a compile error.

## The registry (`@/lib/fonts`)

`next/font` requires **statically analyzable literal calls** — you can't do `google[name]()`. So every font is instantiated once in `src/lib/fonts.ts`, each with its own `--f-<key>` variable:

```ts
const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--f-geist" });
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

`src/app/globals.css` maps the role vars onto elements:

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

Headings fall back to `--font-sans` when `display` and `body` are the same key. The explicit element rule also wins inside `.prose` article bodies. Tailwind's `font-mono` utility resolves through `--font-mono` (registered in the `@theme inline` block).

## Prose (long-form body copy)

`@tailwindcss/typography` is enabled at the top of `globals.css` (`@plugin "@tailwindcss/typography"`). Blog article bodies opt in with:

```tsx
<div className="prose prose-neutral dark:prose-invert max-w-none">
```

See `src/features/blog/user-interface/renderers/Prose.tsx`. `dark:prose-invert` flips prose colors for dark mode; the heading rule above ensures prose headings still use the display face.

## Swapping a font

**Change the pairing only** (both fonts already registered): edit `config.fonts` — e.g. set `display: "geist"` for a single-face look. Nothing else to touch.

**Add a new font:**

1. Register it in `src/lib/fonts.ts` — a `Google(...)` or `localFont(...)` call with its own `--f-<key>` variable. Drop any `.woff2` files in `src/assets/fonts/`.
2. Add its key to `FontKey` in `src/config/types.ts`. The `satisfies` checks on `REGISTRY` and `config.fonts` keep everything in lockstep.
3. Point a role at it in `config.fonts`.

::: tip
`--font-display`, `--font-sans`, and `--font-mono` are the only font names anything else in the app should reference. Never hard-code a font family in a component.
:::

## Typeset preset (long-form prose)

For rendered markdown / articles the template ships shadcn's [**Typeset**](https://ui.shadcn.com/docs/typeset) preset — `src/app/typeset.css`, imported right after Tailwind in `globals.css`.

Wrap rendered content in the preset:

```tsx
<div className="typeset typeset-docs">{renderedMarkdown}</div>
```

- `typeset` enables the base styles; `typeset-docs` is the long-form rhythm preset.
- **One owner for the pairing, no duplication.** Typeset does **not** re-declare heading/body fonts. The pairing lives in `config.fonts` → `--font-display` / `--font-sans` / `--font-mono`, applied app-wide by the base `body` + `h1–h6` rules in `globals.css` — and those cascade into `.typeset`. So swapping `config.fonts` re-fonts Typeset automatically. It only sets `--font-mono` for code (the one role the base rules don't cover), and colors read the theme tokens (flips light/dark with no `dark:`).

::: info Typeset vs. `prose`
Typeset coexists with `@tailwindcss/typography` (`prose`), which the blog renderers still use. Reach for whichever a surface calls for; both inherit the same config-driven fonts and theme tokens. Typeset owns only the **rhythm** (sizes + spacing) — to regenerate a different scale, use the [Typeset builder](https://ui.shadcn.com/typeset); leave the fonts to the config.
:::
