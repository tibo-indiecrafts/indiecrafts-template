import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container } from "@/components/ui-effects/grid-2-pricing-two-container";
import { Pricing } from "./sections/pricing";
import { LogoCloud } from "./sections/logo-cloud";
import { FAQs } from "./sections/faqs";
import { pricingPage05Defaults, pricingPage05Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = pricingPage05Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(pricingPage05Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out. `pt-14` clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={pricingPage05Defaults.sectionIds.hero} className="overflow-hidden">
          <Container className="py-24">
            <div className="mx-auto max-w-xl px-6 text-center">
              <h2 className="text-foreground text-5xl font-semibold text-balance sm:text-6xl lg:tracking-tight">
                {t("title")}
              </h2>
              <p className="text-muted-foreground mt-7 text-lg text-balance">
                Everything you need to optimize your workflow in one affordable package
              </p>
            </div>
          </Container>
        </section>
        <Pricing />
        <LogoCloud />
        <FAQs />
      </div>
    </Layout>
  );
}
