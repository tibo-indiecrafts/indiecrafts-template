import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { analytics, locales, seoDefaults, site, theme, type Locale } from "@/config";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/layouts/_shared/theme-provider";
import { buildSiteSchemas, JsonLdScript } from "@/lib/seo/jsonld";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Layout-level metadata — the site-wide defaults Next.js merges with each
 * page's `generateMetadata` output. All locale-aware fields read from
 * `messages/<locale>.json` so the fallback head is correctly localized
 * even if a route forgets to call `buildMetadata`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  let siteDescription: string = site.description;
  try {
    siteDescription = t("site.description");
  } catch {
    /* key missing — keep static fallback */
  }
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

  // Locale-aware site description for Organization + WebSite JSON-LD. Falls
  // back to the static config value when the message key is missing.
  const t = await getTranslations({ locale });
  let siteDescription: string = site.description;
  try {
    siteDescription = t("site.description");
  } catch {
    /* key missing — keep static fallback */
  }

  return (
    <html
      lang={locale}
      dir={locales.find((l) => l.code === locale)?.dir ?? "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ colorScheme: "light dark" }}
      suppressHydrationWarning
    >
      <head>
        {/* Typed preload — next/image with priority emits a preload too, but
            without the `type` for SVG (because it's marked unoptimized).
            Adding the explicit type lets browsers match this hint to the
            <img> request faster on mobile. */}
        <link rel="preload" as="image" href={site.logo} type="image/svg+xml" />

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
gtag('js', new Date());
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
        <JsonLdScript data={buildSiteSchemas({ description: siteDescription })} />
        <style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
      </body>
    </html>
  );
}
