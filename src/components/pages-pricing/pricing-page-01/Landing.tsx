import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Pricing } from "./sections/pricing";
import { Comparator } from "./sections/comparator";
import { FAQs } from "./sections/faqs";
import { LogoCloud } from "./sections/logo-cloud";
import { pricingPage01Defaults, pricingPage01Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `dark-pricing-one` faithful port. Hero typography +
 * Pricing tiers + LogoCloud + Comparator + FAQs. Light + dark
 * theme compatible (no forced `data-theme="dark"` overrides).
 */
export function Landing({
  layout = pricingPage01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(pricingPage01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <section id={pricingPage01Defaults.sectionIds.hero} className="bg-background">
        <div className="pt-24 md:pt-32 lg:pt-48">
          <div className="mx-auto grid max-w-5xl items-end gap-4 px-6 text-center">
            <h2 className="text-5xl font-semibold text-balance lg:text-6xl">
              Simple{" "}
              <span className="from-foreground/50 to-foreground/95 bg-linear-to-b bg-clip-text text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
                Pricing
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-lg text-lg text-balance lg:text-xl">
              Choose the perfect plan for your needs and start optimizing your workflow
              today
            </p>
          </div>
        </div>
      </section>
      <Pricing />
      <LogoCloud />
      <Comparator />
      <FAQs />
    </Layout>
  );
}
