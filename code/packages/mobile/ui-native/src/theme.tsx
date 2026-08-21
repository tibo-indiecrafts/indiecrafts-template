/**
 * The native theme runtime — the same design tokens as web, resolved to hex for
 * React Native. `ThemeProvider` follows the OS light/dark (`useColorScheme`) unless
 * a `name` is forced; `useTheme`/`useColor` read the resolved palette from
 * `@indiecrafts/packages-shared-ui-tokens/native` (generated from `tokens.json`).
 *
 * This is the StyleSheet transport. NativeWind (`className`) is the drop-in upgrade:
 * feed `ui-tokens/nativewind.css` to the RN Tailwind preset — the token names match.
 */
import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import {
  tokens,
  type ThemeName,
  type ColorToken,
} from "@indiecrafts/packages-shared-ui-tokens/native";

export type { ThemeName, ColorToken };
// Either theme — same shape, different literal hex values, so the union (not just
// `light`) is what a resolved theme can be.
export type Theme = (typeof tokens)[ThemeName];

const ThemeContext = createContext<{ name: ThemeName; theme: Theme } | null>(
  null,
);

/** Provides the resolved theme. Follows the OS scheme unless `name` forces one. */
export function ThemeProvider({
  name,
  children,
}: {
  name?: ThemeName;
  children: ReactNode;
}) {
  const system = useColorScheme();
  const resolved: ThemeName = name ?? (system === "dark" ? "dark" : "light");
  return (
    <ThemeContext.Provider value={{ name: resolved, theme: tokens[resolved] }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** The resolved theme + its name. Throws outside a `ThemeProvider`. */
export function useTheme(): { name: ThemeName; theme: Theme } {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/** One token colour for the active theme, e.g. `useColor("brand")`. */
export function useColor(token: ColorToken): string {
  return useTheme().theme.color[token];
}
