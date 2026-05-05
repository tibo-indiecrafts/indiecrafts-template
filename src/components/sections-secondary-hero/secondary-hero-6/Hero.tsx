import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { BillingFlow } from "@/components/ui-illustrations/billing-flow";
import { LogoCloud5Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-5";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero6Namespace,
  secondaryHero6PrimaryCtaHref,
  secondaryHero6SecondaryCtaHref,
} from "./config";

/**
 * Secondary hero — centered tagged headline + body + dual CTAs paired
 * with the `BillingFlow` illustration (3 usage cards → signature →
 * invoice mock) and a `LogoCloud5` infinite-slider marquee. Sourced
 * from `@tailark-pro/secondary-hero-6`, refactored to the project
 * pattern: section semantics, all visible strings via
 * `blocks.secondary-hero-6.*`, primitives from `ui-primitives`,
 * illustration from `ui-illustrations`, logo cloud from
 * `sections-logo-cloud`. Tailark's source referenced an unshipped
 * `InvoiceIllustration` and a `Firebase` SVG — we inline a minimal
 * invoice mock and substitute Cloudflare for Firebase.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero6Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-6-title"
      className="bg-background overflow-hidden pt-24 pb-8"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center *:mx-auto">
          <span className="text-primary text-sm font-medium">{t("tag")}</span>
          <h1
            id="secondary-hero-6-title"
            className="mt-6 max-w-2xl text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-4 mb-6 max-w-3xl text-lg text-balance">
            {t("body")}
          </p>

          <Button asChild size="sm">
            <Link
              href={secondaryHero6PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
            >
              {t("primaryCta")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="ml-3!" size="sm">
            <Link
              href={secondaryHero6SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}
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
