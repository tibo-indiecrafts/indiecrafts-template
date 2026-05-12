import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { Shield, Sparkles, SquareActivity } from "lucide-react";
import type { ReactNode } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero08Namespace,
  secondaryHero08PrimaryCtaHref,
  secondaryHero08SecondaryCtaHref,
} from "./config";

const FEATURE_KEYS = ["billing", "reports", "security"] as const;

const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], ReactNode> = {
  billing: <Sparkles className="stroke-foreground fill-blue-500/15" />,
  reports: <SquareActivity className="stroke-foreground fill-indigo-500/15" />,
  security: <Shield className="stroke-foreground fill-emerald-500/15" />,
};

/**
 * Secondary hero — centered tagged headline + body + dual CTAs above
 * a three-column features grid (icon + heading + body) framed by
 * top + bottom dividers. Sourced from `@tailark-pro/secondary-hero-08`,
 * refactored to the project pattern: section semantics, all visible
 * strings via `blocks.secondary-hero-08.*`, primitives from
 * `ui-primitives`.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero08Namespace);

  return (
    <section aria-labelledby="secondary-hero-08-title" className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-primary bg-primary/5 border-primary/10 rounded-full border px-2 py-1 text-sm font-medium">
            {t("tag")}
          </span>
          <h1
            id="secondary-hero-08-title"
            className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
            {t("body")}
          </p>

          <Button asChild>
            <Link
              href={secondaryHero08PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
            >
              {t("primaryCta")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="ml-3">
            <Link
              href={secondaryHero08SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}
            >
              {t("secondaryCta")}
            </Link>
          </Button>

          <div className="border-border-illustration mt-20 grid gap-6 border-y py-6 text-left sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
            {FEATURE_KEYS.map((featureKey) => (
              <div key={featureKey} className="space-y-3">
                <div className="bg-card ring-border-illustration flex size-8 items-center justify-center rounded-md shadow ring-1 *:size-4">
                  {FEATURE_ICONS[featureKey]}
                </div>
                <h2 className="text-lg font-medium">
                  {t(`features.${featureKey}.title`)}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t(`features.${featureKey}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
