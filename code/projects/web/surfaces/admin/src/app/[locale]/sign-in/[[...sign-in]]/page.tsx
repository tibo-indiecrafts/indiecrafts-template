import { SignInView } from "@indiecrafts/packages-web-auth/sign-in-view";
import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Admin sign-in — Clerk's hosted <SignIn> (localized by Clerk, themed from the
 * design tokens via the provider). The one public route on the admin surface; the
 * proxy redirects every other route here until an `admin` session exists. Admin is
 * sign-in only — no open sign-up.
 */
export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Clerk not configured (scaffold): render a note instead of the (throwing) widget.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const t = await getTranslations("admin");
    return (
      <main
        id="main"
        tabIndex={-1}
        className="grid min-h-dvh place-items-center p-6"
      >
        <p className="text-muted-foreground">{t("authNotConfigured")}</p>
      </main>
    );
  }

  return (
    <main id="main" tabIndex={-1} className="grid min-h-dvh place-items-center p-6">
      <SignInView home="/" />
    </main>
  );
}
