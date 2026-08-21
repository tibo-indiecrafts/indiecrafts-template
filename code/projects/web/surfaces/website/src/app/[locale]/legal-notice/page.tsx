import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { LegalPageContent } from "@indiecrafts/packages-web-compliance/pages/LegalPageContent";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.legalNotice, locale });
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.legalNotice)) notFound();
  return (
    <DefaultLayout>
      <PageSchemas page={pages.legalNotice} locale={locale} />
      <LegalPageContent pageKey="mentions-legales" locale={locale} />
    </DefaultLayout>
  );
}
