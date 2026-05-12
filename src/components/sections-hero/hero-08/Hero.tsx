import { ProductTabs } from "@/components/ui-illustrations/product-tabs";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { LogoCloud01Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-01";
import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import {
  hero08BackgroundImageDark,
  hero08BackgroundImageLight,
  hero08Namespace,
  hero08PrimaryCtaHref,
  hero08SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(hero08Namespace);

  return (
    <>
      <section
        aria-labelledby="hero-08-title"
        className="bg-background relative overflow-hidden"
      >
        <div className="absolute inset-0 mask-t-from-35% mask-t-to-65% mask-b-from-55% mask-b-to-75% dark:mask-t-to-55%">
          <Image
            src={hero08BackgroundImageDark}
            alt={t("imageAlt")}
            className="size-full object-cover object-bottom not-dark:hidden"
            width={3115}
            height={3115}
          />
          <Image
            src={hero08BackgroundImageLight}
            alt={t("imageAlt")}
            className="size-full object-cover object-bottom dark:hidden"
            width={2156}
            height={2156}
          />
        </div>
        <div className="pt-24 pb-20 md:pt-32 lg:pt-40">
          <div className="relative z-10 mx-auto grid max-w-5xl items-end gap-4 px-6">
            <h1
              id="hero-08-title"
              className="text-4xl font-semibold text-balance sm:text-5xl md:max-w-4xl lg:text-6xl"
            >
              {t("title")}
            </h1>

            <div className="max-w-lg">
              <p className="text-muted-foreground mb-6 text-lg text-balance lg:text-xl">
                {t("body")}
              </p>
              <Button asChild>
                <Link href={hero08PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                  {t("primaryCta")}
                </Link>
              </Button>
              <Button asChild className="ml-3" variant="outline">
                <Link href={hero08SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                  {t("secondaryCta")}
                </Link>
              </Button>
            </div>
          </div>
          <ProductTabs />
        </div>
      </section>
      <LogoCloud />
    </>
  );
}
