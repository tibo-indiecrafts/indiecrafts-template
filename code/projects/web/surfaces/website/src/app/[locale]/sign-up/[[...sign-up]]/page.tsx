import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignUpView } from "@indiecrafts/packages-web-auth/sign-up-view";
import type { Locale } from "@/config";

/**
 * Public sign-up. Clerk's themed `<SignUp>`, self-hosted (not the Account Portal) so
 * it can carry the active `locale` in `unsafeMetadata` — the api webhook mirrors that
 * to `user_profiles.locale`, localizing the user's auth emails incl. the first
 * verification code. Point Clerk here with `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`.
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
      <SignUpView home="/" locale={locale} marketingLabel={t("marketingOptIn")} />
    </main>
  );
}
