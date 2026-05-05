import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import aboutPage from "./page.config";
import { isPageVisible } from "@/config/features.config";
import type { Locale } from "@/config/locales.config";
import { buildMetadata } from "@/lib/metadata";
import { About01, about01Defaults } from "@/components/pages-about/about-01";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: aboutPage,
    templateSeo: about01Defaults.seo,
    locale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(aboutPage)) notFound();
  setRequestLocale(locale);
  return <About01 />;
}
