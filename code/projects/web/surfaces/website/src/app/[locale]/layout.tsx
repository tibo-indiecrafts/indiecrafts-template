import "@indiecrafts/packages-shared-ui-tokens/globals.css";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { resolveConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import {
  consent,
  features,
  localeDir,
  localePrefix,
  seoDefaults,
  site,
  theme,
  type Locale,
} from "@/config";
import { fontClassName, fontStyle } from "@/lib/fonts";
import { CookieBanner } from "@indiecrafts/packages-web-compliance/consent/CookieBanner";
import { CookiePreferencesHost } from "@indiecrafts/packages-web-compliance/consent/CookiePreferencesHost";
import { LegalNotice } from "@indiecrafts/packages-web-compliance/reacceptance/LegalNotice";
import { routing } from "@/i18n/routing";
import { SessionLogger } from "@indiecrafts/packages-web-auth";
import { ThemeProvider } from "@/user-interface/shared/layout/ThemeProvider";
import { LocaleSwitchBoundary } from "@/user-interface/shared/layout/LocaleSwitchBoundary";
import { resolveThemeConfig, themeProviderProps } from "@/lib/theme";
import { JsonLdScript } from "@/lib/seo/jsonld";
import { buildSiteSchemas } from "@/lib/seo/jsonld-core";
import { buildGlobalSchemas } from "@/lib/seo/jsonld-factories";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { getVersionPrompt } from "@/lib/system-pages";
import { getCookieConsent } from "@indiecrafts/packages-web-compliance/sanity/cookies";
import { getLegalAcceptance } from "@indiecrafts/packages-web-compliance/sanity/legal";
import { LEGAL_ACK_COOKIE } from "@indiecrafts/packages-web-compliance/reacceptance/legal-store";
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

  const messages = await getMessages();
  const [siteSeo, settings, cookieConsent, versionPrompt, legal] = await Promise.all([
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
  // Global Privacy Control, read server-side from the `Sec-GPC: 1` request header — honoured
  // even before/without client JS. Unioned with the client-side `navigator` check inside
  // `CookieBanner` (either source denies); native surfaces have no equivalent (no browser).
  const gpcSignal = requestHeaders.get("sec-gpc") === "1";
  // Server-read the legal-acceptance cookie so the "policies updated" banner is
  // decided server-side (no flash) — shown only when the deposited version is stale.
  const legalAck = (await cookies()).get(LEGAL_ACK_COOKIE)?.value;
  // Review link → the first flag-enabled tracked legal page (CGV is off by default).
  const legalReviewHref = features.legal.privacy
    ? "/privacy-policy"
    : features.legal.terms
      ? "/terms"
      : "/terms-of-sale";

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

        {/* Google Analytics — ID + consent are edited in Sanity
            (`siteSettings.analytics`). Injected only when an ID is set; the
            Consent-Mode `default: denied` preamble only when consent is required. */}
        {settings.analytics.googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.analytics.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${
  settings.analytics.requireCookieConsent
    ? `gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', functionality_storage: 'denied', personalization_storage: 'denied', wait_for_update: 500 });
`
    : ""
}gtag('js', new Date());
gtag('config', '${settings.analytics.googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <ThemeProvider {...themeProviderProps(resolveThemeConfig(settings.themeModes))}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <LocaleSwitchBoundary>
              {children}
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
                />
              ) : consentMode === "opt-out" ? (
                // `requireCookieConsent` is off, so `CookieBanner` (which also mounts
                // the preferences dialog) isn't rendered. A CCPA/opt-out visitor still
                // needs a *working* preferences dialog behind the footer "Do Not Sell"
                // link (`DefaultLayout.tsx`'s `showDoNotSell`) — mount just the dialog
                // + its `openPreferences()` listener, with no blocking banner.
                <CookiePreferencesHost
                  categories={cookieConsent.categories}
                  version={cookieConsent.version}
                />
              ) : null}
              {/* "Policies updated — please Accept" banner. Copy edited per language
                in Sanity (`legalConsent`); version = the tracked legal pages'
                lastUpdated. Server-gated on the deposited cookie; no fallback. */}
              {legal.version &&
              legal.message &&
              legal.reviewLabel &&
              legal.acceptLabel &&
              legalAck !== legal.version ? (
                <LegalNotice
                  version={legal.version}
                  message={legal.message}
                  reviewLabel={legal.reviewLabel}
                  reviewHref={legalReviewHref}
                  acceptLabel={legal.acceptLabel}
                />
              ) : null}
              {/* "New version available" banner — copy is edited per language in
                Sanity (`siteMeta.<locale>.versionPrompt`), no fallback. Mounted
                only when fully configured; an unset banner is simply off. */}
              {versionPrompt.message && versionPrompt.reload && versionPrompt.dismiss ? (
                <UpdatePrompt
                  current={buildInfo.commit}
                  message={versionPrompt.message}
                  reloadLabel={versionPrompt.reload}
                  dismissLabel={versionPrompt.dismiss}
                />
              ) : null}
            </LocaleSwitchBoundary>
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
              <SessionLogger surface="website" />
            ) : null}
          </NextIntlClientProvider>
        </ThemeProvider>
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
        <style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
      </body>
    </html>
  );
}
