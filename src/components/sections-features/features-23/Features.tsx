import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { IntegrationsIllustration } from "@/components/ui-illustrations/integrations-illustration";
import { InvoiceIllustration } from "@/components/ui-illustrations/invoice-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { features23Namespace } from "./config";
import type { CardIllustration, FeaturesBlock, StatIcon } from "./schema";

const ILLUSTRATIONS: Record<CardIllustration, ComponentType> = {
  invoice: InvoiceIllustration,
  integrations: IntegrationsIllustration,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features23Namespace);

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

          <div className="border-foreground/10 divide-foreground/10 relative grid grid-cols-2 divide-x divide-y overflow-hidden border *:p-4 *:nth-1:border-b! *:nth-2:border-r-0 @max-4xl:*:first:border-r-0 @max-4xl:*:nth-4:border-r-0 @max-4xl:*:nth-5:border-b-0 @4xl:grid-cols-4 @4xl:*:p-8 @4xl:*:not-nth-2:border-b-0">
            {props.cards.map((card, i) => {
              const Illustration = ILLUSTRATIONS[card.illustration];
              const isSecond = i === 1;
              return (
                <div
                  key={i}
                  className={cn(
                    "col-span-full row-span-2 grid grid-rows-subgrid gap-8 !p-8 @4xl:col-span-2",
                    isSecond && "relative",
                  )}
                >
                  {isSecond ? (
                    <PlusDecorator className="bottom-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />
                  ) : null}
                  <div
                    className={
                      card.illustration === "integrations"
                        ? "mx-auto max-w-sm self-center @4xl:px-8"
                        : "mx-auto w-full max-w-84 self-center"
                    }
                  >
                    <Illustration />
                  </div>
                  <div
                    className={cn(
                      "mx-auto max-w-sm text-center",
                      isSecond && "relative z-10",
                    )}
                  >
                    <h3 className="font-semibold text-balance">{tRoot(card.titleKey)}</h3>
                    <p className="text-muted-foreground mt-3">{tRoot(card.bodyKey)}</p>
                  </div>
                </div>
              );
            })}

            {props.stats.map((stat, i) => {
              const Icon = STAT_ICONS[stat.iconKey];
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="text-foreground size-4" aria-hidden="true" />
                    <h3 className="text-sm font-medium">{tRoot(stat.titleKey)}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{tRoot(stat.bodyKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
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
