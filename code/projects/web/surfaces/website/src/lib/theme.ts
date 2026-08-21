/**
 * Theme resolution — turns a `ThemeConfig` (which color modes the site offers)
 * into the concrete values next-themes needs, plus whether the toggle should
 * render. The effective config is **Sanity `siteSettings.themeModes` over the
 * `themeConfig` code default** (`resolveThemeConfig`), so a client can change the
 * offered modes without a deploy. These are now **functions of a runtime config**
 * (was module-constants) — the layout resolves it server-side and prop-feeds the
 * client ThemeProvider / Header / ThemeToggle (they can't await Sanity).
 */
import { site, themeConfig } from "@/config";
import type { ThemeMode, ThemeName } from "@/config";
import type { SiteSettings } from "@/lib/seo/site-seo";

/** The resolved theme availability — the code default's shape. */
export type ThemeConfig = {
  light: boolean;
  dark: boolean;
  forced: ThemeName | null;
};

/** Sanity `themeModes` (if set) over the `themeConfig` code default. Unset → the default. */
export function resolveThemeConfig(modes: SiteSettings["themeModes"]): ThemeConfig {
  if (!modes) return themeConfig;
  const forced =
    modes.forced === "light" || modes.forced === "dark" ? modes.forced : null;
  return {
    light: modes.light ?? true,
    dark: modes.dark ?? true,
    forced,
  };
}

/** User-selectable modes in menu order. `forced` → only that. (OS auto-detect is the default behaviour, not a mode.) */
export function themeModes(cfg: ThemeConfig): ThemeMode[] {
  if (cfg.forced) return [cfg.forced];
  const list: ThemeMode[] = [];
  if (cfg.light) list.push("light");
  if (cfg.dark) list.push("dark");
  return list;
}

/** Hide the toggle when a theme is forced or only one option is available. */
export function showThemeToggle(cfg: ThemeConfig): boolean {
  return !cfg.forced && themeModes(cfg).length > 1;
}

/** Props for the next-themes `<ThemeProvider>`, derived from a resolved config. */
export function themeProviderProps(cfg: ThemeConfig) {
  const concrete = themeModes(cfg);
  // OS auto-detect (follow `prefers-color-scheme` on first load) whenever both
  // concrete themes are offered and none is forced — "System" is the default
  // behaviour, not a menu option, so it stays on even though the menu drops it.
  const enableSystem = !cfg.forced && cfg.light && cfg.dark;
  return {
    attribute: "data-theme" as const,
    // Namespaced by `site.prefix` so two instances on a shared origin don't share
    // the stored theme choice (next-themes' default key is the bare "theme").
    storageKey: `${site.prefix}-theme`,
    themes: concrete.length ? [...concrete] : ["light"],
    enableSystem,
    defaultTheme: cfg.forced ?? (enableSystem ? "system" : (concrete[0] ?? "light")),
    forcedTheme: cfg.forced ?? undefined,
    disableTransitionOnChange: true,
  };
}
