import type { ComponentType } from "react";
import { ChartIllustration } from "@/components/ui-illustrations/chart-illustration";
import { InvoiceIllustration } from "@/components/ui-illustrations/invoice-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features13Namespace } from "./config";
import type { FeaturesBlock, FeaturesIllustration } from "./schema";

const ILLUSTRATIONS: Record<FeaturesIllustration, ComponentType> = {
  chart: ChartIllustration,
  invoice: InvoiceIllustration,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features13Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="bg-background @container py-24"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
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
        <div className="ring-border bg-card/50 relative grid overflow-hidden rounded-2xl border border-transparent shadow-md ring-1 shadow-black/5 @max-4xl:divide-y @4xl:grid-cols-2 @4xl:divide-x">
          {props.items.map((item, i) => {
            const Illustration = ILLUSTRATIONS[item.illustration];
            const isInvoice = item.illustration === "invoice";
            return (
              <div key={i} className="row-span-2 grid grid-rows-subgrid gap-8">
                <div className={isInvoice ? "relative z-10 px-8 pt-8" : "px-8 pt-8"}>
                  <h3 className="font-semibold text-balance">{tRoot(item.titleKey)}</h3>
                  <p className="text-muted-foreground mt-3">{tRoot(item.bodyKey)}</p>
                </div>
                <div className={isInvoice ? "self-end px-8 pb-8" : "self-end pb-4"}>
                  <Illustration />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
