import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui-primitives/libre-landing-two-button";
import { useScopedT } from "@/i18n/scoped-t";
import { hero21Namespace } from "./config";
import type { HeroBlock } from "./schema";

/**
 * Tailark Pro `libre-landing-two` hero — JSX verbatim. Centered
 * title + body + dual CTAs, with an elaborate decorative
 * frame-with-corner-dots wrapper around the product screenshot.
 */
export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero21Namespace);
  const primaryExternal = props.primary.href.startsWith("http");
  const secondaryExternal = props.secondary.href.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="from-background relative overflow-hidden bg-linear-to-b pt-32 sm:pt-48">
        <div className="relative mx-auto max-w-5xl">
          <div className="pb-12 text-center">
            <h1
              id={`${props.id}-heading`}
              className="mx-auto max-w-4xl text-5xl font-medium tracking-tight text-balance max-lg:font-semibold md:text-6xl"
            >
              {tRoot(props.titleKey)}
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 mb-8 max-w-2xl text-lg text-balance max-md:mx-auto lg:text-xl">
              {tRoot(props.bodyKey)}
            </p>

            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link
                  href={props.primary.href}
                  target={primaryExternal ? "_blank" : undefined}
                  rel={primaryExternal ? "noopener noreferrer" : undefined}
                >
                  {tRoot(props.primary.labelKey)}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href={props.secondary.href}
                  target={secondaryExternal ? "_blank" : undefined}
                  rel={secondaryExternal ? "noopener noreferrer" : undefined}
                >
                  {tRoot(props.secondary.labelKey)}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="relative mb-32">
            <div
              aria-hidden
              className="bg-foreground/1 border-background ring-border absolute inset-x-0 -top-4 -bottom-10 mx-auto grid max-w-280 grid-cols-[auto_1fr] gap-3 border p-6 ring *:border sm:-top-6 sm:-bottom-12"
            >
              <div className="bg-foreground/5 absolute top-2 left-2 size-3.5 rounded-full border-transparent p-0.5">
                <div className="bg-card ring-foreground/10 size-full rounded-full p-px shadow ring">
                  <div className="bg-foreground/20 size-full scale-75 rounded-xs [corner-shape:notch]" />
                </div>
              </div>
              <div className="bg-foreground/5 absolute top-2 right-2 size-3.5 rounded-full border-transparent p-0.5">
                <div className="bg-card ring-foreground/10 size-full rounded-full p-px shadow ring">
                  <div className="bg-foreground/20 size-full scale-75 rounded-xs [corner-shape:notch]" />
                </div>
              </div>

              <div className="bg-foreground/5 absolute bottom-2 left-2 size-3.5 rounded-full border-transparent p-0.5">
                <div className="bg-card ring-foreground/10 size-full rounded-full p-px shadow ring">
                  <div className="bg-foreground/20 size-full scale-75 rounded-xs [corner-shape:notch]" />
                </div>
              </div>
              <div className="bg-foreground/5 absolute right-2 bottom-2 size-3.5 rounded-full border-transparent p-0.5">
                <div className="bg-card ring-foreground/10 size-full rounded-full p-px shadow ring">
                  <div className="bg-foreground/20 size-full scale-75 rounded-xs [corner-shape:notch]" />
                </div>
              </div>

              <div className="ring-border border-background w-22 rounded-md ring [corner-shape:bevel] sm:w-51" />
              <div className="ring-border border-background rounded-md ring [corner-shape:bevel]" />
            </div>

            <div className="pointer-events-none relative h-full pt-6 pl-2 max-sm:pr-2 lg:px-12">
              <div className="bg-card ring-foreground/10 border-background mx-auto overflow-hidden rounded-xl border p-1 pl-2.5 shadow-lg ring-1 shadow-black/5 lg:max-w-5xl">
                <div className="relative aspect-3/2 min-w-xl origin-top overflow-hidden rounded-lg sm:min-w-4xl">
                  <Image
                    className="size-full object-cover object-top-left"
                    src="https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle_un3f39.png"
                    alt={tRoot(props.imageAltKey)}
                    width={2880}
                    height={1920}
                    sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
