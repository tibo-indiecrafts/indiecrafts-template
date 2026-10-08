/**
 * Renders the per-locale root layout with providers, SEO, and consent chrome.
 *
 * @see docs/reference/projects/web/website/src/app/locale/layout.md
 */
import "@indiecrafts/packages-web-ui-tokens/globals.css";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies, draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { resolveConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import {
  consent,
  features,
  localeDir,
  localePrefix,
  seoDefaults,
  site,
  surface,
  theme,
  type Locale,
} from "@/config";
import { fontClassName, fontStyle } from "@/lib/fonts";
import { Toaster } from "@indiecrafts/packages-web-ui/web/sonner";
import { CookieBanner } from "@indiecrafts/packages-web-compliance/consent/CookieBanner";
import { GoogleAnalytics } from "@indiecrafts/packages-web-compliance/consent/GoogleAnalytics";
import { CookieConsentConfig } from "@/user-interface/account/CookieConsentConfig";
import { CookiePreferencesHost } from "@indiecrafts/packages-web-compliance/consent/CookiePreferencesHost";
import { LegalNotice } from "@indiecrafts/packages-web-compliance/reacceptance/LegalNotice";
import { routing } from "@/i18n/routing";
import {
  LazyClerkProvider,
  LazyMarketingNudgeMount,
  LazySessionLogger,
  LazySignedInLegalNotice,
} from "@/user-interface/account/LazyClerk";
import { shouldLoadClerk } from "@/lib/clerk-load";
import { ThemeProvider } from "@/user-interface/shared/layout/ThemeProvider";
import { preloadChrome } from "@/user-interface/shared/layout/DefaultLayout";
import { LocaleSwitchBoundary } from "@/user-interface/shared/layout/LocaleSwitchBoundary";
import { DraftModeBar } from "@/user-interface/shared/layout/DraftModeBar";
import { resolveThemeConfig, themeProviderProps } from "@/lib/theme";
import { JsonLdScript } from "@/lib/seo/jsonld";
import { buildSiteSchemas } from "@/lib/seo/jsonld-core";
import { buildGlobalSchemas } from "@/lib/seo/jsonld-factories";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { getVersionPrompt } from "@/lib/system-pages";
import { getCookieConsent } from "@indiecrafts/packages-web-compliance/sanity/cookies";
import { getLegalAcceptance } from "@indiecrafts/packages-web-compliance/sanity/legal";
import { LEGAL_ACK_COOKIE } from "@indiecrafts/packages-web-compliance/reacceptance/legal-store";
import { CONSENT_COOKIE } from "@indiecrafts/packages-web-compliance/consent/consent-cookie";
import { SanityLive } from "@indiecrafts/packages-web-sanity/live";
import { UpdatePrompt } from "@indiecrafts/packages-web-version/update-prompt";
import { buildInfo } from "@/lib/build-info";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Layout-level metadata — the site-wide defaults Next.js merges with each
 * page's `generateMetadata` output. Locale-aware SEO (description, verification)
 * reads from Sanity (`getSiteSeo` / `getSiteSettings`) — the sole source, no
 * config fallback; brand/structural defaults (title template, OG type) come
 * from `seoDefaults`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Site-wide defaults — Sanity only (no config fallback); undefined when unset,
  // so Next simply omits them.
  const [siteSeo, settings] = await Promise.all([getSiteSeo(locale), getSiteSettings()]);
  const siteDescription = siteSeo.description;
  const verification = settings.verification;
  // Site name from Sanity (title template, applicationName, OG siteName). Falls
  // back to the code default so `<title>` is never blank. Default title layers
  // the locale's Sanity tagline when present.
  const siteName = settings.siteName || DEFAULT_SITE_NAME;
  const defaultTitle = siteSeo.tagline ? `${siteName} — ${siteSeo.tagline}` : siteName;
  // Favicon + apple-touch icon from Sanity (`siteSettings.icon`). Omitted when
  // unset — no static fallback (Sanity is the sole source). Square crop.
  const iconUrl = settings.brand.icon
    ? `${settings.brand.icon}?w=180&h=180&fit=crop`
    : undefined;
  // Default OG card — the locale's Sanity `siteMeta.ogImage`. Omitted when unset
  // (no `/public` fallback, no convention route).
  const ogImages = siteSeo.ogImage
    ? [{ url: siteSeo.ogImage, width: 1200, height: 630 }]
    : undefined;
  // Site-wide robots toggle (`siteSettings.robots`) — layered over the default.
  const siteRobots = settings.robots;
  const robots =
    siteRobots.noindex || siteRobots.nofollow
      ? { index: !siteRobots.noindex, follow: !siteRobots.nofollow }
      : seoDefaults.robots;
  return {
    metadataBase: new URL(site.url),
    title: { default: defaultTitle, template: `%s · ${siteName}` },
    description: siteDescription,
    applicationName: siteName,
    openGraph: {
      type: seoDefaults.openGraph.type,
      siteName,
      images: ogImages,
      url: site.url,
      locale,
      title: defaultTitle,
      description: siteDescription,
    },
    twitter: {
      card: seoDefaults.twitter.card,
    },
    robots,
    icons: iconUrl ? { icon: iconUrl, apple: iconUrl } : undefined,
    verification: {
      google: verification.google || undefined,
      other: verification.bing ? { "msvalidate.01": verification.bing } : undefined,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Readonly<Props>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  preloadChrome(locale as Locale);

  const [messages, nudge, siteSeo, settings, cookieConsent, versionPrompt, legal] =
    await Promise.all([
      getMessages(),
      getTranslations("auth.nudge"),
      getSiteSeo(locale as Locale),
      getSiteSettings(),
      getCookieConsent(locale as Locale),
      getVersionPrompt(locale as Locale),
      getLegalAcceptance(locale as Locale, features.legal),
    ]);
  const siteDescription = siteSeo.description;
  const requestHeaders = await headers();
  // Geo-resolve the consent mode from the visitor's edge country (opt-in EU/UK · opt-out US ·
  // none elsewhere), overridable per country in config. Drives whether the banner blocks.
  const consentMode = resolveConsentMode(requestHeaders.get("cf-ipcountry"), consent);
  // Per-request CSP nonce, set by the proxy — threaded to the GA <Script> tags so
  // their inline code passes the strict nonce CSP (see `src/proxy.ts`).
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  // Global Privacy Control, read server-side from the `Sec-GPC: 1` request header — honoured
  // even before/without client JS. Unioned with the client-side `navigator` check inside
  // `CookieBanner` (either source denies); native surfaces have no equivalent (no browser).
  const gpcSignal = requestHeaders.get("sec-gpc") === "1";
  // Server-read the legal-acceptance cookie so the "policies updated" banner is
  // decided server-side (no flash) — shown only when the deposited version is stale.
  const jar = await cookies();
  const legalAck = jar.get(LEGAL_ACK_COOKIE)?.value;
  // Same for cookie consent: an undecided visitor gets the banner in the first HTML.
  const consentDecided = jar.get(CONSENT_COOKIE)?.value === cookieConsent.version;
  // Draft preview (opened from the Studio's "Aperçu" tool): click-to-edit overlays, plus
  // an exit bar when the editor browses the site outside the Studio.
  const tPreview =
    features.studio && (await draftMode()).isEnabled
      ? await getTranslations("common")
      : null;
  // Clerk mounts only for a signed-in visitor or on the sign-in / sign-up pages: everyone
  // else skips its bundle and CDN scripts (`shouldLoadClerk`, `LazyClerk`).
  const clerk = await shouldLoadClerk(requestHeaders.get("x-pathname"));
  // The two policy URLs woven into the re-acceptance banner message's [[…]] markers
  // (privacy, terms — the contract documents the update covers).
  const legalHrefs = ["/privacy-policy", "/terms"];

  const withClerk = (app: React.ReactNode) =>
    clerk ? (
      <LazyClerkProvider locale={locale} nonce={nonce} signUpPath="/sign-up">
        {app}
      </LazyClerkProvider>
    ) : (
      app
    );

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      className={`${fontClassName} antialiased`}
      style={{ colorScheme: "light dark", ...fontStyle }}
      suppressHydrationWarning
    >
      <head>
        {/* The logo preload is emitted by next/image itself — <LogoIcon> uses
            `priority`, which already produces a correctly-typed
            `<link rel="preload" as="image" type="image/svg+xml">`. Adding a
            second manual one here duplicates the hint: the browser consumes one
            for the <img> fetch and warns the other was "preloaded but not used". */}

        {/* Discoverability hint for the LLM index — gated on `features.llms.index`
            (the `/llms.txt` route it points at 404s when that flag is off).
            Locale-aware: default locale → `/llms.txt`, others → `/<locale>/llms.txt`. */}
        {features.llms.index ? (
          <link
            rel="alternate"
            type="text/plain"
            title="llms.txt"
            href={`${localePrefix(locale as Locale)}/llms.txt`}
          />
        ) : null}
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        {withClerk(
          <ThemeProvider
            nonce={nonce}
            {...themeProviderProps(resolveThemeConfig(settings.themeModes))}
          >
            <NextIntlClientProvider messages={messages} locale={locale}>
              <LocaleSwitchBoundary>
                {/* Google Analytics — ID + consent are edited in Sanity (`siteSettings.analytics`).
                    With consent required, nothing from Google loads until the visitor grants
                    analytics (basic consent mode); the choice is restored before the first hit. */}
                {settings.analytics.googleAnalyticsId ? (
                  <GoogleAnalytics
                    id={settings.analytics.googleAnalyticsId}
                    version={cookieConsent.version}
                    categories={cookieConsent.categories}
                    requireConsent={settings.analytics.requireCookieConsent === true}
                    nonce={nonce}
                  />
                ) : null}
                <CookieConsentConfig
                  value={{
                    categories: cookieConsent.categories,
                    version: cookieConsent.version,
                  }}
                >
                  {children}
                </CookieConsentConfig>
                {/* Inside the intl provider — CookieBanner is a client component that
                calls `useTranslations`, so it needs the context here. */}
                {settings.analytics.requireCookieConsent ? (
                  <CookieBanner
                    categories={cookieConsent.categories}
                    version={cookieConsent.version}
                    title={cookieConsent.banner.title}
                    body={cookieConsent.banner.body}
                    mode={consentMode}
                    gpcSignal={gpcSignal}
                    decided={consentDecided}
                  />
                ) : (
                  // `requireCookieConsent` is off, so `CookieBanner` (which also mounts
                  // the preferences dialog) isn't rendered. A visitor still needs a
                  // *working* manage-preferences entry point regardless of consent mode
                  // (the footer "Do Not Sell" link for opt-out, or `ManagePreferencesButton`
                  // on `/account` for any mode) — mount just the dialog + its
                  // `openPreferences()` listener, with no blocking banner.
                  <CookiePreferencesHost
                    categories={cookieConsent.categories}
                    version={cookieConsent.version}
                  />
                )}
                {/* "Policies updated — please Accept" banner. Copy edited per language
                in Sanity (`legalConsent`); version = the tracked legal pages'
                lastUpdated. Signed out: gated on the deposited cookie; no fallback. */}
                {legal.version && legal.message && legal.acceptLabel ? (
                  clerk ? (
                    // Signed-in visitors sync acceptance across surfaces (app · mobile)
                    // via the api Worker. Mounted even after a local accept (hidden,
                    // `acceptedHere`) so a lost server write is re-sent on the next load.
                    <LazySignedInLegalNotice
                      version={legal.version}
                      message={legal.message}
                      hrefs={legalHrefs}
                      acceptLabel={legal.acceptLabel}
                      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
                      acceptedHere={legalAck === legal.version}
                    />
                  ) : legalAck !== legal.version ? (
                    <LegalNotice
                      version={legal.version}
                      message={legal.message}
                      hrefs={legalHrefs}
                      acceptLabel={legal.acceptLabel}
                    />
                  ) : null
                ) : null}
                {/* "New version available" banner — copy is edited per language in
                Sanity (`siteMeta.<locale>.versionPrompt`), no fallback. Mounted
                only when fully configured; an unset banner is simply off. */}
                {versionPrompt.message &&
                versionPrompt.reload &&
                versionPrompt.dismiss ? (
                  <UpdatePrompt
                    current={buildInfo.commit}
                    message={versionPrompt.message}
                    reloadLabel={versionPrompt.reload}
                    dismissLabel={versionPrompt.dismiss}
                  />
                ) : null}
              </LocaleSwitchBoundary>
              {clerk ? (
                <>
                  <LazySessionLogger surface={surface} />
                  <LazyMarketingNudgeMount
                    apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
                    surface="website"
                    snoozeKey={`${site.prefix}.mkt-nudge-snooze`}
                    copy={{
                      title: nudge("title"),
                      yes: nudge("yes"),
                      no: nudge("no"),
                      dismiss: nudge("dismiss"),
                    }}
                  />
                </>
              ) : null}
              <Toaster position="top-center" />
            </NextIntlClientProvider>
          </ThemeProvider>,
        )}
        {features.structuredData && settings.showStructuredData !== false ? (
          <JsonLdScript
            data={buildSiteSchemas(
              settings,
              { description: siteDescription },
              buildGlobalSchemas(settings.globalSchemas),
            )}
          />
        ) : null}
        {features.blog ? <SanityLive /> : null}
        {tPreview ? (
          <>
            <VisualEditing />
            <DraftModeBar label={tPreview("preview")} exit={tPreview("exitPreview")} />
          </>
        ) : null}
        <style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
      </body>
    </html>
  );
}
