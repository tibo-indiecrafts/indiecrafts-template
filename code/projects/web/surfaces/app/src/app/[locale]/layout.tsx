import "@indiecrafts/packages-shared-ui-tokens/globals.css";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { resolveConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import { consent, localeDir, type Locale } from "@/config";
import { SessionLogger } from "@indiecrafts/packages-web-auth";
import { routing } from "@/i18n/routing";
import { ShellOverlays } from "@/user-interface/ShellOverlays";
import { AnnouncementChrome } from "@/user-interface/AnnouncementChrome";
import { buildInfo } from "@/lib/build-info";

/** Prerender one tree per locale (`as-needed` → `/`, `/fr`). */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Enables static rendering for this locale (server components using translations).
  setRequestLocale(locale);

  const requestHeaders = await headers();
  // Geo-resolve the consent mode from the visitor's edge country (opt-in EU/UK · opt-out US ·
  // none elsewhere), overridable per country in config.
  const consentMode = resolveConsentMode(
    requestHeaders.get("cf-ipcountry"),
    consent,
  );
  // Global Privacy Control, read server-side from the `Sec-GPC: 1` request header — honoured
  // even before/without client JS. Unioned with the client-side `navigator` check inside
  // `ConsentGate` (either source denies); native surfaces have no equivalent (no browser).
  const gpcSignal = requestHeaders.get("sec-gpc") === "1";

  return (
    <html lang={locale} dir={localeDir(locale as Locale)}>
      <body>
        <NextIntlClientProvider>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <>
              <SessionLogger surface="app" locale={locale} />
              {/* Logged-in-only announcement banner + toast (from the api Worker). */}
              <AnnouncementChrome />
            </>
          ) : null}
          {children}
          {/* Compliance + version overlays (consent, legal re-acceptance, update prompt). */}
          <ShellOverlays
            commit={buildInfo.commit}
            mode={consentMode}
            gpcSignal={gpcSignal}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
