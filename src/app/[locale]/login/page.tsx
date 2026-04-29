import { setRequestLocale } from "next-intl/server";
import loginPage from "./page.config";
import { buildMetadata } from "@/lib/metadata";
import { Login1, login1Defaults } from "@/components/pages-auth/login-1";
import type { Locale } from "@/config/locales.config";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: loginPage,
    templateSeo: login1Defaults.seo,
    locale,
  });
}

export default async function LoginRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Login1 />;
}
