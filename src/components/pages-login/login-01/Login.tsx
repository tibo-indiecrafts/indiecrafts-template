import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { LoginForm } from "@/components/ui-molecules/auth-form/login";
import { login01Defaults, login01Namespace } from "./config";

export type LoginProps = {
  layout?: LayoutName;

  header?: boolean | ReactNode;

  footer?: boolean | ReactNode;
};

export function Login({
  layout = login01Defaults.layout,
  header,
  footer,
}: LoginProps = {}) {
  const t = useTranslations(login01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}
