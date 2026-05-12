import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { BillingCheckout } from "@/components/ui-illustrations/billing-checkout";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero07Namespace,
  secondaryHero07PrimaryCtaHref,
  secondaryHero07SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero07Namespace);

  return (
    <section aria-labelledby="secondary-hero-07-title" className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="max-md:text-center">
            <span className="text-primary text-sm font-medium">{t("tag")}</span>
            <h1
              id="secondary-hero-07-title"
              className="mt-6 text-4xl font-semibold text-balance md:text-5xl"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-4 mb-6 max-w-md text-lg text-balance max-md:mx-auto">
              {t("body")}
            </p>

            <Button asChild size="sm">
              <Link
                href={secondaryHero07PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
              >
                {t("primaryCta")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="ml-3" size="sm">
              <Link
                href={
                  secondaryHero07SecondaryCtaHref as Parameters<typeof Link>[0]["href"]
                }
              >
                {t("secondaryCta")}
              </Link>
            </Button>
          </div>

          <BillingCheckout />
        </div>
      </div>
    </section>
  );
}
