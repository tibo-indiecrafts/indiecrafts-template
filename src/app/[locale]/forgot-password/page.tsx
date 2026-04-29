import { setRequestLocale } from "next-intl/server";
import forgotPasswordPage from "./page.config";
import { buildMetadata } from "@/lib/metadata";
import { ForgotPassword1, forgotPassword1Defaults } from "@/components/pages-auth/forgot-password-1";
import type { Locale } from "@/config/locales.config";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: forgotPasswordPage,
    templateSeo: forgotPassword1Defaults.seo,
    locale,
  });
}

export default async function ForgotPasswordRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForgotPassword1 />;
}
