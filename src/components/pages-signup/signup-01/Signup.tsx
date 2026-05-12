import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { SignupForm } from "@/components/ui-molecules/form/signup";
import { signup01Defaults, signup01Namespace } from "./config";

export type SignupProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Signup({
  layout = signup01Defaults.layout,
  header,
  footer,
}: SignupProps = {}) {
  const t = useTranslations(signup01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignupForm />
        </div>
      </div>
    </Layout>
  );
}
