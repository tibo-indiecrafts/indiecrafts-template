import "@indiecrafts/packages-shared-ui-tokens/globals.css";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { localeDir, type Locale } from "@/config";
import { SessionLogger } from "@indiecrafts/packages-web-auth";
import { routing } from "@/i18n/routing";
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
  // Set by src/proxy.ts on every matched request — carries the per-request CSP nonce so
  // this inline script is allowed to run under the strict nonce CSP.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={locale} dir={localeDir(locale as Locale)}>
      <body>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <NextIntlClientProvider>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <SessionLogger surface="admin" />
          ) : null}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
