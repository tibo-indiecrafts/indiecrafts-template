import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Primevideo } from "@/components/ui-primitives/svgs/prime";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { VisualStudioCode } from "@/components/ui-primitives/svgs/vs-code";
import { InfiniteSlider } from "@/components/ui-effects/infinite-slider";
import { Button } from "@/components/ui-primitives/button";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud07CtaHref, logoCloud07Namespace } from "./config";

export function LogoCloud() {
  const [t] = useScopedT(logoCloud07Namespace);

  return (
    <section aria-labelledby="logo-cloud-07-title" className="overflow-hidden py-16">
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="text-center">
          <div className="mx-auto max-w-xl text-balance">
            <h2 id="logo-cloud-07-title" className="text-4xl font-semibold">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">{t("body")}</p>
          </div>

          <div className="relative mask-x-from-90% py-12">
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 z-10 w-16 mask-r-from-50% backdrop-grayscale-200"
            />
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 z-10 w-16 mask-l-from-50% backdrop-grayscale-200"
            />
            <InfiniteSlider
              speedOnHover={20}
              speed={40}
              className="items-center *:gap-12! md:*:gap-24! lg:*:gap-32!"
            >
              <Hulu height={24} width="auto" aria-label="Hulu" />
              <Beacon height={24} width="auto" aria-label="Beacon" />
              <Cisco height={24} width="auto" aria-label="Cisco" />
              <Primevideo height={32} width="auto" aria-label="Prime Video" />
              <Stripe height={24} width="auto" aria-label="Stripe" />
              <OpenAIFull height={24} width="auto" aria-label="OpenAI" />
              <VisualStudioCode height={24} width="auto" aria-label="VS Code" />
              <Bolt height={24} width="auto" aria-label="Bolt" />
            </InfiniteSlider>
          </div>
          <Button variant="outline" size="sm" asChild className="pr-2">
            <Link href={logoCloud07CtaHref as Parameters<typeof Link>[0]["href"]}>
              {t("cta")}
              <ChevronRight className="size-3.5!" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
