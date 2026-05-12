import { Card, CardContent, CardTitle } from "@/components/ui-primitives/card";
import { TrendBadge } from "@/components/ui-molecules/trend-badge";
import { useScopedT } from "@/i18n/scoped-t";
import { stats02Items, stats02Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats02Namespace);
  const items = props.items ?? stats02Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-10">
      <h2 id={titleId} className="sr-only">
        {tr(props.titleKey, "title")}
      </h2>
      <div className="bg-border divide-border grid grid-cols-1 divide-y overflow-hidden rounded-lg md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <Card key={item.id} className="rounded-none border-0 py-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <CardTitle className="text-base font-normal">
                {t(`items.${item.id}.metric`)}
              </CardTitle>
              <div className="mt-1 flex items-baseline gap-2 md:block lg:flex">
                <div className="text-primary flex items-baseline text-2xl font-semibold tabular-nums">
                  {item.current}
                  <span className="text-muted-foreground ml-2 text-sm font-medium tabular-nums">
                    {t("fromPrevious", { previous: item.previous })}
                  </span>
                </div>
                <TrendBadge
                  direction={item.trend === "up" ? "up" : "down"}
                  delta={item.difference}
                  className="md:mt-2 lg:mt-0"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
