import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { ForgotPasswordPage } from "@/components/sections-auth/forgot-password";
import { forgotPassword01Defaults, forgotPassword01Namespace } from "./config";

export type ForgotPasswordProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function ForgotPassword({
  layout = forgotPassword01Defaults.layout,
  header,
  footer,
}: ForgotPasswordProps = {}) {
  const t = useTranslations(forgotPassword01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <ForgotPasswordPage />
    </Layout>
  );
}
