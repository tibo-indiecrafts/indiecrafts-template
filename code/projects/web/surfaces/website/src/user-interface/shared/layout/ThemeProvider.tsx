"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * Thin client wrapper around next-themes. The provider props are resolved
 * server-side in the layout (`themeProviderProps(resolveThemeConfig(settings.themeModes))`)
 * and passed in — so the offered theme modes are Sanity-driven, and next-themes'
 * pre-paint blocking script (built from these props) still prevents a flash.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
