import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { Chat } from "@/components/ui-illustrations/chat";
import { useScopedT } from "@/i18n/scoped-t";
import { secondaryHero01CtaHref, secondaryHero01Namespace } from "./config";

/**
 * Secondary hero — sits below a primary hero, leads with the animated
 * `Chat` illustration (typewriter response + source citations) and
 * pairs it with a tagged headline + body + CTA. Sourced from
 * `@tailark-pro/secondary-hero-01`, refactored to the project pattern:
 * section semantics, all visible strings via `blocks.secondary-hero-01.*`,
 * primitives from `ui-primitives`, illustration from `ui-illustrations`.
 */
export function Hero() {
  const [t] = useScopedT(secondaryHero01Namespace);

  return (
    <section
      aria-labelledby="secondary-hero-01-title"
      className="to-background bg-linear-to-b pt-24 pb-36"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <Chat />
        </div>
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <span className="text-primary bg-primary/5 border-primary/10 rounded-full border px-2 py-1 text-sm font-medium">
            {t("tag")}
          </span>
          <h1
            id="secondary-hero-01-title"
            className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 mb-6 max-w-md text-lg text-balance">
            {t("body")}
          </p>

          <Button asChild>
            <Link href={secondaryHero01CtaHref as Parameters<typeof Link>[0]["href"]}>
              {t("cta")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
