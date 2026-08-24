import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type {
  DeleteAccountCopy,
  ExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import { features, pages, isPageVisible, type Locale } from "@/config";
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
 * Self-service account-actions route — thin shell. Renders the shared
 * `DeleteAccountSection` + `ExportSection` (from
 * `@indiecrafts/packages-shared-compliance/web`) via the `AccountDeletePanel` client
 * wrapper, with copy resolved here from `messages.account.{delete,export}.*`. Gated by
 * `features.account.delete` (`isPageVisible`) AND by Clerk being configured — no
 * account page without auth. `ExportSection` renders only when `features.account.export`
 * is also on. Posts to the shared api's authenticated `POST /v1/erasure/self` +
 * `POST /v1/export`.
 */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isPageVisible(pages.account)) notFound();
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

  const et = await getTranslations({ locale, namespace: "account.export" });
  const exportCopy: ExportCopy = {
    heading: et("heading"),
    body: et("body"),
    button: et("button"),
    pending: et("pending"),
    success: et("success"),
    error: et("error"),
  };

  return (
    <DefaultLayout>
      <PageSchemas page={pages.account} locale={locale} />
      <AccountDeletePanel
        copy={copy}
        exportCopy={exportCopy}
        showExport={features.account.export}
      />
    </DefaultLayout>
  );
}
