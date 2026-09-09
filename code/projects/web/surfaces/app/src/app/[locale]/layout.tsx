import "@indiecrafts/packages-shared-ui-tokens/globals.css";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { resolveConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import { Toaster } from "@indiecrafts/packages-web-ui/web/sonner";
import { OfflineBanner } from "@indiecrafts/packages-shared-system-pages/web";
import { consent, localeDir, type Locale } from "@/config";
import { SessionLogger } from "@indiecrafts/packages-web-auth";
import { routing } from "@/i18n/routing";
import { ShellOverlays } from "@/user-interface/ShellOverlays";
import { AnnouncementChrome } from "@/user-interface/AnnouncementChrome";
import { buildInfo } from "@/lib/build-info";
import { THEME_SCRIPT } from "@/user-interface/layout/theme-script";

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
  // Carries the per-request CSP nonce (set by src/proxy.ts) so the inline theme script runs
  // under the strict nonce CSP.
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const tOffline = await getTranslations("offline");

  return (
    // suppressHydrationWarning: the inline THEME_SCRIPT sets `data-theme` on <html> before
    // hydration, so the server/client attributes differ by design (one level deep only).
    <html lang={locale} dir={localeDir(locale as Locale)} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions inject attributes on <body>
          (e.g. data-atm-installed) before React hydrates — a one-level-deep,
          client-only diff, not an app mismatch. */}
      <body suppressHydrationWarning>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <NextIntlClientProvider>
          <OfflineBanner message={tOffline("banner")} />
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <>
              <SessionLogger surface="app" />
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
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
