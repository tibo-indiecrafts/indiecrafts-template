import type { ComponentType } from "react";
import { IntegrationsIllustration } from "@/components/ui-illustrations/integrations-illustration";
import { InvoiceIllustration } from "@/components/ui-illustrations/invoice-illustration";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { features25Namespace } from "./config";
import type { CardIllustration, FeaturesBlock } from "./schema";

const ILLUSTRATIONS: Record<CardIllustration, ComponentType> = {
  invoice: InvoiceIllustration,
  integrations: IntegrationsIllustration,
  map: MapIllustration,
  visualization: VisualizationIllustration,
};

const ILLUSTRATION_WRAPPER: Record<CardIllustration, string> = {
  invoice: "max-w-84 mx-auto w-full self-center",
  integrations: "@4xl:px-8 mx-auto max-w-sm self-center",
  map: "mask-radial-from-35% relative -mx-8 self-center [--color-background:transparent]",
  visualization: "@4xl:px-8 mx-auto w-full max-w-md self-center",
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features25Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="bg-background @container py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter) xl:px-0">
        {props.titleKey ? (
          <div className="mb-12 text-center">
            <h2
              id={`${props.id}-title`}
              className="text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
            {props.bodyKey ? (
              <p className="text-muted-foreground mt-4">{tr(props.bodyKey, "body")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

          <div className="border-foreground/10 divide-foreground/10 relative grid grid-cols-2 overflow-hidden border *:p-8 *:nth-3:border-r @max-3xl:*:nth-[1n+1]:nth-[-n+6]:border-b @3xl:grid-cols-4 @3xl:*:first:border-r @3xl:*:nth-6:border-r @3xl:*:nth-[1n+1]:nth-[-n+5]:border-b @3xl:*:nth-[1n+3]:nth-[-n+4]:border-r">
            {/* Top two illustrated cards (invoice, integrations) */}
            <IllustratedCard
              card={props.cards[0]}
              tRoot={tRoot}
              ILLUSTRATIONS={ILLUSTRATIONS}
            />
            <IllustratedCard
              card={props.cards[1]}
              tRoot={tRoot}
              ILLUSTRATIONS={ILLUSTRATIONS}
              withInteriorPlus
            />

            {/* KPI cells */}
            {props.kpis.map((kpi, i) => (
              <div
                key={i}
                className="hover:bg-card flex flex-col items-center justify-center space-y-1 text-center md:text-center @max-2xl:p-4"
              >
                <div className="text-foreground text-4xl font-bold">
                  {tRoot(kpi.valueKey)}
                </div>
                <p className="text-muted-foreground">{tRoot(kpi.labelKey)}</p>
              </div>
            ))}

            {/* Testimonial */}
            <div className="hover:bg-card relative col-span-2 @max-2xl:col-span-full @max-2xl:p-4">
              <PlusDecorator className="bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />
              <blockquote className="before:bg-primary relative max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
                <p className="text-foreground">{tRoot(props.testimonial.quoteKey)}</p>
                <footer className="mt-4 flex items-center gap-2">
                  <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                    <AvatarImage
                      src={props.testimonial.authorAvatarUrl}
                      alt={tRoot(props.testimonial.authorNameKey)}
                    />
                    <AvatarFallback>
                      {tRoot(props.testimonial.authorInitialsKey)}
                    </AvatarFallback>
                  </Avatar>
                  <cite>{tRoot(props.testimonial.authorNameKey)}</cite>
                  <span aria-hidden className="bg-foreground/15 size-1 rounded-full" />
                  <span className="text-muted-foreground">
                    {tRoot(props.testimonial.authorRoleKey)}
                  </span>
                </footer>
              </blockquote>
            </div>

            {/* Bottom two illustrated cards (map, visualization) */}
            <IllustratedCard
              card={props.cards[2]}
              tRoot={tRoot}
              ILLUSTRATIONS={ILLUSTRATIONS}
            />
            <IllustratedCard
              card={props.cards[3]}
              tRoot={tRoot}
              ILLUSTRATIONS={ILLUSTRATIONS}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type IllustratedCardProps = Readonly<{
  card: {
    illustration: CardIllustration;
    titleKey: import("@/types/messages").MessageKey;
    bodyKey: import("@/types/messages").MessageKey;
  };
  tRoot: ReturnType<typeof useScopedT>[2];
  ILLUSTRATIONS: typeof ILLUSTRATIONS;
  withInteriorPlus?: boolean;
}>;

function IllustratedCard({
  card,
  tRoot,
  ILLUSTRATIONS,
  withInteriorPlus,
}: IllustratedCardProps) {
  const Illustration = ILLUSTRATIONS[card.illustration];
  return (
    <div
      className={cn(
        "col-span-2 row-span-2 grid grid-rows-subgrid gap-8 p-8",
        withInteriorPlus && "relative",
      )}
    >
      {withInteriorPlus ? (
        <PlusDecorator className="bottom-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />
      ) : null}
      <div className={ILLUSTRATION_WRAPPER[card.illustration]}>
        <Illustration />
      </div>
      <div
        className={cn(
          "mx-auto max-w-sm text-center",
          withInteriorPlus && "relative z-10",
        )}
      >
        <h3 className="font-semibold text-balance">{tRoot(card.titleKey)}</h3>
        <p className="text-muted-foreground mt-3 text-balance">{tRoot(card.bodyKey)}</p>
      </div>
    </div>
  );
}

function PlusDecorator({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      aria-hidden
      className={cn(
        "before:bg-foreground/25 after:bg-foreground/25 absolute size-3 mask-radial-from-15% before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px",
        className,
      )}
    />
  );
}
