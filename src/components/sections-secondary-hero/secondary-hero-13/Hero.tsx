import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui-primitives/button";
import { Apple } from "@/components/ui-primitives/svgs/apple";
import { PhoneScreenshot } from "@/components/ui-illustrations/phone-screenshot";
import { CheckCircle2 } from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import {
  secondaryHero13DownloadHref,
  secondaryHero13Namespace,
  secondaryHero13PhoneImage,
} from "./config";

const FEATURE_KEYS = ["createInvoices", "trackPayments", "manageFinances"] as const;

export function Hero() {
  const [t] = useScopedT(secondaryHero13Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-13-title"
      className="bg-background overflow-x-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <span className="text-primary block text-sm font-medium max-md:text-center">
          {t("tag")}
        </span>
        <div className="mt-8 grid items-center gap-16 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-12">
          <div className="max-md:text-center lg:col-span-2">
            <h1
              id="secondary-hero-13-title"
              className="text-4xl font-semibold text-balance md:text-5xl"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-6 mb-8 max-w-sm text-lg text-balance max-md:mx-auto">
              {t("body")}
            </p>

            <Button asChild variant="outline" size="lg" className="h-12 px-5 text-base">
              <Link
                href={secondaryHero13DownloadHref as Parameters<typeof Link>[0]["href"]}
              >
                <Apple className="!size-5" />
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

          <div className="relative lg:col-span-3 lg:pl-32">
            <div className="bg-background/60 ring-foreground/10 min-w-3xl rounded-2xl p-1 shadow-xl ring-1 max-md:hidden">
              <div
                aria-hidden
                className="bg-background ring-border-illustration relative aspect-video origin-top overflow-hidden rounded-xl border-4 border-transparent shadow ring-1"
              />
            </div>
            <div className="md:absolute md:-top-8 lg:left-20">
              <PhoneScreenshot src={secondaryHero13PhoneImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
