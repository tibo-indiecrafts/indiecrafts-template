import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { MainCustomers } from "./sections/main-customers";
import { Customers } from "./sections/customers";
import { WallOfLoveSection } from "./sections/wall-of-love";
import { CallToAction } from "./sections/call-to-action";
import { customers01Defaults, customers01Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = customers01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(customers01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <section id={customers01Defaults.sectionIds.hero} className="bg-background">
        <div className="bg-background relative z-10 pt-24 md:pt-32 lg:pt-48">
          <div className="mx-auto grid max-w-5xl items-end gap-4 px-6 text-center">
            <h2 className="text-5xl font-semibold text-balance lg:text-6xl">
              Meet our{" "}
              <span className="from-foreground/50 to-foreground/95 bg-linear-to-b bg-clip-text text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
                Customers
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-lg text-lg text-balance lg:text-xl">
              Acme is trusted by over 100 companies to help them scale their business and
              stay ahead of the competition.
            </p>
          </div>
        </div>
      </section>

      <MainCustomers />
      <Customers />
      <WallOfLoveSection />
      <CallToAction />
    </Layout>
  );
}
