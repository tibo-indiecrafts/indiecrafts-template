import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { Integrations } from "@/components/ui-illustrations/integrations";
import { useScopedT } from "@/i18n/scoped-t";
import { secondaryHero3CtaHref, secondaryHero3Namespace } from "./config";

/**
 * Secondary hero — leads with the `Integrations` illustration (brand
 * tiles on a dashed grid) and pairs it with a tagged headline + body
 * + CTA. Sourced from `@tailark-pro/secondary-hero-3`, refactored to
 * the project pattern: section semantics, all visible strings via
 * `blocks.secondary-hero-3.*`, primitives from `ui-primitives`,
 * illustration from `ui-illustrations`.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero3Namespace);

  return (
    <section aria-labelledby="secondary-hero-3-title" className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Integrations />

        <div className="mx-auto mt-20 max-w-2xl text-center">
          <span className="text-primary bg-primary/5 border-primary/10 rounded-full border px-2 py-1 text-sm font-medium">
            {t("tag")}
          </span>
          <h1
            id="secondary-hero-3-title"
            className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 mb-6 max-w-xl text-lg text-balance">
            {t("body")}
          </p>

          <Button asChild>
            <Link href={secondaryHero3CtaHref as Parameters<typeof Link>[0]["href"]}>
              {t("cta")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
