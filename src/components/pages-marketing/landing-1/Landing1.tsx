import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Features1Section } from "@/components/sections-marketing-features/features-1";
import { CallToActionSection } from "@/components/sections-marketing-cta/cta-1";
import { Pricing1Section } from "@/components/sections-marketing-pricing/pricing-1";
import { Testimonials1Section } from "@/components/sections-marketing-testimonials/testimonials-1";
import { features1Sample } from "@/components/sections-marketing-features/features-1/config";
import { cta1Sample } from "@/components/sections-marketing-cta/cta-1/config";
import { pricing1Sample } from "@/components/sections-marketing-pricing/pricing-1/config";
import { testimonials1Sample } from "@/components/sections-marketing-testimonials/testimonials-1/config";
import { landing1Defaults, landing1Namespace } from "./config";

export type Landing1Props = {
  /** Override the wrapping layout. Defaults to `landing1Defaults.layout`. */
  layout?: LayoutName;
  /** Forwarded to the layout's header slot. */
  header?: boolean | ReactNode;
  /** Forwarded to the layout's footer slot. */
  footer?: boolean | ReactNode;
};

/**
 * Marketing landing template — features → cta → pricing → testimonials.
 * Layout is configurable via the `layout` prop; header/footer slots forward
 * to the chosen layout. Section copy comes from each section's
 * `<type>Sample` (`blocks.<type>.*` keys), so a fork overrides translations
 * at the section level (`messages/<locale>.json`) without touching this
 * file. Page-scoped strings (e.g. the SEO h1) live in `./en.json` under
 * the `blocks.landing-1.*` namespace.
 */
export function Landing1({
  layout = landing1Defaults.layout,
  header,
  footer,
}: Landing1Props = {}) {
  const t = useTranslations(landing1Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Features1Section {...features1Sample} id={landing1Defaults.sectionIds.features} />
      <CallToActionSection {...cta1Sample} id={landing1Defaults.sectionIds.cta} />
      <Pricing1Section {...pricing1Sample} id={landing1Defaults.sectionIds.pricing} />
      <Testimonials1Section
        {...testimonials1Sample}
        id={landing1Defaults.sectionIds.testimonials}
      />
    </Layout>
  );
}
