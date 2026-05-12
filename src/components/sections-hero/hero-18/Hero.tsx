import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui-primitives/grid-1-landing-button";
import { Container } from "@/components/ui-primitives/grid-1-landing-container";
import { useScopedT } from "@/i18n/scoped-t";
import { hero18Namespace } from "./config";
import type { HeroBlock } from "./schema";

/**
 * Grid-1 landing hero — JSX preserved verbatim against upstream's
 * inline `page.tsx` section. Bordered grid backdrop, centered
 * heading with foreground accent split, single CTA + "No credit
 * card" subtext, then a wide product mock inside the Container's
 * subtle muted frame.
 */
export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero18Namespace);
  const external = props.primary.href.startsWith("http");

  return (
    <section
      id={props.id}
      aria-labelledby={`${props.id}-heading`}
      className="bg-muted/50 relative overflow-hidden border-b [--color-border:var(--color-border-illustration)]"
    >
      <div className="relative pt-32 sm:pt-44">
        <div className="absolute inset-x-0 top-0 -bottom-8 mx-auto max-w-7xl lg:-bottom-20">
          <div className="absolute inset-x-0 inset-y-0 mx-auto max-w-7xl lg:px-6">
            <div className="absolute inset-0 inset-x-2 top-15 border-x px-2 sm:px-6 lg:inset-x-6 lg:border-t">
              <div className="absolute inset-x-2 top-0 bottom-0 border-x mask-t-from-90% sm:inset-x-6 sm:-top-15" />
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-12 text-center">
          <div className="relative mx-auto max-w-3xl text-center">
            <h1
              id={`${props.id}-heading`}
              className="text-muted-foreground text-5xl font-medium tracking-tight text-balance sm:text-6xl"
            >
              {tRoot(props.headline.firstKey)}{" "}
              <span className="text-foreground"> {tRoot(props.headline.accentKey)}</span>
            </h1>
            <p className="text-muted-foreground mt-6 mb-8 text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
            <Button
              asChild
              size="lg"
              className="border-transparent px-4 text-sm shadow-xl shadow-indigo-950/30"
            >
              <Link
                href={props.primary.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {tRoot(props.primary.labelKey)}
              </Link>
            </Button>
            <span className="text-muted-foreground mt-3 block text-center text-sm">
              {tRoot(props.subtextKey)}
            </span>
          </div>
        </div>
      </div>
      <Container className="mt-8 bg-transparent **:data-[slot=content]:py-0 sm:mt-20">
        <div className="-mx-12 px-12">
          <div className="border border-transparent bg-orange-950/5 px-6 pb-6">
            <div className="bg-background ring-foreground/5 -mt-12 overflow-hidden rounded-2xl p-1 shadow-2xl ring-1 shadow-black/7.5">
              <div className="bg-background relative origin-top border-t-4 border-l-8 border-transparent sm:aspect-3/2">
                <Image
                  fill
                  className="object-cover object-top-left"
                  src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle_un3f39.png"
                  alt={tRoot(props.imageAltKey)}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1152px"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
