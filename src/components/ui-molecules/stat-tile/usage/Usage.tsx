"use client";

import { Card, CardContent } from "@/components/ui-primitives/card";
import { Progress } from "@/components/ui-primitives/progress";
import { useScopedT } from "@/i18n/scoped-t";
import { stats09Items, stats09Namespace } from "./config";
import type { UsageBlock } from "./schema";

export default function Usage(props: Readonly<UsageBlock>) {
  const [t, tr] = useScopedT(stats09Namespace);
  const items = props.items ?? stats09Items;
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
          <Card key={item.id} className="py-4 shadow-2xs">
            <CardContent>
              <dt className="text-muted-foreground text-sm">
                {t(`items.${item.id}.name`)}
              </dt>
              <dd className="text-foreground text-2xl font-semibold tabular-nums">
                {item.stat}
              </dd>
              <Progress value={item.percentage} className="mt-6 h-2" />
              <dd className="mt-2 flex items-center justify-between text-sm">
                <span className="text-primary">{item.percentage}%</span>
                <span className="text-muted-foreground">
                  {t("usageOf", { stat: item.stat, limit: item.limit })}
                </span>
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
    </section>
  );
}
