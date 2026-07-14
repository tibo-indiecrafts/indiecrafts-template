import "../globals.css";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  analytics,
  features,
  localeDir,
  localePrefix,
  seoDefaults,
  site,
  theme,
  type Locale,
} from "@/config";
import { fontClassName, fontStyle } from "@/lib/fonts";
import { CookieBanner } from "@/user-interface/layout/CookieBanner";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/user-interface/layout/ThemeProvider";
import { JsonLdScript } from "@/lib/seo/jsonld";
import { buildSiteSchemas } from "@/lib/seo/jsonld-core";
import { SanityLive } from "@/sanity/live";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Layout-level metadata — the site-wide defaults Next.js merges with each
 * page's `generateMetadata` output. All locale-aware fields read from
 * `messages/<locale>.json` so the fallback head is correctly localized
 * even if a route forgets to call `buildMetadata`.
 */
/** Locale-aware site description. Falls back to the static config value. */
async function getSiteDescription(locale: Locale): Promise<string> {
  const t = await getTranslations({ locale });
  try {
    return t("site.description");
  } catch {
    return site.description;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteDescription = await getSiteDescription(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: seoDefaults.defaultTitle, template: seoDefaults.titleTemplate },
    description: siteDescription,
    applicationName: site.name,
    openGraph: {
      type: seoDefaults.openGraph.type,
      siteName: seoDefaults.openGraph.siteName,
      images: [...seoDefaults.openGraph.images],
      url: site.url,
      locale,
      title: seoDefaults.defaultTitle,
      description: siteDescription,
    },
    twitter: {
      card: seoDefaults.twitter.card,
    },
    robots: seoDefaults.robots,
    verification: {
      google: seoDefaults.verification.google || undefined,
      other: seoDefaults.verification.bing
        ? { "msvalidate.01": seoDefaults.verification.bing }
        : undefined,
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
  const siteDescription = await getSiteDescription(locale as Locale);

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

        {/* Google Analytics — only injected when an ID is configured. */}
        {analytics.googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${
  features.cookieBanner
    ? `gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
`
    : ""
}gtag('js', new Date());
gtag('config', '${analytics.googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        {features.structuredData ? (
          <JsonLdScript data={buildSiteSchemas({ description: siteDescription })} />
        ) : null}
        {features.cookieBanner ? <CookieBanner /> : null}
        {features.blog ? <SanityLive /> : null}
        <style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
      </body>
    </html>
  );
}
