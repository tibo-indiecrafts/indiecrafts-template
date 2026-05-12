"use client";

import { Card, CardContent } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats03Items, stats03Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats03Namespace);
  const items = props.items ?? stats03Items;
  const titleId = `${props.id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex w-full items-center justify-center p-10"
    >
      <h2 id={titleId} className="sr-only">
        {tr(props.titleKey, "title")}
      </h2>
      <dl className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} className="p-6 py-4 shadow-2xs">
            <CardContent className="p-0">
              <dt className="text-muted-foreground text-sm font-medium">
                {t(`items.${item.id}.name`)}
              </dt>
              <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-foreground text-3xl font-semibold tabular-nums">
                  {item.stat}
                </span>
                <span
                  className={cn(
                    item.changeType === "positive"
                      ? "text-green-800 dark:text-green-400"
                      : "text-red-800 dark:text-red-400",
                    "text-sm font-medium",
                  )}
                >
                  {item.change}
                </span>
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
    </section>
  );
}
