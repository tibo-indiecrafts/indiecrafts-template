import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container } from "@/components/ui-primitives/grid-2-customers-one-container";
import { MainCustomers } from "./sections/main-customers";
import { Customers } from "./sections/customers";
import { CallToAction } from "./sections/call-to-action";
import { customers03Defaults, customers03Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/** Tailark Pro `grid-2-customers-one` faithful port. */
export function Landing({
  layout = customers03Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(customers03Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines. `pt-14`
          clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={customers03Defaults.sectionIds.hero} className="overflow-hidden">
          <div className="relative">
            <Container asGrid className="relative">
              <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-square">
                    <div data-grid-content />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-10 gap-px">
                <div aria-hidden className="hidden grid-rows-2 gap-px @4xl:grid">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i}>
                      <div data-grid-content />
                    </div>
                  ))}
                </div>

                <div className="col-span-full @4xl:col-span-8">
                  <div data-grid-content className="px-6 py-12 text-center">
                    <div className="relative mx-auto max-w-3xl text-center">
                      <h2 className="text-foreground text-5xl font-semibold text-balance sm:text-6xl">
                        {t("title")}
                      </h2>
                      <p className="text-muted-foreground mt-7 text-lg text-balance">
                        Tailark is trusted by over 100 companies to help them scale their
                        business and stay ahead of the competition.
                      </p>
                    </div>
                  </div>
                </div>

                <div aria-hidden className="hidden grid-rows-2 gap-px @4xl:grid">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i}>
                      <div data-grid-content />
                    </div>
                  ))}
                </div>
              </div>

              <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-square">
                    <div data-grid-content />
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>
        <MainCustomers />
        <Customers />
        <CallToAction />
      </div>
    </Layout>
  );
}
