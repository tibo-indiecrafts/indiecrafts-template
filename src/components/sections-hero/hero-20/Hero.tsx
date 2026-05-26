import Link from "next/link";
import { Button } from "@/components/ui-effects/libre-landing-button";
import { HeroIllustration } from "@/components/ui-illustrations/hero-illustration-02";
import { useScopedT } from "@/components/_lib/scoped-t";
import { hero20Namespace } from "./config";
import type { HeroBlock } from "./schema";

export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero20Namespace);
  const external = props.primary.href.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="bg-muted pt-32 lg:pt-44">
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
          <div className="text-center">
            <h1
              id={`${props.id}-heading`}
              className="text-foreground mx-auto text-5xl font-semibold text-balance lg:text-6xl xl:tracking-tight"
            >
              {tRoot(props.headline.firstKey)}{" "}
              <span>{tRoot(props.headline.accentKey)}</span>{" "}
              {tRoot(props.headline.restKey)}
            </h1>

            <div className="mx-auto mt-4 mb-20 max-w-lg">
              <p className="text-muted-foreground mb-6 text-lg text-balance lg:text-xl">
                {tRoot(props.bodyKey)}
              </p>

              <div className="bg-foreground/5 ring-border-illustration mx-auto w-fit rounded-lg p-1 ring-1">
                <Button asChild className="[--color-primary:var(--color-indigo-500)]">
                  <Link
                    href={props.primary.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {tRoot(props.primary.labelKey)}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
