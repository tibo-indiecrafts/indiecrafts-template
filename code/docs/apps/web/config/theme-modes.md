# Theme modes

Which color modes the site offers — and whether it's locked to one — is edited in **Sanity**:
**Paramètres du site → Affichage & thème → Modes de thème** (`siteSettings.themeModes`), so a client
changes it without a deploy. `themeConfig` (app-owned in `code/projects/web/surfaces/website/src/config/theme.ts`,
imported via `@/config`) is the **code default** used when the Sanity field is unset. `@/lib/theme`
(`resolveThemeConfig` → `themeModes` / `themeProviderProps` / `showThemeToggle`) resolves
Sanity-over-default, and the layout prop-feeds the client ThemeProvider/toggle (next-themes' pre-paint
script still prevents a flash).

The toggle offers **Light** and **Dark** only. There is **no "System" option** — instead the site
**auto-detects the OS theme on first load** (follows `prefers-color-scheme`) whenever both themes are
offered. "System" is the default behaviour, not a menu choice.

For the color **values** themselves (the oklch/hex tokens), see
[Brand setup](../setup/brand-setup.md); this page is about mode availability.

## The default (`themeConfig`)

```ts
export const themeConfig: {
  light: boolean;
  dark: boolean;
  forced: ThemeName | null;
} = {
  light: true,
  dark: true,
  forced: null,
};
```

| Field    | Meaning                                                                                  |
| -------- | ---------------------------------------------------------------------------------------- |
| `light`  | Offer the light theme.                                                                   |
| `dark`   | Offer the dark theme.                                                                    |
| `forced` | `"light"` or `"dark"` paints that theme site-wide and hides the toggle. `null` = normal. |

`ThemeName` is `"light" | "dark"`; `ThemeMode` is the same (`@indiecrafts/packages-shared-config` `./types`) — a
selectable mode is a concrete theme. OS auto-detect is not a mode.

## Common setups

```ts
// Light + dark (default) — toggle shows Light/Dark, first load follows the OS
{ light: true,  dark: true,  forced: null }

// Light only — toggle auto-hides (one option)
{ light: true,  dark: false, forced: null }

// Locked to dark — toggle hidden, dark painted everywhere, no auto-detect
{ light: true,  dark: true,  forced: "dark" }
```

`forced` wins over everything. Otherwise the toggle offers `light`/`dark` (whichever are on) and the
toggle auto-hides whenever only one option remains.

## How the flags resolve — `@/lib/theme`

`src/lib/theme.ts` is the single interpreter. It's a set of **functions of the resolved config** (the
layout resolves Sanity-over-default server-side and prop-feeds the client components):

```ts
/** User-selectable modes in menu order — concrete themes only (no "system"). */
export function themeModes(cfg: ThemeConfig): ThemeMode[] {
  if (cfg.forced) return [cfg.forced];
  const list: ThemeMode[] = [];
  if (cfg.light) list.push("light");
  if (cfg.dark) list.push("dark");
  return list;
}

export function themeProviderProps(cfg: ThemeConfig) {
  const concrete = themeModes(cfg);
  // OS auto-detect when both themes are offered and none is forced — this is what
  // makes next-themes follow `prefers-color-scheme` on first load. Not a menu option.
  const enableSystem = !cfg.forced && cfg.light && cfg.dark;
  return {
    attribute: "data-theme",
    themes: concrete.length ? [...concrete] : ["light"],
    enableSystem,
    defaultTheme:
      cfg.forced ?? (enableSystem ? "system" : (concrete[0] ?? "light")),
    forcedTheme: cfg.forced ?? undefined,
    disableTransitionOnChange: true,
  } as const;
}

/** Hide the toggle when a theme is forced or only one option is available. */
export function showThemeToggle(cfg: ThemeConfig): boolean {
  return !cfg.forced && themeModes(cfg).length > 1;
}
```

- **`themeModes(cfg)`** — the user-selectable options (Light/Dark). The toggle renders one radio item
  per mode; **"system" is never in this list**.
- **`themeProviderProps(cfg)`** — spread straight onto next-themes' `<ThemeProvider>`. `enableSystem`
  - `defaultTheme:"system"` keep OS auto-detect **decoupled from the menu**: on first load (no stored
    choice) next-themes resolves the OS theme; once the visitor picks Light or Dark, that's stored.
- **`showThemeToggle(cfg)`** — whether the toggle appears at all.

## Where they're consumed

`ThemeProvider` (`src/user-interface/shared/layout/ThemeProvider.tsx`) spreads `themeProviderProps(...)`,
mounted once high in `src/app/[locale]/layout.tsx`. The header gates the toggle on `showThemeToggle`
(`Header.tsx`). `ThemeToggle.tsx` maps each entry in `themeModes` to a labelled radio item (**Sun /
Moon** — no Monitor), and highlights the **OS-resolved** theme before an explicit pick
(`value={theme === "system" ? resolvedTheme : theme}`). It reads the mounted state via
`useSyncExternalStore` — never `useEffect` — to avoid a hydration flash, per the repo convention.

## The two dark triggers (how auto-detect works with no System option)

next-themes writes the resolved theme to the `data-theme` attribute on `<html>`
(`attribute: "data-theme"`). The design tokens (generated into
`@indiecrafts/packages-shared-ui-tokens/src/generated/tokens.css` from `tokens.json`) honour **two** triggers so a
first-paint visitor — even without JS — sees their OS preference:

```css
/* OS preference — applied whenever data-theme isn't forcing light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* dark tokens */
  }
}

/* Explicit user choice (next-themes) + any nested data-theme="dark" subtree */
:root[data-theme="dark"],
[data-theme="dark"] {
  /* dark tokens */
}
```

Together:

1. **First load, no choice** — `enableSystem` + `defaultTheme:"system"` make next-themes set
   `data-theme` to the OS-resolved value, and the `@media (prefers-color-scheme: dark)` rule covers the
   pre-JS frame. A dark-OS visitor lands in dark **without a System menu option**.
2. **Explicit choice** — picking Light writes `data-theme="light"` (the media rule is excluded by
   `:not([data-theme="light"])`); picking Dark writes `data-theme="dark"`.

The second `[data-theme="dark"]` selector (without `:root`) also lets a nested subtree opt into the
dark token set. The root `<html>` sets inline `color-scheme: light dark` + `suppressHydrationWarning`
(in `src/app/[locale]/layout.tsx`) so next-themes can swap the attribute before paint without a
mismatch warning.

## Recipes

**Follow the OS silently:** it's the **default** — `{ light: true, dark: true, forced: null }` already
auto-detects on first load; the toggle is present for an explicit override.

**Force a single theme (no toggle):** set `forced: "dark"` (or `"light"`). `showThemeToggle` becomes
`false`, the toggle vanishes, next-themes paints that theme everywhere via `forcedTheme`, and
auto-detect is off (a forced theme wins over the OS).

**Light-only, no toggle:** `{ light: true, dark: false, forced: null }` — `themeModes` collapses to
`["light"]`, so the toggle auto-hides and there's nothing to auto-detect.

::: warning After changing the palette
Mode availability doesn't affect contrast, but any change to the color tokens does. Run
`pnpm verify:contrast` to confirm WCAG AA still holds on both the light and dark token sets.
:::
