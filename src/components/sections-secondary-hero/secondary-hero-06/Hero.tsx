import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { BillingFlow } from "@/components/ui-illustrations/billing-flow";
import { LogoCloud05Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-05";
import { useScopedT } from "@/components/_lib/scoped-t";
import {
  secondaryHero06Namespace,
  secondaryHero06PrimaryCtaHref,
  secondaryHero06SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero06Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-06-title"
      className="bg-background overflow-hidden pt-24 pb-8"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center *:mx-auto">
          <span className="text-primary text-sm font-medium">{t("tag")}</span>
          <h1
            id="secondary-hero-06-title"
            className="mt-6 max-w-2xl text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-4 mb-6 max-w-3xl text-lg text-balance">
            {t("body")}
          </p>

          <Button asChild size="sm">
            <Link
              href={secondaryHero06PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
            >
              {t("primaryCta")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="ml-3!" size="sm">
            <Link
              href={secondaryHero06SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}
            >
              {t("secondaryCta")}
            </Link>
          </Button>
        </div>
        <BillingFlow />
        <LogoCloud />
      </div>
    </section>
  );
}
