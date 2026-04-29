import { setRequestLocale } from "next-intl/server";
import signupPage from "./page.config";
import { buildMetadata } from "@/lib/metadata";
import { Signup1, signup1Defaults } from "@/components/pages-auth/signup-1";
import type { Locale } from "@/config/locales.config";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    page: signupPage,
    templateSeo: signup1Defaults.seo,
    locale,
  });
}

export default async function SignupRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Signup1 />;
}
