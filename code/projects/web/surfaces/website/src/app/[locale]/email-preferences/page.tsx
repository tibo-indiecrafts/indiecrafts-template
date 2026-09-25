/**
 * Renders the anonymous email-preference centre for an emailed token link.
 *
 * @see docs/reference/projects/web/website/src/app/locale/email-preferences/page.md
 */
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { EmailPreferencesPublic } from "@/user-interface/email-preferences/EmailPreferencesPublic";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.emailPreferences" });
  // An emailed, token-bearing account settings link — never index it.
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

/**
 * Anonymous branded email-preference centre — the emailed link a signed-out
 * recipient opens to manage their categories via an opaque `?token=`. Not in the
 * `pages` map — a utility callback, kept out of nav/sitemap/llms (mirrors
 * `newsletter/confirm`). Posts straight to the shared api's public
 * `GET/POST /v1/email-preferences`. Fail-safe: with no client api origin or no
 * token, the controls could only ever fail — 404 / show the invalid-link state
 * instead.
 */
export default async function EmailPreferencesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) notFound();

  const rawToken = (await searchParams).token;
  const token = (Array.isArray(rawToken) ? (rawToken[0] ?? "") : (rawToken ?? "")).trim();
  const t = await getTranslations("pages.emailPreferences");

  return (
    <DefaultLayout>
      <section
        aria-labelledby="email-preferences-heading"
        className="not-prose mx-auto my-8 max-w-xl px-(--gutter) md:my-12"
      >
        <div className="bg-card rounded-2xl border p-8 md:p-10">
          <h1
            id="email-preferences-heading"
            className="text-foreground font-sans text-xl font-semibold text-balance md:text-2xl"
          >
            {t("heading")}
          </h1>
          <p className="text-muted-foreground mt-2 text-pretty">{t("intro")}</p>

          <div className="mt-6">
            {token ? (
              <EmailPreferencesPublic
                apiUrl={apiUrl}
                token={token}
                chrome={{
                  noticesHeading: t("noticesHeading"),
                  loading: t("loading"),
                  error: t("error"),
                  retry: t("retry"),
                }}
              />
            ) : (
              <p role="alert" className="text-destructive text-sm">
                {t("invalidToken")}
              </p>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
