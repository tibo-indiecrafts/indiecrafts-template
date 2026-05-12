import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { ProductTabs } from "@/components/ui-illustrations/product-tabs";
import { useScopedT } from "@/i18n/scoped-t";
import { hero07Namespace, hero07PrimaryCtaHref, hero07SecondaryCtaHref } from "./config";

export function Hero() {
  const [t] = useScopedT(hero07Namespace);

  return (
    <section aria-labelledby="hero-07-title" className="relative overflow-hidden">
      <div className="pt-24 pb-20 md:pt-32 lg:pt-48">
        <div className="relative z-10 mx-auto grid max-w-5xl items-end gap-4 px-6 md:grid-cols-2">
          <div>
            <h1
              id="hero-07-title"
              className="text-5xl font-semibold text-balance lg:text-7xl"
            >
              {t("title")}
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-muted-foreground mb-6 text-lg text-balance lg:text-xl">
              {t("body")}
            </p>
            <Button asChild size="sm">
              <Link href={hero07PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("primaryCta")}
              </Link>
            </Button>
            <Button asChild className="ml-3" variant="outline" size="sm">
              <Link href={hero07SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("secondaryCta")}
              </Link>
            </Button>
          </div>
        </div>

        <ProductTabs />

        <div>
          <div className="mb-4 text-center">
            <p className="text-muted-foreground text-balance">{t("trustedBy")}</p>
          </div>
          <div className="relative border-y">
            <div className="bg-foreground/8 mx-auto max-w-6xl">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-px">
                <div className="bg-card/80" />
                <div className="*:bg-card grid w-full grid-cols-2 items-center justify-center gap-px *:h-16 sm:min-w-xl sm:grid-cols-3 md:min-w-2xl lg:mx-auto lg:max-w-2xl lg:*:h-20">
                  <div className="flex h-full items-center justify-center px-8">
                    <Hulu height={16} width="auto" aria-label="Hulu" />
                  </div>
                  <div className="flex items-center justify-center px-8">
                    <Spotify height={22} width="auto" aria-label="Spotify" />
                  </div>
                  <div className="flex items-center justify-center px-8">
                    <Supabase height={20} width="auto" aria-label="Supabase" />
                  </div>
                  <div className="flex items-center justify-center px-8">
                    <Beacon height={16} width="auto" aria-label="Beacon" />
                  </div>
                  <div className="flex items-center justify-center px-8">
                    <VercelFull height={16} width="auto" aria-label="Vercel" />
                  </div>
                  <div className="flex items-center justify-center px-8">
                    <Stripe height={20} width="auto" aria-label="Stripe" />
                  </div>
                </div>
                <div className="bg-card/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="border-foreground/7 pointer-events-none absolute inset-0 bottom-8 mx-auto flex max-w-6xl justify-between border-x"
      />
    </section>
  );
}
