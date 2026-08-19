import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { CardListModule } from "@indiecrafts/ui-components/shared/types";
import { cn } from "@indiecrafts/utils/cn";
import { ModuleCta } from "../layout/Cta";

/**
 * Card list — design ported from `sections-features/features-04`: a
 * centered title block above a bordered grid where the cells share
 * hairline dividers (divide-x divide-y + outer border). Compact text
 * sizing; an image (if provided) sits above the title.
 */
// Column count keys off the CONTAINER width (`@container` on the wrapper below),
// not the viewport — so a card grid dropped inline in the ~768px blog column stays
// 1–2 up while the same block full-width goes 3–4 up. See DESIGN.md § Responsive.
const COLS: Record<number, string> = {
  1: "",
  2: "@2xl:grid-cols-2",
  3: "@2xl:grid-cols-2 @4xl:grid-cols-3",
  4: "@2xl:grid-cols-2 @4xl:grid-cols-4",
};

export function CardList(
  props: CardListModule & { components: PortableTextComponents },
) {
  if (!props.cards?.length) return null;
  const cols = COLS[props.columns ?? 3] ?? COLS[3];

  return (
    <section id={props.anchor} className="py-8 md:py-12">
      <div className="@container mx-auto max-w-5xl px-(--gutter)">
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
                  <PortableText
                    value={card.content}
                    components={props.components}
                  />
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
