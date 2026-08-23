import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { DeleteAccountCopy } from "@indiecrafts/packages-shared-compliance/web";
import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AccountDeletePanel } from "@/user-interface/account/AccountDeletePanel";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.account, locale });
}

/**
 * Self-service "Delete my account" route — thin shell. Renders the shared
 * `DeleteAccountSection` (from `@indiecrafts/packages-shared-compliance/web`) via the
 * `AccountDeletePanel` client wrapper, with copy resolved here from
 * `messages.account.delete.*`. Gated by `features.account.delete`
 * (`isPageVisible`) AND by Clerk being configured — no account page without
 * auth. Posts to the shared api's authenticated `POST /v1/erasure/self`.
 */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isPageVisible(pages.account)) notFound();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();

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
    <DefaultLayout>
      <PageSchemas page={pages.account} locale={locale} />
      <AccountDeletePanel copy={copy} />
    </DefaultLayout>
  );
}
