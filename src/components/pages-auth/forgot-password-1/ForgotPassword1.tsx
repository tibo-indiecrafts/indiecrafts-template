import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { ForgotPasswordPage } from "@/components/sections-auth/ForgotPassword";
import { forgotPassword1Defaults, forgotPassword1Namespace } from "./config";

export type ForgotPassword1Props = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Auth forgot-password template — `FullBleedLayout` (no marketing chrome)
 * wrapping the `ForgotPassword` section.
 */
export function ForgotPassword1({
  layout = forgotPassword1Defaults.layout,
  header,
  footer,
}: ForgotPassword1Props = {}) {
  const t = useTranslations(forgotPassword1Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <ForgotPasswordPage />
    </Layout>
  );
}
