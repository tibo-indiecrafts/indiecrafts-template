"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

type Props = Readonly<{ children: ReactNode }>;

/**
 * Wraps next-themes with sensible defaults:
 *   - `attribute="data-theme"` — readable, stylable via CSS attribute selectors
 *   - `defaultTheme="system"` — respect OS preference out of the box
 *   - `enableSystem` — user can still choose light/dark explicitly
 *   - `disableTransitionOnChange` — avoid animation flash when toggling
 *
 * Usage: mount once in the root locale layout, above any content.
 * The FOUC-free init script is injected by next-themes automatically.
 */
export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
