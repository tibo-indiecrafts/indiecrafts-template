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
 *
 * `nonce` is threaded separately (not part of `themeProviderProps`) so the
 * per-request CSP nonce reaches next-themes' raw inline anti-FOUC script —
 * otherwise the enforced CSP (`script-src 'nonce-X'`) blocks it.
 */
export function ThemeProvider({
  children,
  nonce,
  ...props
}: ThemeProviderProps & { nonce?: string }) {
  return (
    <NextThemesProvider nonce={nonce} {...props}>
      {children}
    </NextThemesProvider>
  );
}
