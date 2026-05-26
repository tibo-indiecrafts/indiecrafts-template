import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { ProductStacked } from "@/components/ui-illustrations/product-stacked";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import TailwindCSS from "@/components/ui-primitives/svgs/tailwindcss";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import {
  secondaryHero17AvatarUrl,
  secondaryHero17DemoHref,
  secondaryHero17Namespace,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero17Namespace);

  const richBoldStrong = {
    strong: (chunks: React.ReactNode) => (
      <strong className="text-foreground font-medium">{chunks}</strong>
    ),
  };

  return (
    <section
      aria-labelledby="secondary-hero-17-title"
      className="bg-background overflow-x-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

          <div className="grid grid-cols-2 divide-x border *:p-6 md:*:p-8 lg:grid-cols-4">
            <div className="col-span-full overflow-hidden border-r-0 border-b !p-0 text-center max-md:text-center">
              <div className="px-12 pt-16">
                <h1
                  id="secondary-hero-17-title"
                  className="text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
                >
                  {t("title")}
                </h1>
                <p className="text-muted-foreground mx-auto mt-6 mb-8 max-w-md text-lg text-balance max-md:mx-auto">
                  {t("body")}
                </p>

                <Button asChild size="lg">
                  <Link
                    href={secondaryHero17DemoHref as Parameters<typeof Link>[0]["href"]}
                  >
                    {t("cta")}
                  </Link>
                </Button>
              </div>

              <ProductStacked />
            </div>

            <div className="row-span-2 grid grid-rows-subgrid gap-5 *:block max-lg:border-b">
              <p className="text-muted-foreground text-balance">
                {t.rich("stats.uptime", richBoldStrong)}
              </p>
              <Stripe height={22} width={56} className="*:fill-foreground" />
            </div>

            <div className="row-span-2 grid grid-rows-subgrid gap-5 *:block max-lg:relative max-lg:border-r-0 max-lg:border-b">
              <PlusDecorator className="bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)] lg:hidden" />
              <p className="text-muted-foreground text-balance">
                {t.rich("stats.speed", richBoldStrong)}
              </p>
              <TailwindCSS height={26} width={132} className="*:fill-foreground" />
            </div>

            <div className="col-span-2 row-span-2 grid grid-rows-subgrid gap-5 *:block">
              <blockquote className="relative max-w-xl">
                <p className="text-foreground">{t("testimonial.quote")}</p>
                <footer className="mt-4 flex items-center gap-2">
                  <div className="ring-foreground/10 size-6 overflow-hidden rounded-md border border-transparent shadow ring-1">
                    <Image
                      src={secondaryHero17AvatarUrl}
                      alt={t("testimonial.avatarAlt")}
                      width={46}
                      height={46}
                      className="size-full object-cover"
                    />
                  </div>
                  <cite>{t("testimonial.name")}</cite>
                  <span aria-hidden className="bg-foreground/15 size-1 rounded-full" />
                  <span className="text-muted-foreground">{t("testimonial.title")}</span>
                </footer>
              </blockquote>
              <VercelFull height={28} width={84} />
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
