import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SignInView } from "@indiecrafts/packages-web-auth/sign-in-view";
import type { Locale } from "@/config";

/**
 * Public sign-in. Clerk's themed `<SignIn>` with the post-sign-in fallback = home;
 * a `redirect_url` query returns the user to where they were bounced from. Login is
 * optional on the website (no gate). When Clerk is unconfigured (auth off) the route
 * 404s — no sign-in page without auth.
 */
export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  return (
    <main id="main" tabIndex={-1} className="grid min-h-[70vh] place-items-center p-6">
      <SignInView home="/" />
    </main>
  );
}
