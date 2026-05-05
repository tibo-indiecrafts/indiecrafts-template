import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Features01Section } from "@/components/sections-features/features-01";
import { CallToActionSection } from "@/components/sections-cta/cta-01";
import { Pricing01Section } from "@/components/sections-pricing/pricing-01";
import { Testimonials01Section } from "@/components/sections-testimonials/testimonials-01";
import { features01Sample } from "@/components/sections-features/features-01/config";
import { cta01Sample } from "@/components/sections-cta/cta-01/config";
import { pricing01Sample } from "@/components/sections-pricing/pricing-01/config";
import { testimonials01Sample } from "@/components/sections-testimonials/testimonials-01/config";
import { landing01Defaults, landing01Namespace } from "./config";

export type LandingProps = {
  /** Override the wrapping layout. Defaults to `landing01Defaults.layout`. */
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
 * the `blocks.landing-01.*` namespace.
 */
export function Landing({
  layout = landing01Defaults.layout,
  header,
  footer,
}: LandingProps = {}) {
  const t = useTranslations(landing01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Features01Section
        {...features01Sample}
        id={landing01Defaults.sectionIds.features}
      />
      <CallToActionSection {...cta01Sample} id={landing01Defaults.sectionIds.cta} />
      <Pricing01Section {...pricing01Sample} id={landing01Defaults.sectionIds.pricing} />
      <Testimonials01Section
        {...testimonials01Sample}
        id={landing01Defaults.sectionIds.testimonials}
      />
    </Layout>
  );
}
