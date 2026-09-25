/**
 * Renders the localized terms-of-use (CGU) page from Sanity content.
 *
 * @see docs/reference/projects/web/website/src/app/locale/terms/page.md
 */
import { pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { LegalPageContent } from "@indiecrafts/packages-web-compliance/pages/LegalPageContent";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.terms, locale });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.terms)) notFound();
  return (
    <DefaultLayout>
      <PageSchemas page={pages.terms} locale={locale} />
      <LegalPageContent pageKey="cgu" locale={locale} />
    </DefaultLayout>
  );
}
