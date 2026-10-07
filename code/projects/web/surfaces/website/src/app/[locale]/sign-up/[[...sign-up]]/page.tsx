/**
 * Renders the public Clerk sign-up page, carrying the active locale for localized emails.
 *
 * @see docs/reference/projects/web/website/src/app/locale/sign-up/sign-up/page.md
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignUpView } from "@indiecrafts/packages-web-auth/sign-up-view";
import type { Locale } from "@/config";
import { RequireClerk } from "@/user-interface/account/RequireClerk";

/** A form, not content: keep it out of search. Titled so the tab and the history read right. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "auth" });
  return { title: t("signUpTitle"), robots: { index: false, follow: false } };
}

/**
 * Public sign-up. Clerk's themed `<SignUp>`, self-hosted (not the Account Portal) so
 * it can carry the active `locale` in `unsafeMetadata` — the api webhook mirrors that
 * to `user_profiles.locale`, localizing the user's auth emails incl. the first
 * verification code. Clerk's links point here (`AppClerkProvider signUpPath`).
 * 404s when Clerk is unconfigured — no sign-up page without auth.
 */
export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  const t = await getTranslations("auth");
  return (
    <main id="main" tabIndex={-1} className="grid min-h-[70vh] place-items-center p-6">
      <RequireClerk>
        <SignUpView home="/" locale={locale} marketingLabel={t("marketingOptIn")} />
      </RequireClerk>
    </main>
  );
}
