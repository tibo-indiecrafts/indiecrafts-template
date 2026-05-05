import { setRequestLocale } from "next-intl/server";
import forgotPasswordPage from "./page.config";
import { buildMetadata } from "@/lib/metadata";
import {
  ForgotPassword01,
  forgotPassword01Defaults,
} from "@/components/pages-forgot-password/forgot-password-01";
import type { Locale } from "@/config/locales.config";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: forgotPasswordPage,
    templateSeo: forgotPassword01Defaults.seo,
    locale,
  });
}

export default async function ForgotPasswordRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForgotPassword01 />;
}
