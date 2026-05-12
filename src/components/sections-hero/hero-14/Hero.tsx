import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { ProductStacked } from "@/components/ui-illustrations/product-stacked";
import { LogoCloud01Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-01";
import { useScopedT } from "@/i18n/scoped-t";
import { hero14Namespace, hero14PrimaryCtaHref, hero14SecondaryCtaHref } from "./config";

export function Hero() {
  const [t] = useScopedT(hero14Namespace);

  return (
    <section
      aria-labelledby="hero-14-title"
      className="bg-background overflow-x-hidden pb-24"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-36 lg:px-12 lg:pt-44">
        <div className="text-center">
          <h1
            id="hero-14-title"
            className="text-foreground text-5xl font-semibold text-balance md:font-medium lg:text-7xl"
          >
            {t("title.first")}{" "}
            <span className="max-sm:hidden">{t("title.qualifier")}</span>{" "}
            {t("title.rest")}
          </h1>

          <p className="text-muted-foreground mx-auto mt-4 mb-6 max-w-xl text-lg text-balance lg:text-xl">
            {t("body")}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button asChild>
              <Link href={hero14PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("primaryCta")}
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href={hero14SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("secondaryCta")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <ProductStacked />
      <LogoCloud />
    </section>
  );
}
