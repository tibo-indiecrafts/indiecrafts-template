import { ProductPrompt } from "@/components/ui-illustrations/product-prompt";
import { useScopedT } from "@/i18n/scoped-t";
import { hero10Namespace } from "./config";

/**
 * Minimal centered hero — headline + body + AI prompt-input mock.
 * Sourced from `@tailark-pro/hero-section-10`, refactored to the
 * project pattern: section semantics (no `<main>` — that's the
 * layout's job), all visible strings via `blocks.hero-10.*`, prompt
 * illustration from `ui-illustrations`. The original Tailark file
 * shipped a self-contained `PromptInput` + `Suggestion` pair under
 * `src/components/`; we extracted the entire prompt mock into
 * `ui-illustrations/product-prompt.tsx` to keep the section thin and
 * to avoid colliding with the project's richer
 * `ui-molecules/ai/prompt-input/` molecule.
 */
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
