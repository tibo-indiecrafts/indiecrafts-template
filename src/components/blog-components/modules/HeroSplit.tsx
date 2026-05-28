import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { HeroSplitModule } from "@/sanity/types";
import { cn } from "@/lib/utils";
import { ModuleCta } from "./Cta";
import { portableComponents } from "./portable-text-components";

export function HeroSplit(props: HeroSplitModule) {
  const imageRight = (props.imagePosition ?? "right") === "right";
  return (
    <section id={props.anchor} className="mx-auto max-w-6xl px-(--gutter) py-16 md:py-24">
      <div
        className={cn(
          "grid items-center gap-10 md:grid-cols-2",
          imageRight ? "md:[&>*:first-child]:order-1" : "md:[&>*:first-child]:order-2",
        )}
      >
        <div className="flex flex-col gap-4">
          {props.eyebrow ? (
            <p className="text-brand text-sm font-medium tracking-wide uppercase">
              {props.eyebrow}
            </p>
          ) : null}
          {props.title ? (
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              {props.title}
            </h1>
          ) : null}
          {props.content ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <PortableText value={props.content} components={portableComponents} />
            </div>
          ) : null}
          {props.ctas?.length ? (
            <div className="mt-2 flex flex-wrap gap-3">
              {props.ctas.map((cta, i) => (
                // CTAs don't carry a `_key` after the LINK_FRAGMENT projection.
                // Compose a stable id from href + label; fall back to position
                // when both are missing (in which case `ModuleCta` renders null
                // anyway, so the duplicate-key risk is theoretical).
                <ModuleCta
                  key={`${cta.link?.href ?? ""}-${cta.link?.label ?? ""}-${i}`}
                  cta={cta}
                />
              ))}
            </div>
          ) : null}
        </div>

        {props.image?.asset?.url ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={props.image.asset.url}
              alt={props.image.alt ?? props.title ?? ""}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
