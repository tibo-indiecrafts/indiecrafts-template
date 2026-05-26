import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { CheckCircle2 } from "lucide-react";
import { EnterpriseForm } from "@/components/ui-molecules/form/contact-enterprise";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import TailwindCSS from "@/components/ui-primitives/svgs/tailwindcss";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { secondaryHero16DemoHref, secondaryHero16Namespace } from "./config";

const FEATURE_KEYS = ["createInvoices", "trackPayments", "manageFinances"] as const;

export function Hero() {
  const [t] = useScopedT(secondaryHero16Namespace);

  const richBoldStrong = {
    strong: (chunks: React.ReactNode) => (
      <strong className="text-foreground font-medium">{chunks}</strong>
    ),
  };

  return (
    <section
      aria-labelledby="secondary-hero-16-title"
      className="bg-background overflow-x-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

          <div className="grid grid-cols-2 divide-x border *:p-6 md:*:p-8 lg:grid-cols-4">
            <div className="col-span-2 border-b max-lg:border-r-0 max-md:text-center">
              <h1
                id="secondary-hero-16-title"
                className="text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
              >
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-6 mb-8 max-w-sm text-lg text-balance max-md:mx-auto">
                {t("body")}
              </p>

              <Button asChild size="lg">
                <Link
                  href={secondaryHero16DemoHref as Parameters<typeof Link>[0]["href"]}
                >
                  {t("cta")}
                </Link>
              </Button>

              <ul className="mt-8 space-y-2">
                {FEATURE_KEYS.map((featureKey) => (
                  <li
                    key={featureKey}
                    className="text-muted-foreground flex items-center gap-2 max-md:justify-center"
                  >
                    <CheckCircle2
                      aria-hidden
                      className="size-4 fill-emerald-400/25 text-emerald-600 dark:text-emerald-500"
                    />
                    {t(`features.${featureKey}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card/25 relative col-span-2 border-r-0 border-b lg:pt-10">
              <PlusDecorator className="bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />
              <EnterpriseForm />
            </div>

            <div className="row-span-2 grid grid-rows-subgrid gap-5 *:block max-lg:border-b">
              <p className="text-muted-foreground text-balance">
                {t.rich("stats.uptime", richBoldStrong)}
              </p>
              <Stripe height={22} width={56} />
            </div>

            <div className="row-span-2 grid grid-rows-subgrid gap-5 *:block max-lg:relative max-lg:border-r-0 max-lg:border-b">
              <PlusDecorator className="bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)] lg:hidden" />
              <p className="text-muted-foreground text-balance">
                {t.rich("stats.speed", richBoldStrong)}
              </p>
              <TailwindCSS height={24} width={120} />
            </div>

            <div className="row-span-2 grid grid-rows-subgrid gap-5 *:block">
              <p className="text-muted-foreground">
                {t.rich("stats.support", richBoldStrong)}
              </p>
              <Beacon height={22} width={68} />
            </div>

            <div className="row-span-2 grid grid-rows-subgrid gap-5 *:block">
              <p className="text-muted-foreground text-balance">
                {t.rich("stats.integration", richBoldStrong)}
              </p>
              <VercelFull height={24} width={78} />
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
