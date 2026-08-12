import "@indiecrafts/ui-tokens/globals.css";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  features,
  localeDir,
  localePrefix,
  seoDefaults,
  site,
  theme,
  type Locale,
} from "@indiecrafts/config";
import { fontClassName, fontStyle } from "@/lib/fonts";
import { CookieBanner } from "@/user-interface/shared/layout/CookieBanner";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/user-interface/shared/layout/ThemeProvider";
import { JsonLdScript } from "@/lib/seo/jsonld";
import { buildSiteSchemas } from "@/lib/seo/jsonld-core";
import { buildGlobalSchemas } from "@/lib/seo/jsonld-factories";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { getCookieConsent } from "@/lib/cookies";
import { SanityLive } from "@indiecrafts/sanity/live";

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
  const [siteSeo, settings, cookieConsent] = await Promise.all([
    getSiteSeo(locale as Locale),
    getSiteSettings(),
    getCookieConsent(locale as Locale),
  ]);
  const siteDescription = siteSeo.description;

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
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            {/* Inside the intl provider — CookieBanner is a client component that
                calls `useTranslations`, so it needs the context here. */}
            {settings.analytics.requireCookieConsent ? (
              <CookieBanner
                categories={cookieConsent.categories}
                version={cookieConsent.version}
                title={cookieConsent.banner.title}
                body={cookieConsent.banner.body}
              />
            ) : null}
          </NextIntlClientProvider>
        </ThemeProvider>
        {features.structuredData ? (
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
