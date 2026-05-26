"use client";

import { Card, CardContent } from "@/components/ui-primitives/card";
import { TrendBadge } from "@/components/ui-molecules/widget/trend-badge";
import { useScopedT } from "@/components/_lib/scoped-t";
import { stats04Items, stats04Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats04Namespace);
  const items = props.items ?? stats04Items;
  const titleId = `${props.id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex w-full items-center justify-center p-10"
    >
      <h2 id={titleId} className="sr-only">
        {tr(props.titleKey, "title")}
      </h2>
      <dl className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="w-full p-6 py-4 shadow-2xs">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground text-sm font-medium">
                  {t(`items.${item.id}.name`)}
                </dt>
                <TrendBadge
                  direction={item.changeType === "positive" ? "up" : "down"}
                  delta={item.change}
                />
              </div>
              <dd className="text-foreground mt-2 text-3xl font-semibold tabular-nums">
                {item.stat}
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
    </section>
  );
}
