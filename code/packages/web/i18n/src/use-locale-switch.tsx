"use client";

/**
 * Switches the URL locale, resolving a content route's counterpart when injected.
 *
 * @see docs/reference/packages/web/i18n/src/use-locale-switch.md
 */
import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "./index";

/**
 * Resolve a detail path's counterpart in another locale (content slugs differ per
 * language). Return the target path (or `"/"` for a homepage fallback), or `null`
 * to just re-prefix the current path. **Injected by the app** — the foundation shim
 * must not know a module's routes, so route knowledge + the resolver endpoint live
 * in the app (see `LocaleSwitchProvider`).
 */
export type TranslatedPathResolver = (
  pathname: string,
  from: string,
  to: string,
) => Promise<string | null>;

const ResolverContext = createContext<TranslatedPathResolver | undefined>(
  undefined,
);

/**
 * App-mounted provider that injects the content-route → translated-path resolver
 * into `useLocaleSwitch()`. Mount it once (client boundary) around the tree that
 * renders the locale switcher / suggestion banner. Without it, switching just
 * re-prefixes the current path.
 */
export function LocaleSwitchProvider({
  resolve,
  children,
}: {
  resolve: TranslatedPathResolver;
  children: ReactNode;
}) {
  return (
    <ResolverContext.Provider value={resolve}>
      {children}
    </ResolverContext.Provider>
  );
}

/**
 * Shared locale switcher — swaps the URL locale (next-intl re-prefixes as-needed).
 * When a resolver is available (an explicit arg, else the `LocaleSwitchProvider`
 * context), a content route whose slug differs per language navigates to the
 * resolved counterpart; otherwise the current path is just re-prefixed. Route
 * knowledge lives in the app, not this brick. Used by the app's `LocaleSwitcher` +
 * the `@indiecrafts/packages-web-locale-suggest` banner.
 */
export function useLocaleSwitch(resolve?: TranslatedPathResolver) {
  const router = useRouter();
  const pathname = usePathname(); // locale-stripped, e.g. "/blog/my-post"
  const current = useLocale();
  const ctx = useContext(ResolverContext);
  const resolver = resolve ?? ctx;

  return async function switchTo(next: string): Promise<void> {
    const target = resolver
      ? await resolver(pathname, current, next).catch(() => null)
      : null;
    router.replace(target ?? pathname, { locale: next as Locale });
  };
}
