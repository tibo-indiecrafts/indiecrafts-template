import { ScrollRevealImage } from "@/components/ui-effects/scroll-reveal-image";
import { useScopedT } from "@/i18n/scoped-t";
import { secondaryHero11BackgroundImage, secondaryHero11Namespace } from "./config";

/**
 * Secondary hero — full-width editorial layout. Headline above + body
 * paragraphs in a 2-column grid below, separated by the
 * `ScrollRevealImage` (clip + zoom on scroll). Sourced from
 * `@tailark-pro/secondary-hero-11`, refactored to the project pattern:
 * section semantics, all visible strings via
 * `blocks.secondary-hero-11.*` (paragraphs use ICU rich text via `tr`
 * to render `<strong>` runs), effect from
 * `ui-effects/scroll-reveal-image`. The Tailark original calls this
 * an "ImageIllustration" but it's a scroll-driven animation — fits
 * the effects bucket, not illustrations.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero11Namespace);

  const richBoldStrong = {
    strong: (chunks: React.ReactNode) => (
      <strong className="text-foreground font-semibold">{chunks}</strong>
    ),
  };

  return (
    <section aria-labelledby="secondary-hero-11-title">
      <div className="pt-56 pb-56 lg:pt-96">
        <div className="mx-auto mb-8 max-w-6xl px-6 lg:mb-12 lg:px-12">
          <h1
            id="secondary-hero-11-title"
            className="text-4xl font-semibold text-balance md:text-5xl"
          >
            {t("title")}
          </h1>
        </div>
        <ScrollRevealImage src={secondaryHero11BackgroundImage} alt={t("imageAlt")} />
        <div className="mx-auto mt-8 max-w-6xl px-6 lg:mt-12 lg:px-12">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <p className="text-muted-foreground">
              {t.rich("body.first", richBoldStrong)}
            </p>
            <p className="text-muted-foreground">
              {t.rich("body.second", richBoldStrong)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
