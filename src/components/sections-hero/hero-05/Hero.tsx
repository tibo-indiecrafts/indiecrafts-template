import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { ChevronRight, CirclePlay } from "lucide-react";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { ProductIllustration } from "@/components/ui-illustrations/product-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { hero05Namespace, hero05PrimaryCtaHref, hero05SecondaryCtaHref } from "./config";

export function Hero() {
  const [t] = useScopedT(hero05Namespace);

  return (
    <section aria-labelledby="hero-05-title" className="overflow-x-hidden pb-6">
      <div className="relative pt-24 pb-36 md:pt-36 lg:pt-44">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-12">
          <div className="md:w-1/2">
            <div>
              <h1
                id="hero-05-title"
                className="max-w-md text-5xl font-medium text-balance md:text-6xl"
              >
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-4 mb-8 max-w-2xl text-xl text-balance">
                {t("body")}
              </p>

              <div className="flex items-center gap-3">
                <Button asChild size="lg" className="pr-2.5 pl-4">
                  <Link href={hero05PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                    <span className="text-nowrap">{t("primaryCta")}</span>
                    <ChevronRight className="opacity-50" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="pr-4 pl-3.5">
                  <Link
                    href={hero05SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}
                  >
                    <CirclePlay className="fill-primary/25 stroke-primary" aria-hidden />
                    <span className="text-nowrap">{t("secondaryCta")}</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-muted-foreground">{t("trustedBy")}</p>
              <div className="**:fill-foreground mt-6 flex w-full max-w-md flex-wrap items-center gap-8 *:w-fit">
                <Spotify height={26} width="auto" aria-label="Spotify" />
                <Supabase height={24} width="auto" aria-label="Supabase" />
                <Beacon height={18} width="auto" aria-label="Beacon" />
              </div>
            </div>
          </div>
        </div>

        <div className="z-20 mt-24 translate-x-12 perspective-near md:absolute md:top-40 md:-right-6 md:bottom-16 md:left-1/2 md:mt-0 md:translate-x-0">
          <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full max-w-3xl before:pointer-events-none before:absolute before:-inset-x-4 before:top-0 before:bottom-7 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
            <div className="bg-background ring-border relative h-full -translate-y-12 skew-x-6 overflow-hidden rounded-(--radius) border border-transparent shadow-xl ring-1 shadow-black/6.5 max-lg:max-h-160">
              <ProductIllustration className="w-[1280px] max-w-none origin-top-left scale-60 border-transparent sm:scale-65 lg:scale-55 xl:scale-58 2xl:scale-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
