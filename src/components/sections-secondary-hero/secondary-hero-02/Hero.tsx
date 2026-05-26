import { CursorGlowPhoto } from "@/components/ui-effects/cursor-glow-photo";
import { useScopedT } from "@/components/_lib/scoped-t";
import { secondaryHero02BackgroundImage, secondaryHero02Namespace } from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero02Namespace);

  return (
    <section aria-labelledby="secondary-hero-02-title" className="bg-white pt-44">
      <div className="mx-auto mb-12 max-w-5xl px-6">
        <div className="mx-auto max-w-3xl">
          <h1
            id="secondary-hero-02-title"
            className="text-5xl font-semibold text-balance sm:text-7xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-6 ml-auto max-w-md text-lg text-balance">
            {t("body")}
          </p>
        </div>
      </div>
      <CursorGlowPhoto src={secondaryHero02BackgroundImage} alt={t("title")} />
    </section>
  );
}
