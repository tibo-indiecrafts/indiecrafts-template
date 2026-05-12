import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container, Separator } from "@/components/ui-effects/grid-2-pricing-container";
import { Pricing } from "./sections/pricing";
import { Comparator } from "./sections/comparator";
import { FAQs } from "./sections/faqs";
import { LogoCloud } from "./sections/logo-cloud";
import { pricingPage03Defaults, pricingPage03Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = pricingPage03Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(pricingPage03Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out. `pt-14` clears the fixed `Header10`
          (h-14) so the hero isn't hidden behind the navbar. */}
      <div className="bg-foreground/10 pt-14">
        <section id={pricingPage03Defaults.sectionIds.hero} className="overflow-hidden">
          <div className="relative">
            <Container className="relative py-24">
              <div
                aria-hidden
                className="dither-xs pointer-events-none absolute inset-0 mask-y-from-75% mask-x-from-65% mask-x-to-95% opacity-25 max-lg:opacity-20 2xl:mx-auto 2xl:max-w-7xl"
              >
                <div className="size-full">
                  <Image
                    src="https://images.unsplash.com/photo-1676034833163-317f108e7a69?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="size-full -scale-x-100 object-cover brightness-75 contrast-35"
                    width={2224}
                    height={1589}
                  />
                </div>
              </div>

              <div className="relative mx-auto max-w-xl px-6 text-center">
                <h2 className="text-foreground text-5xl font-semibold text-balance sm:text-6xl lg:tracking-tight">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground mt-7 text-lg text-balance">
                  Choose the perfect plan for your needs and start optimizing your
                  workflow today
                </p>
              </div>
            </Container>
          </div>
        </section>
        <Pricing />
        <LogoCloud />
        <Separator />
        <Comparator />
        <FAQs />
      </div>
    </Layout>
  );
}
