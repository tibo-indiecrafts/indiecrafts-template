import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SignUpView } from "@indiecrafts/packages-web-auth/sign-up-view";

/**
 * Public sign-up. Clerk's themed `<SignUp>`, self-hosted so it can carry the active
 * `locale` in `unsafeMetadata` (→ `user_profiles.locale` via the webhook → localized
 * auth emails). Point Clerk here with `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`. 404s
 * when Clerk is unconfigured.
 */
export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  return (
    <main className="grid min-h-[70vh] place-items-center p-6">
      <SignUpView home="/" locale={locale} />
    </main>
  );
}
