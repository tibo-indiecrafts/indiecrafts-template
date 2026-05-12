import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Hero20Section } from "@/components/sections-hero/hero-20";
import { LogoCloud14Section } from "@/components/sections-logo-cloud/logo-cloud-14";
import { Features34Section } from "@/components/sections-features/features-34";
import { Features35Section } from "@/components/sections-features/features-35";
import { Features36Section } from "@/components/sections-features/features-36";
import { Features37Section } from "@/components/sections-features/features-37";
import { Testimonials05Section } from "@/components/sections-testimonials/testimonials-05";
import { Cta05Section } from "@/components/sections-cta/cta-05";
import { hero20Sample } from "@/components/sections-hero/hero-20/config";
import { logoCloud14Sample } from "@/components/sections-logo-cloud/logo-cloud-14/config";
import { cta05Sample } from "@/components/sections-cta/cta-05/config";
import { landing05Defaults, landing05Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = landing05Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(landing05Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Hero20Section {...hero20Sample} id={landing05Defaults.sectionIds.hero} />
      <LogoCloud14Section
        {...logoCloud14Sample}
        id={landing05Defaults.sectionIds.logoCloud}
      />
      <Features34Section id={landing05Defaults.sectionIds.analytics} />
      <Features35Section id={landing05Defaults.sectionIds.platform} />
      <Features36Section id={landing05Defaults.sectionIds.productDirection} />
      <Features37Section id={landing05Defaults.sectionIds.moreFeatures} />
      <Testimonials05Section id={landing05Defaults.sectionIds.testimonials} />
      <Cta05Section {...cta05Sample} id={landing05Defaults.sectionIds.cta} />
    </Layout>
  );
}
