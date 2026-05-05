import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { MapCirclesIllustration } from "@/components/ui-illustrations/map-circles-illustration";
import { MonitoringChartIllustration } from "@/components/ui-illustrations/monitoring-chart-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento14Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento14Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid border *:p-8 @3xl:grid-cols-6 @3xl:*:p-12">
          <div className="row-span-2 grid grid-rows-subgrid gap-8 @max-3xl:border-b @3xl:col-span-2 @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.currencyCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.currencyCell.bodyKey)}
              </p>
            </div>
            <div className="space-y-6">
              <CurrencyIllustration />
              <span className="text-muted-foreground text-sm">
                {tRoot(props.currencyCell.metaLabelKey)}
              </span>
            </div>
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 @3xl:col-span-4 @3xl:gap-12">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.mapCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.mapCell.bodyKey)}
              </p>
            </div>
            <MapCirclesIllustration />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:col-span-4 @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.monitoringCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.monitoringCell.bodyKey)}
              </p>
            </div>
            <MonitoringChartIllustration />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:col-span-2 @3xl:gap-12">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.documentsCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.documentsCell.bodyKey)}
              </p>
            </div>
            <div className="relative flex flex-wrap gap-4">
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
