import { Button } from "@/components/ui-effects/dark-landing-button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cta02Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta02Namespace);
  const primaryExternal = props.primary.href.startsWith("http");
  const secondaryExternal = props.secondary.href.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="py-20">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative mx-auto max-w-2xl text-center">
          <h2
            id={`${props.id}-heading`}
            className="text-4xl font-semibold text-balance md:text-5xl"
          >
            {tRoot(props.headline.firstKey)}{" "}
            <span className="from-foreground/50 to-foreground/95 bg-linear-to-b bg-clip-text text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
              {tRoot(props.headline.accentKey)}
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 mb-6 text-balance">
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
    </section>
  );
}
