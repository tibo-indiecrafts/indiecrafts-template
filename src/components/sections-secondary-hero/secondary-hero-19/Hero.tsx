import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { ProductSidePreview } from "@/components/ui-illustrations/product-side-preview";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import {
  secondaryHero19Namespace,
  secondaryHero19PrimaryCtaHref,
  secondaryHero19SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero19Namespace);

  return (
    <section aria-labelledby="secondary-hero-19-title" className="bg-background">
      <div className="bg-foreground/8 @container">
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
          <Decorator />
          <div className="mx-auto w-full p-[0.5px] lg:min-w-5xl">
            <div className="bg-background h-full rounded">
              <div className="max-w-lg px-6 pt-12 pb-6 md:pt-24">
                <span className="text-muted-foreground font-mono text-sm uppercase">
                  {t("eyebrow")}
                </span>
              </div>
            </div>
          </div>
          <Decorator />
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
          <Decorator />
          <div className="mx-auto w-full max-w-5xl lg:min-w-5xl">
            <div className="grid grid-cols-2 *:p-[0.5px] lg:grid-cols-6">
              <div className="col-span-3 max-lg:text-center">
                <div className="bg-background flex h-full flex-col justify-center rounded px-8 py-16">
                  <h1
                    id="secondary-hero-19-title"
                    className="text-5xl font-semibold text-balance lg:text-6xl"
                  >
                    {t("title")}
                  </h1>
                  <p className="text-muted-foreground mx-auto mt-6 mb-8 max-w-md text-lg text-balance max-lg:mx-auto">
                    {t("body")}
                  </p>
                  <div className="flex gap-3 max-lg:justify-center">
                    <Button asChild>
                      <Link
                        href={
                          secondaryHero19PrimaryCtaHref as Parameters<
                            typeof Link
                          >[0]["href"]
                        }
                      >
                        {t("primaryCta")}
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link
                        href={
                          secondaryHero19SecondaryCtaHref as Parameters<
                            typeof Link
                          >[0]["href"]
                        }
                      >
                        {t("secondaryCta")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-span-3">
                <ProductSidePreview
                  alt={t("imageAlt")}
                  className="bg-background h-full rounded"
                />
              </div>
            </div>
          </div>
          <Decorator />
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
          <Decorator />
          <div className="mx-auto w-full lg:max-w-5xl lg:min-w-5xl">
            <div className="h-full">
              <div className="grid grid-cols-2 *:p-[0.5px] lg:grid-cols-6">
                <BrandCell>
                  <Stripe height={22} width={56} className="*:fill-foreground" />
                </BrandCell>
                <BrandCell>
                  <OpenAIFull height={22} width={96} className="*:fill-foreground" />
                </BrandCell>
                <BrandCell>
                  <VercelFull height={28} width={84} />
                </BrandCell>
                <BrandCell>
                  <Hulu height={20} width={52} className="*:fill-foreground" />
                </BrandCell>
                <BrandCell>
                  <Bolt height={18} width={92} className="*:fill-foreground" />
                </BrandCell>
                <BrandCell>
                  <Cisco height={24} width={84} />
                </BrandCell>
              </div>
            </div>
          </div>
          <Decorator />
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
          <Decorator />
          <div className="mx-auto w-full p-[0.5px] lg:min-w-5xl">
            <div className="bg-background h-24 rounded" />
          </div>
          <Decorator />
        </div>
      </div>
    </section>
  );
}

const Decorator = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn("p-[0.5px]", className)}>
    <div className="bg-background h-full rounded max-lg:w-2" />
  </div>
);

const BrandCell = ({ children }: { children: React.ReactNode }) => (
  <div>
    <div className="bg-background flex h-16 items-center justify-center rounded md:h-20">
      {children}
    </div>
  </div>
);
