import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Primevideo } from "@/components/ui-primitives/svgs/prime";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud8Namespace } from "./config";

/**
 * 4-column logo grid framed by `divide-x` dashed dividers and outer
 * `border-x`. Sourced from `@tailark-pro/logo-cloud-4`.
 */
export function LogoCloud() {
  const [t] = useScopedT(logoCloud8Namespace);

  return (
    <section aria-label={t("label")} className="py-16">
      <h2 className="sr-only">{t("label")}</h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-3 gap-x-6 divide-dashed *:items-center *:px-4 *:py-6 *:nth-4:border-r-0 sm:grid-cols-4 sm:divide-x sm:border-x">
          <div className="flex">
            <Primevideo height={28} width="auto" aria-label="Prime Video" />
          </div>
          <div className="flex">
            <Cisco height={32} width="auto" aria-label="Cisco" />
          </div>
          <div className="flex">
            <Stripe height={24} width="auto" aria-label="Stripe" />
          </div>
          <div className="flex">
            <Hulu height={22} width="auto" aria-label="Hulu" />
          </div>
          <div className="flex">
            <Bolt height={20} width="auto" aria-label="Bolt" />
          </div>
          <div className="flex">
            <Supabase height={24} width="auto" aria-label="Supabase" />
          </div>
          <div className="flex">
            <OpenAIFull height={24} width="auto" aria-label="OpenAI" />
          </div>
          <div className="flex">
            <Beacon height={20} width="auto" aria-label="Beacon" />
          </div>
        </div>
      </div>
    </section>
  );
}
