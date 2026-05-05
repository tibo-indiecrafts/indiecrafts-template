import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { PaymentsDiagram } from "@/components/ui-illustrations/payments-diagram";
import { Shield, Sparkles, SquareActivity } from "lucide-react";
import type { ReactNode } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import { hero16CtaHref, hero16Namespace } from "./config";

const FEATURE_KEYS = ["billing", "reports", "security"] as const;

const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], ReactNode> = {
  billing: <Sparkles className="stroke-foreground fill-blue-500/15" />,
  reports: <SquareActivity className="stroke-foreground fill-indigo-500/15" />,
  security: <Shield className="stroke-foreground fill-emerald-500/15" />,
};

/**
 * Centered headline + body + framed CTA, paired with the wide
 * `PaymentsDiagram` illustration (animated SVG beams connecting mock
 * UI panels) and a 3-column features row. Sourced from
 * `@tailark-pro/hero-section-16`, refactored to the project pattern:
 * section semantics (no `<main>` — that's the layout's job), all
 * visible strings via `blocks.hero-16.*`, primitives from
 * `ui-primitives`, illustration from `ui-illustrations`. The CTA
 * pill's wrapper uses `--color-border-illustration` for its soft ring.
 */
export function Hero() {
  const [t] = useScopedT(hero16Namespace);

  return (
    <section aria-labelledby="hero-16-title" className="overflow-hidden">
      <div className="bg-background pt-32 lg:pt-44">
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
          <div className="text-center">
            <h1
              id="hero-16-title"
              className="text-foreground mx-auto text-5xl font-semibold text-balance lg:text-6xl xl:text-7xl xl:tracking-tight"
            >
              {t("title.first")} <span>{t("title.accent")}</span> {t("title.rest")}
            </h1>

            <div className="mx-auto mt-4 mb-20 max-w-lg">
              <p className="text-muted-foreground mb-6 text-lg text-balance lg:text-xl">
                {t("body")}
              </p>

              <div className="bg-foreground/5 ring-border-illustration mx-auto w-fit rounded-lg p-1 ring-1">
                <Button asChild className="[--color-primary:var(--color-indigo-500)]">
                  <Link href={hero16CtaHref as Parameters<typeof Link>[0]["href"]}>
                    {t("cta")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <PaymentsDiagram />
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 lg:px-12">
        <div className="grid gap-6 pt-12 text-left sm:grid-cols-2 md:grid-cols-3 lg:gap-12 lg:px-12">
          {FEATURE_KEYS.map((featureKey) => (
            <div key={featureKey} className="space-y-3">
              <div className="bg-card ring-border flex size-8 items-center justify-center rounded-md shadow ring-1 *:size-4">
                {FEATURE_ICONS[featureKey]}
              </div>
              <h2 className="text-lg font-medium">{t(`features.${featureKey}.title`)}</h2>
              <p className="text-muted-foreground text-sm">
                {t(`features.${featureKey}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
