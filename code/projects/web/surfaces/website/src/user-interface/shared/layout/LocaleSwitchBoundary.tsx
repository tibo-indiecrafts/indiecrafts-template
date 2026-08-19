"use client";

import type { ReactNode } from "react";
import { LocaleSwitchProvider } from "@indiecrafts/i18n";
import { resolveTranslatedPath } from "@/lib/i18n/resolve-translated-path";

/**
 * Client boundary that injects the app's content-route resolver into the shared
 * locale switcher, so `@indiecrafts/i18n` stays route-agnostic (foundation must not
 * know the blog routes). The server layout can't pass a function prop across the
 * RSC boundary, so this thin client wrapper imports the resolver itself.
 */
export function LocaleSwitchBoundary({ children }: { children: ReactNode }) {
  return (
    <LocaleSwitchProvider resolve={resolveTranslatedPath}>
      {children}
    </LocaleSwitchProvider>
  );
}
