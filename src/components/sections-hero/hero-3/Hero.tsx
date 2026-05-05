import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { LogoCloud1Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-1";
import { ProductIllustration } from "@/components/ui-illustrations/product-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { hero3CtaHref, hero3Namespace } from "./config";

/**
 * Centered headline + primary CTA, framed by a bordered "browser
 * window" carrying the dashboard mock illustration, with a brand
 * `LogoCloud` underneath. Sourced from `@tailark-pro/hero-section-3`,
 * refactored to the project pattern: section semantics (no `<main>` —
 * that's the layout's job), all visible strings via `blocks.hero-3.*`,
 * primitives from `ui-primitives`, illustration from
 * `ui-illustrations`, logo cloud from `ui-molecules`.
 */
export function Hero() {
  const [t] = useScopedT(hero3Namespace);

  return (
    <section aria-labelledby="hero-3-title" className="bg-background">
      <div className="mx-auto max-w-5xl px-(--gutter) pt-32 text-center">
        <div className="relative mx-auto max-w-3xl text-center">
          <h1
            id="hero-3-title"
            className="text-foreground text-4xl font-semibold text-balance sm:mt-12 sm:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-4 mb-8 text-lg text-balance">
            {t("body")}
          </p>
          <Button asChild size="lg" className="px-4 text-sm">
            <Link href={hero3CtaHref as Parameters<typeof Link>[0]["href"]}>
              {t("cta")}
            </Link>
          </Button>
          <span className="text-muted-foreground mt-3 block text-center text-sm">
            {t("footnote")}
          </span>
        </div>
      </div>
      <div className="border-foreground/10 relative mt-8 border-y sm:mt-16">
        <div className="relative z-10 mx-auto max-w-6xl border-x px-3">
          <div className="bg-card relative overflow-hidden border-x shadow-md shadow-black/6.5">
            <div
              aria-hidden
              className="h-3 w-full bg-[repeating-linear-gradient(-90deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
            />
            <div className="relative overflow-hidden">
              <ProductIllustration />
            </div>
          </div>
        </div>
      </div>
      <LogoCloud />
    </section>
  );
}
