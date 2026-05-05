import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { BillingCheckout } from "@/components/ui-illustrations/billing-checkout";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero7Namespace,
  secondaryHero7PrimaryCtaHref,
  secondaryHero7SecondaryCtaHref,
} from "./config";

/**
 * Secondary hero — two-column layout: left tagged headline + body +
 * dual CTAs, right `BillingCheckout` illustration. Sourced from
 * `@tailark-pro/secondary-hero-7`, refactored to the project pattern:
 * section semantics, all visible strings via
 * `blocks.secondary-hero-7.*`, primitives from `ui-primitives`,
 * illustration from `ui-illustrations`.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero7Namespace);

  return (
    <section aria-labelledby="secondary-hero-7-title" className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="max-md:text-center">
            <span className="text-primary text-sm font-medium">{t("tag")}</span>
            <h1
              id="secondary-hero-7-title"
              className="mt-6 text-4xl font-semibold text-balance md:text-5xl"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-4 mb-6 max-w-md text-lg text-balance max-md:mx-auto">
              {t("body")}
            </p>

            <Button asChild size="sm">
              <Link
                href={secondaryHero7PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
              >
                {t("primaryCta")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="ml-3" size="sm">
              <Link
                href={
                  secondaryHero7SecondaryCtaHref as Parameters<typeof Link>[0]["href"]
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
