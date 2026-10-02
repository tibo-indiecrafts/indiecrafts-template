/**
 * Render the self-service account route full-page.
 *
 * @see docs/reference/projects/web/app/src/app/locale/(app)/account/page.md
 */
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { features, type Locale } from "@/config";
import { AccountControl } from "@/user-interface/account/AccountControl";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type Props = { params: Promise<{ locale: Locale }> };

/**
 * Self-service account route — the unified account modal rendered full-page
 * (`<AccountControl variant="page">` → Clerk `<UserProfile>` with the Privacy & consent
 * + Your data tabs). The same experience opens from the sidebar avatar. Gated by
 * `features.deleteAccount`, by Clerk being configured, and by the client api origin
 * being set; the `(app)` layout redirects signed-out users to `/sign-in`.
 */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.deleteAccount) notFound();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  // Fail-safe: with no client api origin the controls could only ever fail on
  // submit (a relative `/v1/erasure/self` 404s) — 404 the whole page instead.
  if (!process.env.NEXT_PUBLIC_API_URL) notFound();

  const th = await getTranslations({ locale, namespace: "account" });

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={th("title")} description={th("description")} />
      {/* Clerk's <UserProfile> has a fixed max width — centre it in the content area. */}
      <div className="flex justify-center">
        <AccountControl variant="page" />
      </div>
    </div>
  );
}
