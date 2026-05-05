import { CursorGlowPhoto } from "@/components/ui-effects/cursor-glow-photo";
import { useScopedT } from "@/i18n/scoped-t";
import { secondaryHero2BackgroundImage, secondaryHero2Namespace } from "./config";

/**
 * Secondary hero — large editorial headline + asymmetric body copy
 * over a `CursorGlowPhoto` (full-bleed photo with cursor-tracking
 * blurred overlay). Sourced from `@tailark-pro/secondary-hero-2`,
 * refactored to the project pattern: section semantics, all visible
 * strings via `blocks.secondary-hero-2.*`, effect from `ui-effects`.
 * The Tailark original applied `data-theme="quartz"` and `bg-white`;
 * we drop the unknown vendor theme attribute and let the image carry
 * the color treatment.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero2Namespace);

  return (
    <section aria-labelledby="secondary-hero-2-title" className="bg-white pt-44">
      <div className="mx-auto mb-12 max-w-5xl px-6">
        <div className="mx-auto max-w-3xl">
          <h1
            id="secondary-hero-2-title"
            className="text-5xl font-semibold text-balance sm:text-7xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-6 ml-auto max-w-md text-lg text-balance">
            {t("body")}
          </p>
        </div>
      </div>
      <CursorGlowPhoto src={secondaryHero2BackgroundImage} alt={t("title")} />
    </section>
  );
}
