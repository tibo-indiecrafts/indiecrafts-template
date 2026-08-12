/**
 * Theme resolution — turns the declarative `themeConfig` flags in `@indiecrafts/config`
 * into the concrete values next-themes needs, plus a single flag for whether
 * the toggle should render. ThemeProvider, ThemeToggle, and Header all read
 * from here so the config can never be interpreted two different ways.
 *
 * See `themeConfig` in `@indiecrafts/config` for the flag semantics.
 */
import { themeConfig } from "@indiecrafts/config";
import type { ThemeMode, ThemeName } from "@indiecrafts/config";

/**
 * User-selectable theme options, in menu order. When `forced` is set it's the
 * only entry; "system" is offered only when both concrete themes exist.
 */
export const THEME_MODES: readonly ThemeMode[] = themeConfig.forced
  ? [themeConfig.forced]
  : [
      ...(themeConfig.light ? (["light"] as const) : []),
      ...(themeConfig.dark ? (["dark"] as const) : []),
      ...(themeConfig.system && themeConfig.light && themeConfig.dark
        ? (["system"] as const)
        : []),
    ];

/** Concrete (paintable) themes — next-themes' `themes` list excludes "system". */
const CONCRETE_THEMES = THEME_MODES.filter((m): m is ThemeName => m !== "system");

const ENABLE_SYSTEM = THEME_MODES.includes("system");

/** Hide the toggle when a theme is forced or only one option is available. */
export const SHOW_THEME_TOGGLE = !themeConfig.forced && THEME_MODES.length > 1;

/** Props for the next-themes `<ThemeProvider>`, derived from `themeConfig`. */
export const THEME_PROVIDER_PROPS = {
  attribute: "data-theme",
  themes: CONCRETE_THEMES.length ? [...CONCRETE_THEMES] : ["light"],
  enableSystem: ENABLE_SYSTEM,
  defaultTheme:
    themeConfig.forced ?? (ENABLE_SYSTEM ? "system" : (CONCRETE_THEMES[0] ?? "light")),
  forcedTheme: themeConfig.forced ?? undefined,
  disableTransitionOnChange: true,
} as const;
