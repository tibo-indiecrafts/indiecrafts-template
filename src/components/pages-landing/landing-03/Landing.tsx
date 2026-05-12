import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Hero18Section } from "@/components/sections-hero/hero-18";
import { LogoCloud12Section } from "@/components/sections-logo-cloud/logo-cloud-12";
import { Content19Section } from "@/components/sections-content/content-19";
import { Features29Section } from "@/components/sections-features/features-29";
import { Features30Section } from "@/components/sections-features/features-30";
import { Integrations12Section } from "@/components/sections-integrations/integrations-12";
import { Testimonials03Section } from "@/components/sections-testimonials/testimonials-03";
import { Cta03Section } from "@/components/sections-cta/cta-03";
import { hero18Sample } from "@/components/sections-hero/hero-18/config";
import { logoCloud12Sample } from "@/components/sections-logo-cloud/logo-cloud-12/config";
import { content19Sample } from "@/components/sections-content/content-19/config";
import { integrations12Sample } from "@/components/sections-integrations/integrations-12/config";
import { cta03Sample } from "@/components/sections-cta/cta-03/config";
import { landing03Defaults, landing03Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `grid-1-landing-one` faithful port. Eight sections
 * in upstream order, each rendered inside the grid-1 `Container`
 * border frame. JSX preserved verbatim per section; strings flow
 * through `blocks.<key>.*`.
 */
export function Landing({
  layout = landing03Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(landing03Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Hero18Section {...hero18Sample} id={landing03Defaults.sectionIds.hero} />
      <LogoCloud12Section
        {...logoCloud12Sample}
        id={landing03Defaults.sectionIds.logoCloud}
      />
      <Content19Section
        {...content19Sample}
        id={landing03Defaults.sectionIds.manifesto}
      />
      <Features29Section id={landing03Defaults.sectionIds.platform} />
      <Features30Section id={landing03Defaults.sectionIds.analytics} />
      <Integrations12Section
        {...integrations12Sample}
        id={landing03Defaults.sectionIds.integrations}
      />
      <Testimonials03Section id={landing03Defaults.sectionIds.testimonials} />
      <Cta03Section {...cta03Sample} id={landing03Defaults.sectionIds.cta} />
    </Layout>
  );
}
