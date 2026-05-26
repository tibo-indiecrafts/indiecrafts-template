import { BillingGrid } from "@/components/ui-illustrations/billing-grid";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useScopedT } from "@/components/_lib/scoped-t";
import {
  secondaryHero05BackgroundImage,
  secondaryHero05CtaHref,
  secondaryHero05Namespace,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero05Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-05-title"
      className="bg-background mb-12 border-b pt-44"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="mx-auto mb-6 max-w-3xl">
          <div className="max-w-2xl">
            <span className="text-primary text-sm font-medium">{t("tag")}</span>
            <h1
              id="secondary-hero-05-title"
              className="mt-6 text-4xl font-semibold text-balance lg:text-5xl lg:font-medium"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
              {t("body")}
            </p>
            <Button asChild size="sm">
              <Link href={secondaryHero05CtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("cta")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative mx-auto max-w-7xl py-6 md:py-12">
        <div className="relative z-10">
          <BillingGrid />
        </div>
        <div className="absolute inset-0 mx-auto mask-t-from-65% mask-x-from-75% dark:hidden">
          <Image
            className="mx-auto size-full origin-top object-cover opacity-50"
            src={secondaryHero05BackgroundImage}
            alt={t("imageAlt")}
            width={2300}
            height={1294}
          />
        </div>
      </div>
    </section>
  );
}
