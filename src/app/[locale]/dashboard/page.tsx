import { setRequestLocale } from "next-intl/server";
import dashboardPage from "./page.config";
import type { Locale } from "@/config/locales.config";
import { buildMetadata } from "@/lib/metadata";
import { Dashboard1, dashboard1Defaults } from "@/components/pages-app/dashboard-1";

import data from "./data.json";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: dashboardPage,
    templateSeo: dashboard1Defaults.seo,
    locale,
  });
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Dashboard1 rows={data} />;
}
