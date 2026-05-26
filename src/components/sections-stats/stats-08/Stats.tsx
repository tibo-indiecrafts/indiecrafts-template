"use client";

import { Card, CardContent, CardFooter } from "@/components/ui-primitives/card";
import { CapacityRing } from "@/components/ui-molecules/widget/capacity-ring";
import { useScopedT } from "@/components/_lib/scoped-t";
import { stats08Items, stats08Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats08Namespace);
  const items = props.items ?? stats08Items;
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
        {items.map((item) => {
          const name = t(`items.${item.id}.name`);
          return (
            <Card key={item.id} className="gap-0 p-0 shadow-2xs">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CapacityRing
                    value={item.progress}
                    fill={item.fill}
                    label={`${item.progress}%`}
                  />
                  <div>
                    <dd className="text-foreground text-base font-medium">
                      {item.current} / {item.budget}
                    </dd>
                    <dt className="text-muted-foreground text-sm">
                      {t("budgetLabel", { name })}
                    </dt>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-border flex items-center justify-end border-t p-0!">
                <a
                  href={item.href}
                  className="text-primary hover:text-primary/90 px-6 py-3 text-sm font-medium"
                >
                  {t("viewMore")}
                </a>
              </CardFooter>
            </Card>
          );
        })}
      </dl>
    </section>
  );
}
