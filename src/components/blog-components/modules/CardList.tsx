import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { CardListModule } from "@/sanity/types";
import { cn } from "@/lib/utils";
import { ModuleCta } from "./Cta";
import { portableComponents } from "./portable-text-components";

const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function CardList(props: CardListModule) {
  if (!props.cards?.length) return null;
  const cols = COLS[props.columns ?? 3] ?? COLS[3];

  return (
    <section
      id={props.anchor}
      aria-labelledby={props.title ? `${props.anchor ?? "cards"}-title` : undefined}
      className="mx-auto max-w-6xl px-(--gutter) py-12 md:py-20"
    >
      {props.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id={`${props.anchor ?? "cards"}-title`}
            className="text-3xl font-semibold md:text-4xl"
          >
            {props.title}
          </h2>
          {props.intro ? (
            <p className="text-muted-foreground mt-3">{props.intro}</p>
          ) : null}
        </header>
      ) : null}
      <ul className={cn("mt-10 grid gap-6", cols)}>
        {props.cards.map((card) => (
          <li
            key={card._key}
            className="bg-card ring-border/60 flex flex-col gap-3 rounded-xl p-6 ring-1"
          >
            {card.image?.asset?.url ? (
              <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={card.image.asset.url}
                  alt={card.image.alt ?? card.title ?? ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            {card.title ? <h3 className="text-lg font-semibold">{card.title}</h3> : null}
            {card.content ? (
              <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
                <PortableText value={card.content} components={portableComponents} />
              </div>
            ) : null}
            {card.cta ? (
              <div className="mt-auto pt-2">
                <ModuleCta cta={card.cta} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
