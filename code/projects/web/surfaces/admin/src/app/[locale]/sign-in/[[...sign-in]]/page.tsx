/**
 * Render the admin sign-in route with non-admin and unconfigured fallbacks.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/sign-in/sign-in/page.md
 */
import { auth } from "@clerk/nextjs/server";
import { SignInView } from "@indiecrafts/packages-web-auth/sign-in-view";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NotAdminNotice } from "@/user-interface/NotAdminNotice";

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
      <main id="main" tabIndex={-1} className="grid min-h-dvh place-items-center p-6">
        <p className="text-muted-foreground">{t("authNotConfigured")}</p>
      </main>
    );
  }

  // Signed in but NOT an admin → Clerk's <SignIn> renders blank for a signed-in
  // user, leaving a non-admin stuck. Show a way out (sign out → back to the form).
  const { userId, sessionClaims } = await auth();
  if (userId && !isAdmin(sessionClaims)) {
    const t = await getTranslations("admin");
    return (
      <main id="main" tabIndex={-1} className="grid min-h-dvh place-items-center p-6">
        <NotAdminNotice message={t("notAdmin")} signOutLabel={t("signOut")} />
      </main>
    );
  }

  return (
    <main id="main" tabIndex={-1} className="grid min-h-dvh place-items-center p-6">
      <SignInView home="/" />
    </main>
  );
}
