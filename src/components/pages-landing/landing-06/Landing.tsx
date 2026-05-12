import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Hero21Section } from "@/components/sections-hero/hero-21";
import { LogoCloud15Section } from "@/components/sections-logo-cloud/logo-cloud-15";
import { Features38Section } from "@/components/sections-features/features-38";
import { Features39Section } from "@/components/sections-features/features-39";
import { Testimonials06Section } from "@/components/sections-testimonials/testimonials-06";
import { HowItWorks09Section } from "@/components/sections-how-it-works/how-it-works-09";
import { Testimonials07Section } from "@/components/sections-testimonials/testimonials-07";
import { Cta06Section } from "@/components/sections-cta/cta-06";
import { hero21Sample } from "@/components/sections-hero/hero-21/config";
import { howItWorks09Sample } from "@/components/sections-how-it-works/how-it-works-09/config";
import { cta06Sample } from "@/components/sections-cta/cta-06/config";
import { landing06Defaults, landing06Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `libre-landing-two` faithful port. Eight sections in
 * upstream order. JSX preserved verbatim per section.
 */
export function Landing({
  layout = landing06Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(landing06Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Hero21Section {...hero21Sample} id={landing06Defaults.sectionIds.hero} />
      <LogoCloud15Section id={landing06Defaults.sectionIds.logoCloud} />
      <Features38Section id={landing06Defaults.sectionIds.analytics} />
      <Features39Section id={landing06Defaults.sectionIds.platform} />
      <Testimonials06Section id={landing06Defaults.sectionIds.testimonial} />
      <HowItWorks09Section
        {...howItWorks09Sample}
        id={landing06Defaults.sectionIds.howItWorks}
      />
      <Testimonials07Section id={landing06Defaults.sectionIds.testimonials} />
      <Cta06Section {...cta06Sample} id={landing06Defaults.sectionIds.cta} />
    </Layout>
  );
}
