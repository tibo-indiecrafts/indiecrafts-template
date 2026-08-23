import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { DeleteAccountCopy } from "@indiecrafts/packages-shared-compliance/web";
import { features, type Locale } from "@/config";
import { AccountDeletePanel } from "@/user-interface/account/AccountDeletePanel";

type Props = { params: Promise<{ locale: Locale }> };

/**
 * Self-service "Delete my account" route — thin shell. Renders the shared
 * `DeleteAccountSection` (from `@indiecrafts/packages-shared-compliance/web`) via the
 * `AccountDeletePanel` client wrapper, with copy resolved here from
 * `messages.account.delete.*`. Gated by `features.deleteAccount`, by Clerk being
 * configured, and by the client api origin being set — no account page without auth,
 * and no control that could only ever fail on submit. Posts to the shared api's
 * authenticated `POST /v1/erasure/self`.
 */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.deleteAccount) notFound();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  // Fail-safe: with no client api origin the control could only ever fail on
  // submit (a relative `/v1/erasure/self` 404s) — 404 the whole page instead.
  if (!process.env.NEXT_PUBLIC_API_URL) notFound();

  const t = await getTranslations({ locale, namespace: "account.delete" });
  const copy: DeleteAccountCopy = {
    heading: t("heading"),
    body: t("body"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    confirmButton: t("confirmButton"),
    pending: t("pending"),
    success: t("success"),
    partial: t("partial"),
    error: t("error"),
    mismatch: t("mismatch"),
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 p-8">
      <AccountDeletePanel copy={copy} />
    </main>
  );
}
