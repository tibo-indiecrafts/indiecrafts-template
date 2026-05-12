import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { MainCustomers } from "./sections/main-customers";
import { Customers } from "./sections/customers";
import { WallOfLoveSection } from "./sections/wall-of-love";
import { CallToAction } from "./sections/call-to-action";
import { customers04Defaults, customers04Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/** Tailark Pro `libre-customers-one` faithful port. */
export function Landing({
  layout = customers04Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(customers04Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Extend the muted backdrop through MainCustomers so the hero
          and the feature-card grid share one continuous surface
          instead of jumping from `bg-muted/50` to the page bg. */}
      <div className="bg-muted/50">
        <section id={customers04Defaults.sectionIds.hero}>
          <div className="relative mx-auto max-w-5xl px-6 pt-32 text-center sm:pt-44">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-foreground text-5xl font-semibold text-balance sm:text-6xl lg:tracking-tight">
                {t("title")}
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-balance">
                Tailark is trusted by over 100 companies to help them scale their business
                and stay ahead of the competition.
              </p>
            </div>
          </div>
        </section>
        <MainCustomers />
      </div>
      <Customers />
      <WallOfLoveSection />
      <CallToAction />
    </Layout>
  );
}
