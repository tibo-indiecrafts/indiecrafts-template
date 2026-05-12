import { CursorGlowPhoto } from "@/components/ui-effects/cursor-glow-photo";
import { useScopedT } from "@/i18n/scoped-t";
import { secondaryHero04BackgroundImage, secondaryHero04Namespace } from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero04Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-04-title"
      className="bg-white py-24 md:pt-32 lg:pt-44"
    >
      <div className="mx-auto mb-12 max-w-5xl px-6">
        <CursorGlowPhoto
          src={secondaryHero04BackgroundImage}
          alt={t("title")}
          className="aspect-63/30"
          glowClassName="-translate-x-[150%] -translate-y-full"
        />
        <div className="relative mt-6 grid items-end gap-6 md:-mt-12 md:grid-cols-2">
          <h1
            id="secondary-hero-04-title"
            className="text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg text-balance">{t("body")}</p>
        </div>
      </div>
    </section>
  );
}
