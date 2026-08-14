import { pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { LegalPageView } from "@/user-interface/legal/LegalPageView";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.terms, locale });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  return <LegalPageView page={pages.terms} pageKey="cgu" locale={locale} />;
}
