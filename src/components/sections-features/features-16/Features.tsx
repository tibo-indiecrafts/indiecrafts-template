import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { InvoiceIllustration } from "@/components/ui-illustrations/invoice-illustration";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features16Namespace } from "./config";
import type { FeaturesBlock, FeaturesIllustration, StatIcon } from "./schema";

const ILLUSTRATIONS: Record<FeaturesIllustration, ComponentType> = {
  invoice: InvoiceIllustration,
  visualization: VisualizationIllustration,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features16Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="bg-background py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
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

        <div className="grid max-md:divide-y md:grid-cols-2 md:divide-x">
          {props.cards.map((card, i) => {
            const Illustration = ILLUSTRATIONS[card.illustration];
            const isFirst = i === 0;
            return (
              <div
                key={i}
                className={
                  isFirst
                    ? "row-span-2 grid grid-rows-subgrid gap-8 pb-12 md:pr-12"
                    : "row-span-2 grid grid-rows-subgrid gap-8 pb-12 max-md:pt-12 md:pl-12"
                }
              >
                <div>
                  <h3 className="text-foreground text-xl font-semibold">
                    {tRoot(card.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-lg">
                    {tRoot(card.bodyKey)}
                  </p>
                </div>
                <Illustration />
              </div>
            );
          })}
        </div>

        <div className="relative grid grid-cols-2 gap-x-3 gap-y-6 border-t pt-12 sm:gap-6 lg:grid-cols-4">
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
    </section>
  );
}
