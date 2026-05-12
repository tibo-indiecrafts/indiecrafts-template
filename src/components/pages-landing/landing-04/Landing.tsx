import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Hero19Section } from "@/components/sections-hero/hero-19";
import { LogoCloud13Section } from "@/components/sections-logo-cloud/logo-cloud-13";
import { Content20Section } from "@/components/sections-content/content-20";
import { Features31Section } from "@/components/sections-features/features-31";
import { Features32Section } from "@/components/sections-features/features-32";
import { Features33Section } from "@/components/sections-features/features-33";
import { Integrations13Section } from "@/components/sections-integrations/integrations-13";
import { Testimonials04Section } from "@/components/sections-testimonials/testimonials-04";
import { Cta04Section } from "@/components/sections-cta/cta-04";
import { hero19Sample } from "@/components/sections-hero/hero-19/config";
import { logoCloud13Sample } from "@/components/sections-logo-cloud/logo-cloud-13/config";
import { content20Sample } from "@/components/sections-content/content-20/config";
import { integrations13Sample } from "@/components/sections-integrations/integrations-13/config";
import { cta04Sample } from "@/components/sections-cta/cta-04/config";
import { landing04Defaults, landing04Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `grid-2-landing-one` faithful port. Nine sections in
 * upstream order. JSX preserved verbatim per section; strings flow
 * through `blocks.<key>.*`.
 */
export function Landing({
  layout = landing04Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(landing04Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines (mirrors
          upstream's `bg-zinc-950/10` main wrapper). */}
      <div className="bg-foreground/10">
        <Hero19Section {...hero19Sample} id={landing04Defaults.sectionIds.hero} />
        <LogoCloud13Section
          {...logoCloud13Sample}
          id={landing04Defaults.sectionIds.logoCloud}
        />
        <Content20Section
          {...content20Sample}
          id={landing04Defaults.sectionIds.manifesto}
        />
        <Features31Section id={landing04Defaults.sectionIds.platform} />
        <Features32Section id={landing04Defaults.sectionIds.analytics} />
        <Integrations13Section
          {...integrations13Sample}
          id={landing04Defaults.sectionIds.integrations}
        />
        <Features33Section id={landing04Defaults.sectionIds.enterprise} />
        <Testimonials04Section id={landing04Defaults.sectionIds.testimonials} />
        <Cta04Section {...cta04Sample} id={landing04Defaults.sectionIds.cta} />
      </div>
    </Layout>
  );
}
