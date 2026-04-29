import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { SignupForm } from "@/components/sections-auth/SignupForm";
import { signup1Defaults, signup1Namespace } from "./config";

export type Signup1Props = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Auth signup template — `FullBleedLayout` (no marketing chrome) wrapping
 * the `SignupForm` section. Centered card with side illustration. Pass
 * `header={true}` if your brand prefers nav during sign-up.
 */
export function Signup1({
  layout = signup1Defaults.layout,
  header,
  footer,
}: Signup1Props = {}) {
  const t = useTranslations(signup1Namespace);
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
