import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Pricing } from "./sections/pricing";
import { LogoCloud } from "./sections/logo-cloud";
import { Comparator } from "./sections/comparator";
import { FAQs } from "./sections/faqs";
import { pricingPage04Defaults, pricingPage04Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/** Tailark Pro `libre-pricing-one` faithful port. */
export function Landing({
  layout = pricingPage04Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(pricingPage04Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <section id={pricingPage04Defaults.sectionIds.hero} className="bg-background">
        <div className="relative mx-auto max-w-5xl px-6 pt-32 text-center sm:pt-44">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground text-5xl font-semibold text-balance sm:text-6xl lg:tracking-tight">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-balance">
              Choose the perfect plan for your needs and start optimizing your workflow
              today
            </p>
          </div>
        </div>
      </section>
      <Pricing />
      <LogoCloud verticalAligned />
      <Comparator />
      <FAQs />
    </Layout>
  );
}
