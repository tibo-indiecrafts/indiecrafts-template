import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import homePage from "./page.config";
import { isPageVisible } from "@/config/features.config";
import type { Locale } from "@/config/locales.config";
import { buildMetadata } from "@/lib/metadata";
import { Landing1, landing1Defaults } from "@/components/pages-marketing/landing-1";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  // SEO defaults come from the template. To override per-route, add
  // fields to `seo: { ... }` in `./page.config.ts` — they win over
  // template defaults via the merge inside `buildMetadata`.
  return buildMetadata({
    page: homePage,
    templateSeo: landing1Defaults.seo,
    locale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(homePage)) notFound();
  setRequestLocale(locale);
  return <Landing1 />;
}
