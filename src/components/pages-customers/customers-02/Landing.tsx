import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { MainCustomers } from "./sections/main-customers";
import { Customers } from "./sections/customers";
import { customers02Defaults, customers02Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = customers02Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(customers02Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <section id={customers02Defaults.sectionIds.hero} className="bg-muted/50">
        <div className="relative mx-auto max-w-5xl px-6 pt-32 text-center sm:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-foreground text-5xl font-semibold text-balance sm:text-6xl lg:tracking-tight">
              Powering success for visionary companies
            </h2>
            <p className="text-muted-foreground mt-4 text-lg text-balance">
              From AI startups to global enterprises, Acme is trusted by over 100
              companies to help them scale their business and stay ahead of the
              competition.
            </p>
          </div>
        </div>
      </section>

      <MainCustomers />
      <Customers />
    </Layout>
  );
}
