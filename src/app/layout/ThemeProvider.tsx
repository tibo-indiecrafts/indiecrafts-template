"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { THEME_PROVIDER_PROPS } from "@/lib/theme";

type Props = Readonly<{ children: ReactNode }>;

export function ThemeProvider({ children }: Props) {
  return <NextThemesProvider {...THEME_PROVIDER_PROPS}>{children}</NextThemesProvider>;
}
