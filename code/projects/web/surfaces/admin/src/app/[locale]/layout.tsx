/**
 * Wrap each locale tree with the Clerk provider, intl, and theme script.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/layout.md
 */
import "@indiecrafts/packages-web-ui-tokens/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { localeDir, type Locale } from "@/config";
import { AppClerkProvider, SessionLogger } from "@indiecrafts/packages-web-auth";
import { routing } from "@/i18n/routing";
import { THEME_SCRIPT } from "@/user-interface/layout/theme-script";

/** Every page is titled "<page> · Admin"; a page without its own title is "Admin". */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: { default: t("title"), template: `%s · ${t("title")}` } };
}

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
    // suppressHydrationWarning: the inline THEME_SCRIPT sets `data-theme` on <html> before
    // hydration, so the server/client attributes differ by design (one level deep only).
    <AppClerkProvider locale={locale} nonce={nonce}>
      <html lang={locale} dir={localeDir(locale as Locale)} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions inject attributes on <body>
          (e.g. data-atm-installed) before React hydrates — a one-level-deep,
          client-only diff, not an app mismatch. */}
      <body suppressHydrationWarning>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <NextIntlClientProvider>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <SessionLogger surface="admin" />
          ) : null}
          {children}
        </NextIntlClientProvider>
      </body>
      </html>
    </AppClerkProvider>
  );
}
