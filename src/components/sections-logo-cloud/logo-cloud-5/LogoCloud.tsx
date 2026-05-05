"use client";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Primevideo } from "@/components/ui-primitives/svgs/prime";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { VisualStudioCode } from "@/components/ui-primitives/svgs/vs-code";
import { InfiniteSlider } from "@/components/ui-effects/infinite-slider";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud5Namespace } from "./config";

/**
 * Masked horizontal infinite-slider marquee of brand SVGs. Sourced
 * from `@tailark-pro/secondary-hero-6`. The hidden `<h2>` carries
 * `t("label")` for screen readers; the strip itself is decorative.
 */
export function LogoCloud() {
  const [t] = useScopedT(logoCloud5Namespace);

  return (
    <section aria-labelledby="logo-cloud-5-label" className="mx-auto max-w-3xl">
      <h2 id="logo-cloud-5-label" className="sr-only">
        {t("label")}
      </h2>
      <div className="mask-x-from-90% py-16">
        <InfiniteSlider
          speedOnHover={20}
          speed={40}
          className="**:fill-foreground items-center *:gap-12! md:*:gap-24!"
        >
          <Hulu height={20} width="auto" aria-label="Hulu" />
          <Beacon height={24} width="auto" aria-label="Beacon" />
          <Cisco height={24} width="auto" aria-label="Cisco" />
          <Primevideo height={32} width="auto" aria-label="Prime Video" />
          <Stripe height={20} width="auto" aria-label="Stripe" />
          <OpenAIFull height={24} width="auto" aria-label="OpenAI" />
          <VisualStudioCode height={24} width="auto" aria-label="VS Code" />
          <Bolt height={20} width="auto" aria-label="Bolt" />
        </InfiniteSlider>
      </div>
    </section>
  );
}
