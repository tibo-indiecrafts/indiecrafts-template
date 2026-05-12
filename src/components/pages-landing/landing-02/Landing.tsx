import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Hero17Section } from "@/components/sections-hero/hero-17";
import { LogoCloud11Section } from "@/components/sections-logo-cloud/logo-cloud-11";
import { HowItWorks8Section } from "@/components/sections-how-it-works/how-it-works-8";
import { Features27Section } from "@/components/sections-features/features-27";
import { Features28Section } from "@/components/sections-features/features-28";
import { Stats16Section } from "@/components/sections-stats/stats-16";
import { Testimonials02Section } from "@/components/sections-testimonials/testimonials-02";
import { Cta02Section } from "@/components/sections-cta/cta-02";
import { hero17Sample } from "@/components/sections-hero/hero-17/config";
import { logoCloud11Sample } from "@/components/sections-logo-cloud/logo-cloud-11/config";
import { howItWorks8Sample } from "@/components/sections-how-it-works/how-it-works-8/config";
import { features27Sample } from "@/components/sections-features/features-27/config";
import { features28Sample } from "@/components/sections-features/features-28/config";
import { stats16Sample } from "@/components/sections-stats/stats-16/config";
import { testimonials02Sample } from "@/components/sections-testimonials/testimonials-02/config";
import { cta02Sample } from "@/components/sections-cta/cta-02/config";
import { landing02Defaults, landing02Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `dark-landing-one` faithful port — eight ported
 * sections in upstream order. Each section preserves the upstream
 * JSX verbatim; only translatable strings flow through the project's
 * i18n registry. Illustrations / Card / TextEffect / Logo SVGs all
 * live as `dark-landing-*` files inside the project's structure
 * (no reuse of pre-existing project versions).
 */
export function Landing({
  layout = landing02Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(landing02Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Hero17Section {...hero17Sample} id={landing02Defaults.sectionIds.hero} />
      <LogoCloud11Section
        {...logoCloud11Sample}
        id={landing02Defaults.sectionIds.logoCloud}
      />
      <HowItWorks8Section
        {...howItWorks8Sample}
        id={landing02Defaults.sectionIds.howItWorks}
      />
      <Features27Section
        {...features27Sample}
        id={landing02Defaults.sectionIds.platform}
      />
      <Features28Section {...features28Sample} id={landing02Defaults.sectionIds.more} />
      <Stats16Section {...stats16Sample} id={landing02Defaults.sectionIds.stats} />
      <Testimonials02Section
        {...testimonials02Sample}
        id={landing02Defaults.sectionIds.testimonials}
      />
      <Cta02Section {...cta02Sample} id={landing02Defaults.sectionIds.cta} />
    </Layout>
  );
}
