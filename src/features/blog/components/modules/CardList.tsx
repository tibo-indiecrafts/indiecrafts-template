import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { CardListModule } from "@/features/blog/sanity/types";
import { cn } from "@/lib/utils";
import { ModuleCta } from "./Cta";
import { portableComponents } from "./portable-text-components";

/**
 * Card list — design ported from `sections-features/features-04`: a
 * centered title block above a bordered grid where the cells share
 * hairline dividers (divide-x divide-y + outer border). Compact text
 * sizing; an image (if provided) sits above the title.
 */
const COLS: Record<number, string> = {
  1: "sm:grid-cols-1 lg:grid-cols-1",
  2: "sm:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function CardList(props: CardListModule) {
  if (!props.cards?.length) return null;
  const cols = COLS[props.columns ?? 3] ?? COLS[3];

  return (
    <section id={props.anchor} className="py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <ul
          className={cn(
            "bg-border mx-auto grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-xl",
            cols,
          )}
        >
          {props.cards.map((card) => (
            <li key={card._key} className="bg-card space-y-3 p-6 sm:p-8">
              {card.image?.asset?.url ? (
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src={card.image.asset.url}
                    alt={card.image.alt ?? card.title ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {card.title ? (
                <h3 className="text-base font-semibold">{card.title}</h3>
              ) : null}
              {card.content ? (
                <div className="prose prose-neutral dark:prose-invert prose-sm [&_p]:text-muted-foreground max-w-none [&_p]:text-sm">
                  <PortableText value={card.content} components={portableComponents} />
                </div>
              ) : null}
              {card.cta ? (
                <div className="pt-2">
                  <ModuleCta cta={card.cta} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
