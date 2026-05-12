import { Button } from "@/components/ui-primitives/dark-landing-button";
import { HeroIllustration } from "@/components/ui-illustrations/dark-landing-hero-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { hero17Namespace } from "./config";
import type { HeroBlock } from "./schema";

/**
 * Hero — typography + dual CTAs + dashboard product mock below.
 * Constellation backdrop omitted (theme-neutral); renders in
 * either light or dark mode via surrounding theme.
 */
export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero17Namespace);
  const primaryExternal = props.primary.href.startsWith("http");
  const secondaryExternal = props.secondary.href.startsWith("http");
  const firstSuffix = props.headline.firstSuffixKey
    ? tRoot(props.headline.firstSuffixKey)
    : null;

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background relative overflow-hidden"
    >
      <div className="pt-24 pb-20 md:pt-32 lg:pt-48">
        <div className="relative z-10 mx-auto grid max-w-5xl items-end gap-4 px-6">
          <div>
            <h1
              id={`${props.id}-heading`}
              className="text-5xl font-semibold text-balance md:max-w-4xl lg:text-6xl"
            >
              {tRoot(props.headline.firstKey)}{" "}
              {firstSuffix ? <span className="max-md:hidden">{firstSuffix} </span> : null}
              {tRoot(props.headline.middleKey)}{" "}
              <span className="from-foreground/50 to-foreground/95 bg-linear-to-b bg-clip-text text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
                {tRoot(props.headline.accentKey)}
              </span>
            </h1>
          </div>
          <div className="max-w-lg">
            <p className="text-muted-foreground mb-6 text-lg text-balance lg:text-xl">
              {tRoot(props.bodyKey)}
            </p>
            <Button asChild size="sm">
              <a
                href={props.primary.href}
                target={primaryExternal ? "_blank" : undefined}
                rel={primaryExternal ? "noopener noreferrer" : undefined}
              >
                {tRoot(props.primary.labelKey)}
              </a>
            </Button>
            <Button
              asChild
              className="bg-foreground/10 ring-foreground/20 hover:bg-foreground/15 ml-3 backdrop-blur"
              variant="outline"
              size="sm"
            >
              <a
                href={props.secondary.href}
                target={secondaryExternal ? "_blank" : undefined}
                rel={secondaryExternal ? "noopener noreferrer" : undefined}
              >
                {tRoot(props.secondary.labelKey)}
              </a>
            </Button>
          </div>
        </div>
        <HeroIllustration />
      </div>
    </section>
  );
}
