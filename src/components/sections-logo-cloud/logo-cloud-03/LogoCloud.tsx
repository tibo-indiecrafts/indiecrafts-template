import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Primevideo } from "@/components/ui-primitives/svgs/prime";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud03Namespace } from "./config";

/**
 * Flat 4x2 brand grid on a `bg-card` strip — no text labels in the
 * visible UI. The hidden `<h2>` carries `t("label")` for screen
 * readers. Sourced from `@tailark-pro/hero-section-11`.
 */
export function LogoCloud() {
  const [t] = useScopedT(logoCloud03Namespace);

  return (
    <section aria-labelledby="logo-cloud-03-label" className="bg-card py-10">
      <h2 id="logo-cloud-03-label" className="sr-only">
        {t("label")}
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="**:fill-foreground grid grid-cols-3 *:h-20 *:items-center *:px-4 sm:grid-cols-4">
          <div className="flex">
            <Primevideo
              height={26}
              width="auto"
              className="*:!fill-foreground"
              aria-label="Prime Video"
            />
          </div>
          <div className="flex">
            <Cisco height={28} width="auto" aria-label="Cisco" />
          </div>
          <div className="flex">
            <Stripe height={22} width="auto" aria-label="Stripe" />
          </div>
          <div className="flex">
            <Hulu height={19} width="auto" aria-label="Hulu" />
          </div>
          <div className="flex">
            <Bolt height={18} width="auto" aria-label="Bolt" />
          </div>
          <div className="flex">
            <Supabase height={22} width="auto" aria-label="Supabase" />
          </div>
          <div className="flex">
            <OpenAIFull height={22} width="auto" aria-label="OpenAI" />
          </div>
          <div className="flex">
            <Beacon height={18} width="auto" aria-label="Beacon" />
          </div>
        </div>
      </div>
    </section>
  );
}
