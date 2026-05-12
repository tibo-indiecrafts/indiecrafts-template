import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { ProductCarousel } from "@/components/ui-illustrations/product-carousel";
import { LogoCloud03Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-03";
import { useScopedT } from "@/i18n/scoped-t";
import { hero11Namespace, hero11PrimaryCtaHref, hero11SecondaryCtaHref } from "./config";

export function Hero() {
  const [t] = useScopedT(hero11Namespace);

  return (
    <section aria-labelledby="hero-11-title" className="relative overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 mx-1 grid max-w-5xl grid-cols-3 border-x [--color-border:color-mix(in_oklab,var(--foreground)_8%,transparent)] sm:grid-cols-4 md:mx-auto"
      >
        <div className="h-full border-r border-dashed" />
        <div className="h-full border-r border-dashed" />
        <div className="h-full max-sm:hidden" />
        <div className="h-full border-l border-dashed max-sm:hidden" />
      </div>
      <div className="relative pt-24 pb-16 md:pt-36 md:pb-24 lg:pt-40">
        <div className="mx-auto w-full px-6 lg:max-w-5xl">
          <div className="grid items-center max-lg:gap-12 lg:grid-cols-2">
            <div>
              <div className="lg:max-w-sm">
                <h1
                  id="hero-11-title"
                  className="text-4xl font-semibold text-balance md:text-5xl"
                >
                  {t("title")}
                </h1>
                <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
                  {t("body")}
                </p>

                <div className="flex items-center gap-3">
                  <Button asChild size="sm">
                    <Link
                      href={hero11PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
                    >
                      {t("primaryCta")}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={hero11SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}
                    >
                      {t("secondaryCta")}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-12 grid max-w-sm grid-cols-2">
                <div className="space-y-2 *:block">
                  <span className="text-lg font-semibold">
                    {t("stats.uptime.value")}{" "}
                    <span className="text-muted-foreground text-lg">
                      {t("stats.uptime.unit")}
                    </span>
                  </span>
                  <p className="text-muted-foreground text-sm text-balance">
                    <strong className="text-foreground font-medium">
                      {t("stats.uptime.label")}
                    </strong>{" "}
                    {t("stats.uptime.description")}
                  </p>
                </div>

                <div className="space-y-2 *:block">
                  <span className="text-lg font-semibold">
                    {t("stats.speed.value")}{" "}
                    <span className="text-muted-foreground text-lg">
                      {t("stats.speed.unit")}
                    </span>
                  </span>
                  <p className="text-muted-foreground text-sm text-balance">
                    <strong className="text-foreground font-medium">
                      {t("stats.speed.label")}
                    </strong>{" "}
                    {t("stats.speed.description")}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-lg:max-w-[calc(100vw-3rem)] lg:-mr-6">
              <ProductCarousel />
            </div>
          </div>
        </div>
      </div>
      <LogoCloud />
    </section>
  );
}
