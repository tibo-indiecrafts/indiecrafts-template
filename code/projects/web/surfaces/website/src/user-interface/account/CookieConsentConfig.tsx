"use client";

/**
 * Shares the Sanity cookie-consent categories + version with the account widget.
 *
 * @see docs/reference/projects/web/website/src/user-interface/account/CookieConsentConfig.md
 */
import { createContext, useContext, type ReactNode } from "react";
import type { ConsentCategory } from "@indiecrafts/packages-shared-compliance/shared";

type Config = { categories: ConsentCategory[]; version: string };

const Ctx = createContext<Config | null>(null);

/** Set once in `[locale]/layout.tsx` from `getCookieConsent` — the same values the banner
 *  gets — so the account widget's Privacy tab shows the banner's categories and saves the
 *  banner's version (a different version would make the banner ask again). */
export function CookieConsentConfig({
  value,
  children,
}: {
  value: Config;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The banner's categories + version, or null outside the provider. */
export const useCookieConsentConfig = () => useContext(Ctx);
