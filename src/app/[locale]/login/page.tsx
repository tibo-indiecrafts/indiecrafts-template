import { setRequestLocale } from "next-intl/server";
import loginPage from "./page.config";
import { buildMetadata } from "@/lib/metadata";
import { Login01, login01Defaults } from "@/components/pages-login/login-01";
import type { Locale } from "@/config/locales.config";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: loginPage,
    templateSeo: login01Defaults.seo,
    locale,
  });
}

export default async function LoginRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Login01 />;
}
