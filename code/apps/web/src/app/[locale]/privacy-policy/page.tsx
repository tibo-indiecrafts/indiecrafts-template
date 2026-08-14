import { pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { LegalPageView } from "@/user-interface/legal/LegalPageView";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.privacy, locale });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  return <LegalPageView page={pages.privacy} pageKey="confidentialite" locale={locale} />;
}
