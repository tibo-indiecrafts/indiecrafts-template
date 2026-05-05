import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALE_DIRECTIONS } from "@/config/locales.config";
import { seoConfig } from "@/config/seo.config";
import { siteConfig } from "@/config/site.config";
import { themeConfig } from "@/config/theme.config";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/layouts/_shared/theme-provider";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  composeGraph,
  JsonLdScript,
} from "@/lib/seo/jsonld";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: seoConfig.defaultTitle, template: seoConfig.titleTemplate },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: seoConfig.openGraph.type,
    siteName: seoConfig.openGraph.siteName,
    images: [...seoConfig.openGraph.images],
    url: siteConfig.url,
    title: seoConfig.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: seoConfig.twitter.card,
    creator: seoConfig.twitter.creator,
  },
  robots: seoConfig.robots,
  verification: {
    google: seoConfig.verification.google,
    other: seoConfig.verification.bing
      ? { "msvalidate.01": seoConfig.verification.bing }
      : undefined,
  },
};

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

  return (
    <html
      lang={locale}
      dir={LOCALE_DIRECTIONS[locale]}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ colorScheme: "light dark" }}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <JsonLdScript
          data={composeGraph([buildOrganizationSchema(), buildWebSiteSchema()])}
        />
        <style>{`:root{--max-container:${themeConfig.container.maxWidth};--gutter:${themeConfig.container.gutter};}`}</style>
      </body>
    </html>
  );
}
