/**
 * Renders the anonymous account-erasure request page.
 *
 * @see docs/reference/projects/web/website/src/app/locale/erasure/page.md
 */
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import {
  ErasureRequestForm,
  type ErasureRequestCopy,
} from "@/user-interface/erasure/ErasureRequestForm";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.erasure, locale });
}

/**
 * Anonymous branded erasure-request route — thin shell. Renders
 * `ErasureRequestForm` with copy resolved here from
 * `messages.legal.erasure.request.*`. Gated by `features.legal.erasure`
 * (`isPageVisible`) — no Clerk gate, this flow is anonymous. Posts straight
 * to the shared api's public `POST /v1/erasure/request`.
 */
export default async function ErasurePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isPageVisible(pages.erasure)) notFound();
  // Fail-safe: with no client api origin the form could only ever fail on
  // submit (a relative /v1/erasure/request 404s) — 404 the whole page instead.
  if (!process.env.NEXT_PUBLIC_API_URL) notFound();

  const t = await getTranslations({ locale, namespace: "legal.erasure.request" });
  const copy: ErasureRequestCopy = {
    heading: t("heading"),
    body: t("body"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    submitButton: t("submitButton"),
    pending: t("pending"),
    sent: t("sent"),
    turnstile: t("turnstile"),
    error: t("error"),
  };

  return (
    <DefaultLayout>
      <PageSchemas page={pages.erasure} locale={locale} />
      <ErasureRequestForm copy={copy} />
    </DefaultLayout>
  );
}
