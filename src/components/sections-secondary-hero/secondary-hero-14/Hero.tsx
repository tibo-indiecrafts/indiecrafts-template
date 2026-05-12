import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { CheckCircle2 } from "lucide-react";
import { EnterpriseForm } from "@/components/ui-molecules/contact-form/enterprise";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import TailwindCSS from "@/components/ui-primitives/svgs/tailwindcss";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { secondaryHero14DemoHref, secondaryHero14Namespace } from "./config";

const FEATURE_KEYS = ["createInvoices", "trackPayments", "manageFinances"] as const;

const STAT_BRANDS = [
  { key: "uptime", brand: <Stripe height={22} width={56} /> },
  { key: "speed", brand: <TailwindCSS height={24} width={120} /> },
  { key: "support", brand: <Beacon height={22} width={68} /> },
  { key: "integration", brand: <VercelFull height={24} width={78} /> },
] as const;

export function Hero() {
  const [t] = useScopedT(secondaryHero14Namespace);

  const richBoldStrong = {
    strong: (chunks: React.ReactNode) => (
      <strong className="text-foreground font-medium">{chunks}</strong>
    ),
  };

  return (
    <section
      aria-labelledby="secondary-hero-14-title"
      className="bg-background overflow-x-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <span className="text-primary block text-sm font-medium max-md:text-center">
          {t("tag")}
        </span>
        <div className="mt-8 grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-12">
          <div className="max-md:text-center">
            <h1
              id="secondary-hero-14-title"
              className="text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-6 mb-8 max-w-sm text-lg text-balance max-md:mx-auto">
              {t("body")}
            </p>

            <Button asChild size="lg">
              <Link href={secondaryHero14DemoHref as Parameters<typeof Link>[0]["href"]}>
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

          <EnterpriseForm />
        </div>

        <div className="**:fill-foreground mt-12 grid grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-8 max-sm:gap-x-3 lg:mt-24 lg:grid-cols-4">
          {STAT_BRANDS.map(({ key, brand }) => (
            <div key={key} className="row-span-2 grid grid-rows-subgrid gap-5 *:block">
              <p className="text-muted-foreground text-balance">
                {t.rich(`stats.${key}`, richBoldStrong)}
              </p>
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
