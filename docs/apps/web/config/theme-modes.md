# Theme modes

Which color modes the site offers — and whether it's locked to one — is declared in
`themeConfig` (`@indiecrafts/config`, `code/packages/config/src/index.ts`). `@/lib/theme`
turns those flags into next-themes provider props and decides whether the toggle renders, so
the config can never be interpreted two different ways.

For the color **values** themselves (the oklch/hex tokens), see
[Brand setup](../setup/brand-setup.md); this page is about mode availability.

## The `themeConfig` object

```ts
export const themeConfig: {
  light: boolean;
  dark: boolean;
  system: boolean;
  forced: ThemeName | null;
} = {
  light: true,
  dark: true,
  system: true,
  forced: null,
};
```

| Field | Meaning |
| --- | --- |
| `light` | Offer the light theme. |
| `dark` | Offer the dark theme. |
| `system` | Offer a "System" (follow-OS) option — only when **both** themes are on. |
| `forced` | `"light"` or `"dark"` paints that theme site-wide and hides the toggle. `null` = normal. |

`ThemeName` is `"light" | "dark"`; `ThemeMode` adds `"system"` (`@indiecrafts/config` `./types`).

## Common setups

```ts
// Light + dark + system (default)
{ light: true,  dark: true,  system: true,  forced: null }

// Light only — toggle auto-hides
{ light: true,  dark: false, system: false, forced: null }

// Locked to dark — toggle hidden, dark painted everywhere
{ light: true,  dark: true,  system: true,  forced: "dark" }
```

`forced` wins over everything. Otherwise the toggle offers `light`/`dark` (whichever are on),
plus a "System" option when `system` is on **and** both themes exist. The toggle auto-hides
whenever only one option remains.

## How the flags resolve — `@/lib/theme`

`src/lib/theme.ts` is the single interpreter. It derives three exports the rest of the app
reads:

```ts
export const THEME_MODES: readonly ThemeMode[] = themeConfig.forced
  ? [themeConfig.forced]
  : [
      ...(themeConfig.light ? (["light"] as const) : []),
      ...(themeConfig.dark ? (["dark"] as const) : []),
      ...(themeConfig.system && themeConfig.light && themeConfig.dark
        ? (["system"] as const)
        : []),
    ];

/** Hide the toggle when a theme is forced or only one option is available. */
export const SHOW_THEME_TOGGLE = !themeConfig.forced && THEME_MODES.length > 1;

export const THEME_PROVIDER_PROPS = {
  attribute: "data-theme",
  themes: CONCRETE_THEMES.length ? [...CONCRETE_THEMES] : ["light"],
  enableSystem: ENABLE_SYSTEM,
  defaultTheme:
    themeConfig.forced ?? (ENABLE_SYSTEM ? "system" : (CONCRETE_THEMES[0] ?? "light")),
  forcedTheme: themeConfig.forced ?? undefined,
  disableTransitionOnChange: true,
} as const;
```

- **`THEME_MODES`** — the user-selectable options in menu order. The toggle renders one radio
  item per mode.
- **`SHOW_THEME_TOGGLE`** — whether the toggle appears at all.
- **`THEME_PROVIDER_PROPS`** — spread straight onto next-themes' `<ThemeProvider>`.
  `forcedTheme` is passed through, so `forced` locks the theme at the provider level, not just
  visually.

## Where they're consumed

`ThemeProvider` (`src/user-interface/shared/layout/ThemeProvider.tsx`) is a thin wrapper that
spreads `THEME_PROVIDER_PROPS`, mounted once high in `src/app/[locale]/layout.tsx`. The header
gates the toggle on `SHOW_THEME_TOGGLE` (`Header.tsx`). `ThemeToggle.tsx` maps each entry in
`THEME_MODES` to a labelled radio item (Sun / Moon / Monitor). It reads the mounted state via
`useSyncExternalStore` — never `useEffect` — to avoid a hydration flash, per the repo
convention.

## The two dark triggers

next-themes writes the chosen theme to the `data-theme` attribute on `<html>`
(`attribute: "data-theme"`). The design tokens live in `@indiecrafts/ui-tokens/globals.css`
(`code/packages/ui-tokens/src/globals.css`), which honours **two** triggers so a first-paint
visitor without JS still sees their OS preference:

```css
/* Tailwind v4: `dark:` utilities match on the attribute */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* OS preference — only when data-theme isn't forcing light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* dark tokens */
  }
}

/* Explicit user choice via next-themes */
:root[data-theme="dark"],
[data-theme="dark"] {
  /* dark tokens */
}
```

Together:

1. `html[data-theme="dark"]` — the user's explicit choice via the toggle.
2. `@media (prefers-color-scheme: dark)` — the OS preference, applied whenever `data-theme`
   isn't overriding to light.

The second `[data-theme="dark"]` selector (without `:root`) also lets a nested subtree opt
into the dark token set — e.g. an always-dark card on a light page. The root `<html>` sets an
inline `color-scheme: light dark` style and `suppressHydrationWarning` (in
`src/app/[locale]/layout.tsx`), which next-themes needs to swap the attribute before paint
without a mismatch warning.

## Recipes

**Force a single theme (no toggle):** set `forced: "dark"` (or `"light"`). `SHOW_THEME_TOGGLE`
becomes `false`, the toggle vanishes, and next-themes paints that theme everywhere via
`forcedTheme`.

**Light-only, no toggle:** `{ light: true, dark: false, system: false, forced: null }`.
`THEME_MODES` collapses to `["light"]`, so the toggle auto-hides.

**Hide the toggle but keep both themes reachable:** there's no separate flag — hiding the
toggle means either forcing a theme or leaving only one mode. `{ light: true, dark: true,
system: false, forced: null }` still shows the toggle (two options, no "System"). To follow
the OS silently, force nothing and rely on `prefers-color-scheme` while accepting the toggle
is present, or force the theme you want.

::: warning After changing the palette
Mode availability doesn't affect contrast, but any change to the color tokens does. Run
`pnpm verify:contrast` to confirm WCAG AA still holds on both the light and dark token sets.
:::
