import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui-primitives/button";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Primevideo } from "@/components/ui-primitives/svgs/prime";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud09CtaHref, logoCloud09Namespace } from "./config";

/**
 * Heading + 4-column grayscale-then-color hover grid + outline
 * chevron CTA. Sourced from `@tailark-pro/logo-cloud-06`.
 */
export function LogoCloud() {
  const [t] = useScopedT(logoCloud09Namespace);

  return (
    <section aria-labelledby="logo-cloud-09-title" className="py-16">
      <div className="relative m-auto max-w-5xl px-6 text-center">
        <h2 id="logo-cloud-09-title" className="text-center text-xl font-medium">
          {t("title")}
        </h2>

        <div className="mx-auto my-12 grid max-w-3xl grid-cols-3 gap-x-6 gap-y-8 *:justify-center *:duration-200 sm:grid-cols-4 sm:gap-y-12">
          <div className="group flex">
            <Primevideo
              height={28}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Prime Video"
            />
          </div>
          <div className="group flex">
            <Cisco
              height={32}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Cisco"
            />
          </div>
          <div className="group flex">
            <Stripe
              height={24}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Stripe"
            />
          </div>
          <div className="group flex">
            <Hulu
              height={20}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Hulu"
            />
          </div>
          <div className="group flex">
            <Bolt
              height={20}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Bolt"
            />
          </div>
          <div className="group flex">
            <Supabase
              height={24}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Supabase"
            />
          </div>
          <div className="group flex">
            <OpenAIFull
              height={24}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="OpenAI"
            />
          </div>
          <div className="group flex">
            <Beacon
              height={20}
              width="auto"
              className="not-group-hover:*:fill-foreground!"
              aria-label="Beacon"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="pr-2">
          <Link href={logoCloud09CtaHref as Parameters<typeof Link>[0]["href"]}>
            {t("cta")}
            <ChevronRight className="size-3.5!" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
