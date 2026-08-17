import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { LegalPageContent } from "@indiecrafts/compliance/pages/LegalPageContent";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.cookies, locale });
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.cookies)) notFound();
  return (
    <DefaultLayout>
      <PageSchemas page={pages.cookies} locale={locale} />
      <LegalPageContent pageKey="cookies" locale={locale} />
    </DefaultLayout>
  );
}
