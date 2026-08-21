import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SignInView } from "@indiecrafts/packages-web-auth/sign-in-view";

/**
 * Public sign-in. Clerk's themed `<SignIn>` with the post-sign-in fallback = home; a
 * `redirect_url` query returns the user to where they were. When Clerk is unconfigured
 * the route 404s — no sign-in page without auth.
 */
export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  return (
    <main className="grid min-h-[70vh] place-items-center p-6">
      <SignInView home="/" />
    </main>
  );
}
