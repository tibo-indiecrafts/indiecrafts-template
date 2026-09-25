/**
 * Renders the anonymous erasure-confirm page for an emailed token link.
 *
 * @see docs/reference/projects/web/website/src/app/locale/erasure/confirm/page.md
 */
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pages, isPageVisible, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import {
  ErasureConfirmForm,
  type ErasureConfirmCopy,
} from "@/user-interface/erasure/ErasureConfirmForm";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  // Canonicalize to /erasure/confirm — not the parent /erasure the `pages` entry names.
  return buildMetadata({
    page: pages.erasure,
    locale,
    pathname: localizedPathname("/erasure/confirm", locale),
  });
}

/**
 * Anonymous branded erasure-confirm route — a signed-out visitor opens the
 * emailed link and types their email to confirm. Copy resolved here from
 * `messages.legal.erasure.confirm.*`. Gated by `features.legal.erasure`
 * (same flag as `/erasure` — no separate `pages` entry). Posts straight to
 * the shared api's public `POST /v1/erasure/confirm`.
 */
export default async function ErasureConfirmPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);
  if (!isPageVisible(pages.erasure)) notFound();
  // Fail-safe: with no client api origin the form could only ever fail on
  // submit (a relative /v1/erasure/confirm 404s) — 404 the whole page instead.
  if (!process.env.NEXT_PUBLIC_API_URL) notFound();

  const t = await getTranslations({ locale, namespace: "legal.erasure.confirm" });
  const copy: ErasureConfirmCopy = {
    heading: t("heading"),
    body: t("body"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    submitButton: t("submitButton"),
    pending: t("pending"),
    success: t("success"),
    partial: t("partial"),
    mismatch: t("mismatch"),
    expired: t("expired"),
    error: t("error"),
  };

  return (
    <DefaultLayout>
      <ErasureConfirmForm copy={copy} token={token ?? ""} />
    </DefaultLayout>
  );
}
