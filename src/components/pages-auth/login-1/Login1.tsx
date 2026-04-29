import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { LoginForm } from "@/components/sections-auth/LoginForm";
import { login1Defaults, login1Namespace } from "./config";

export type Login1Props = {
  /** Override the wrapping layout. Defaults to `login1Defaults.layout`. */
  layout?: LayoutName;
  /** Forwarded to the layout's header slot. */
  header?: boolean | ReactNode;
  /** Forwarded to the layout's footer slot. */
  footer?: boolean | ReactNode;
};

/**
 * Auth login template — `FullBleedLayout` (no marketing chrome) wrapping
 * the `LoginForm` section in a centered card. Pass `header={true}` to show
 * the SiteHeader if your brand prefers nav during sign-in.
 */
export function Login1({
  layout = login1Defaults.layout,
  header,
  footer,
}: Login1Props = {}) {
  const t = useTranslations(login1Namespace);
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
