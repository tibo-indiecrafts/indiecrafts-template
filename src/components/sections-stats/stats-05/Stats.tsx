"use client";

import { Card, CardContent, CardFooter } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats05Items, stats05Namespace } from "./config";
import type { StatsBlock } from "./schema";

/**
 * Three metric cards each with a footer drill-in link. Sourced from
 * `@blocks-so/stats-05`.
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats05Namespace);
  const items = props.items ?? stats05Items;
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
          <Card key={item.id} className="gap-0 p-0 shadow-2xs">
            <CardContent className="p-6">
              <dd className="flex items-start justify-between space-x-2">
                <span className="text-muted-foreground truncate text-sm">
                  {t(`items.${item.id}.name`)}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    item.changeType === "positive"
                      ? "text-emerald-700 dark:text-emerald-500"
                      : "text-red-700 dark:text-red-500",
                  )}
                >
                  {item.change}
                </span>
              </dd>
              <dd className="text-foreground mt-1 text-3xl font-semibold tabular-nums">
                {item.value}
              </dd>
            </CardContent>
            <CardFooter className="border-border flex justify-end border-t p-0!">
              <a
                href={item.href}
                className="text-primary hover:text-primary/90 px-6 py-3 text-sm font-medium"
              >
                {t("viewMore")}
              </a>
            </CardFooter>
          </Card>
        ))}
      </dl>
    </section>
  );
}
