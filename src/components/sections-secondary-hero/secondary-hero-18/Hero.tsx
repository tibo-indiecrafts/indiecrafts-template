import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { cn } from "@/lib/utils";
import { ProductSidePreview } from "@/components/ui-illustrations/product-side-preview";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero18Namespace,
  secondaryHero18PrimaryCtaHref,
  secondaryHero18SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero18Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-18-title"
      className="bg-background overflow-x-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

          <div className="grid grid-cols-2 divide-x border *:p-6 md:*:p-8 lg:grid-cols-6">
            <div className="col-span-3 border-b max-lg:border-r-0 max-md:text-center">
              <h1
                id="secondary-hero-18-title"
                className="text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
              >
                {t("title")}
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 mb-8 max-w-md text-lg text-balance max-md:mx-auto">
                {t("body")}
              </p>
              <div className="flex gap-3 max-lg:justify-center">
                <Button asChild>
                  <Link
                    href={
                      secondaryHero18PrimaryCtaHref as Parameters<typeof Link>[0]["href"]
                    }
                  >
                    {t("primaryCta")}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href={
                      secondaryHero18SecondaryCtaHref as Parameters<
                        typeof Link
                      >[0]["href"]
                    }
                  >
                    {t("secondaryCta")}
                  </Link>
                </Button>
              </div>
            </div>
            <ProductSidePreview
              alt={t("imageAlt")}
              className="col-span-3 border-r-0 border-b !p-0"
            />

            <div className="flex items-center justify-center max-lg:border-b">
              <Stripe height={22} width={56} className="*:fill-foreground" />
            </div>
            <div className="relative flex items-center justify-center max-lg:border-b">
              <PlusDecorator className="bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)] lg:hidden" />
              <OpenAIFull height={22} width={96} className="*:fill-foreground" />
            </div>
            <div className="relative flex items-center justify-center max-lg:border-r-0 max-lg:border-b">
              <PlusDecorator className="bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)] lg:top-0 lg:right-0 lg:left-auto lg:translate-x-[calc(50%+0.5px)] lg:-translate-y-[calc(50%+0.5px)]" />
              <VercelFull height={28} width={84} />
            </div>
            <div className="flex items-center justify-center">
              <Hulu height={20} width={52} className="*:fill-foreground" />
            </div>
            <div className="flex items-center justify-center">
              <Bolt height={18} width={92} className="*:fill-foreground" />
            </div>
            <div className="flex items-center justify-center">
              <Cisco height={24} width={84} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PlusDecorator = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "before:bg-foreground/25 after:bg-foreground/25 absolute size-3 mask-radial-from-15% before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px",
      className,
    )}
  />
);
