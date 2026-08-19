import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { DataRequestForm } from "@indiecrafts/ui-components/web/form/DataRequestForm";
import { DATA_REQUEST_TYPES } from "@indiecrafts/compliance/requests/request-types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.dataRequest, locale });
}

/**
 * Data-request route — thin shell. Renders the GDPR request form (from
 * `@indiecrafts/ui-components`) with copy resolved here from
 * `messages.legal.dataRequest.*`. Gated by `features.legal.dataRequest`
 * (`isPageVisible`); posts to `/api/data-request`. SEO copy is Sanity-only
 * (`siteMeta.<locale>.pageSeo.data-request`).
 */
export default async function DataRequestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isPageVisible(pages.dataRequest)) notFound();

  const t = await getTranslations({ locale, namespace: "legal.dataRequest" });
  const options = DATA_REQUEST_TYPES.map((value) => ({
    value,
    label: t(`types.${value}`),
  }));

  return (
    <DefaultLayout>
      <PageSchemas page={pages.dataRequest} locale={locale} />
      <DataRequestForm
        heading={t("heading")}
        body={t("body")}
        legend={t("legend")}
        options={options}
        emailLabel={t("emailLabel")}
        emailPlaceholder={t("emailPlaceholder")}
        messageLabel={t("messageLabel")}
        messagePlaceholder={t("messagePlaceholder")}
        consentText={t("consent")}
        submitLabel={t("submit")}
        successMessage={t("success")}
        errorMessage={t("error")}
        locale={locale}
      />
    </DefaultLayout>
  );
}
