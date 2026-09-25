/**
 * Render the self-service account page for a signed-in user.
 *
 * @see docs/reference/projects/web/website/src/app/locale/account/page.md
 */
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AccountControl } from "@/user-interface/account/AccountControl";
import { EmailPreferencesMount } from "@/user-interface/account/EmailPreferencesMount";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.account, locale });
}

/**
 * Self-service account route — the unified account modal rendered full-page
 * (`<AccountControl variant="page">` → Clerk `<UserProfile>` with the Privacy &
 * consent + Your data tabs). The same experience opens from the header avatar.
 * Gated by `features.account.delete` (`isPageVisible`), Clerk being configured, a
 * client api origin, AND a signed-in user (signed out → home).
 */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isPageVisible(pages.account)) notFound();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  // Fail-safe: with no client api origin the controls could only ever fail on
  // submit (a relative `/v1/erasure/self` 404s) — 404 the whole page instead.
  if (!process.env.NEXT_PUBLIC_API_URL) notFound();
  // Account actions require a signed-in user. Signed out → home (sign in via the header).
  const { userId } = await auth();
  if (!userId) redirect({ href: "/", locale });

  const t = await getTranslations("account.emailPreferences");

  return (
    <DefaultLayout>
      <PageSchemas page={pages.account} locale={locale} />
      <AccountControl variant="page" />
      {/* The granular preference centre — additive to the modal's single
          "Commercial emails" toggle (see AccountControl → packages-web-auth's
          account-modal.tsx), which stays as-is: it lives in a shared package,
          and mounting this website-only component there would be a
          wrong-direction package→app dependency. */}
      <section
        aria-labelledby="email-preferences-heading"
        className="mx-auto my-8 max-w-xl px-(--gutter) md:my-12"
      >
        <h2
          id="email-preferences-heading"
          className="text-foreground font-sans text-xl font-semibold text-balance"
        >
          {t("heading")}
        </h2>
        <p className="text-muted-foreground mt-2 text-pretty">{t("intro")}</p>
        <div className="mt-6">
          <EmailPreferencesMount
            apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
            chrome={{
              noticesHeading: t("noticesHeading"),
              loading: t("loading"),
              error: t("error"),
              retry: t("retry"),
            }}
          />
        </div>
      </section>
    </DefaultLayout>
  );
}
