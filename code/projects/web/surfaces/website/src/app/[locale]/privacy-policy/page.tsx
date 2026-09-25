/**
 * Renders the localized privacy-policy page from Sanity content.
 *
 * @see docs/reference/projects/web/website/src/app/locale/privacy-policy/page.md
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
  return buildMetadata({ page: pages.privacy, locale });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.privacy)) notFound();
  return (
    <DefaultLayout>
      <PageSchemas page={pages.privacy} locale={locale} />
      <LegalPageContent pageKey="confidentialite" locale={locale} />
    </DefaultLayout>
  );
}
