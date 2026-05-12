import { ProductPrompt } from "@/components/ui-illustrations/product-prompt";
import { useScopedT } from "@/i18n/scoped-t";
import { hero10Namespace } from "./config";

export function Hero() {
  const [t] = useScopedT(hero10Namespace);

  return (
    <section
      aria-labelledby="hero-10-title"
      className="bg-background relative overflow-hidden py-32 md:py-44 lg:py-52"
    >
      <div className="relative z-30 mx-auto max-w-5xl px-6 text-center">
        <h1
          id="hero-10-title"
          className="mx-auto max-w-3xl text-4xl font-semibold text-balance sm:text-5xl"
        >
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 mb-7 max-w-xl text-xl text-balance">
          {t("body")}
        </p>
        <ProductPrompt />
      </div>
    </section>
  );
}
