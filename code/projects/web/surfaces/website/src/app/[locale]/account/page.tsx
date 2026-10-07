/**
 * Render the self-service account page for a signed-in user.
 *
 * @see docs/reference/projects/web/website/src/app/locale/account/page.md
 */
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AccountControl } from "@/user-interface/account/AccountControl";
import { RequireClerk } from "@/user-interface/account/RequireClerk";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.account, locale });
}

/**
 * Self-service account route — the unified account modal rendered full-page
 * (`<AccountControl variant="page">` → Clerk `<UserProfile>` with the Privacy &
 * consent, Emails and Your data tabs). The same experience opens from the header avatar.
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

  return (
    <DefaultLayout>
      <PageSchemas page={pages.account} locale={locale} />
      {/* Clerk's <UserProfile> has a fixed max width — centre it in the page. */}
      <div className="flex justify-center px-(--gutter) py-8 md:py-12">
        <RequireClerk>
          <AccountControl variant="page" />
        </RequireClerk>
      </div>
    </DefaultLayout>
  );
}
