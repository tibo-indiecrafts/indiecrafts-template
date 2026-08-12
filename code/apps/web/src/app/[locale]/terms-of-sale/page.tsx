import { pages, type Locale } from "@indiecrafts/config";
import { buildMetadata } from "@/lib/metadata";
import { LegalPageView } from "@/user-interface/legal/LegalPageView";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.termsOfSale, locale });
}

export default async function TermsOfSalePage({ params }: Props) {
  const { locale } = await params;
  return <LegalPageView page={pages.termsOfSale} pageKey="cgv" locale={locale} />;
}
