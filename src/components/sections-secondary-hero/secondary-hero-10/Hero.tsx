import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero10CtaHref,
  secondaryHero10ImagePortrait,
  secondaryHero10ImageSquare,
  secondaryHero10ImageWide,
  secondaryHero10Namespace,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero10Namespace);

  return (
    <section aria-labelledby="secondary-hero-10-title">
      <div className="py-24 md:py-32">
        <div className="mx-auto mb-8 max-w-5xl px-6">
          <div className="grid grid-cols-6 gap-4 sm:grid-cols-8">
            <div className="col-span-6 max-md:pb-6 sm:col-span-5 md:col-span-4 md:pt-6">
              <h1
                id="secondary-hero-10-title"
                className="text-4xl font-semibold text-balance md:text-6xl"
              >
                <span className="text-primary">{t("title.accent")}</span>{" "}
                {t("title.rest")}
              </h1>
              <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
                {t("body")}
              </p>
              <Button asChild size="sm">
                <Link href={secondaryHero10CtaHref as Parameters<typeof Link>[0]["href"]}>
                  {t("cta")}
                </Link>
              </Button>
            </div>
            <div className="col-span-3 flex items-end sm:col-span-2 sm:col-start-6">
              <div className="before:border-foreground/5 before:bg-primary/10 relative aspect-4/5 overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border">
                <Image
                  src={secondaryHero10ImagePortrait}
                  alt={t("imageAlt.portrait")}
                  className="size-full object-cover"
                  width={927}
                  height={1648}
                />
              </div>
            </div>
            <div className="col-span-3 max-md:flex max-md:items-end sm:col-start-3">
              <div className="before:border-foreground/5 before:bg-primary/5 relative mt-auto aspect-square h-fit overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border">
                <Image
                  src={secondaryHero10ImageSquare}
                  alt={t("imageAlt.square")}
                  className="size-full object-cover"
                  width={3047}
                  height={1868}
                />
              </div>
            </div>
            <div className="before:border-foreground/5 before:bg-primary/5 relative col-span-4 aspect-video overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border max-md:col-start-3 md:col-span-3">
              <Image
                src={secondaryHero10ImageWide}
                alt={t("imageAlt.wide")}
                className="size-full object-cover"
                width={2340}
                height={1560}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
