import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { AspectRatio } from "@/components/ui-primitives/aspect-ratio";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { content18Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-semibold">{chunks}</strong>
  ),
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content18Namespace);
  const readMoreLabel = tRoot(props.readMoreLabelKey);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id={`${props.id}-heading`}
          className="text-muted-foreground text-4xl font-semibold text-balance md:w-2/3"
        >
          {tRoot.rich(props.titleKey, RICH_STRONG)}
        </h2>
        <div className="mt-12 grid gap-6 @xl:grid-cols-2 @3xl:grid-cols-3">
          {props.cards.map((card, index) => {
            const external = card.href.startsWith("http");
            return (
              <div key={index} className="row-span-4 grid grid-rows-subgrid gap-4">
                <AspectRatio
                  ratio={1 / 1}
                  className={cn(
                    "ring-border rounded-xl border border-transparent shadow ring-1",
                    card.variant === "padded" ? "bg-white p-6" : "bg-card",
                  )}
                >
                  <Image
                    src={card.image.src}
                    alt={tRoot(card.image.altKey)}
                    width={card.image.width}
                    height={card.image.height}
                    className={cn(
                      "size-full object-cover",
                      card.variant === "padded" ? "aspect-square" : "rounded-xl",
                    )}
                  />
                </AspectRatio>
                <h3 className="text-muted-foreground text-sm">
                  {tRoot(card.headingKey)}
                </h3>
                <p className="text-muted-foreground">
                  {tRoot.rich(card.bodyKey, RICH_STRONG)}
                </p>
                <a
                  href={card.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="text-primary hover:text-foreground flex items-center gap-1 text-sm transition-colors duration-200"
                >
                  {readMoreLabel}
                  <ChevronRight className="size-3.5 translate-y-px" aria-hidden="true" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
