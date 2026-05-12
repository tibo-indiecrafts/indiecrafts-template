"use client";

import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { CapacityRing } from "@/components/ui-molecules/capacity-ring";
import { useScopedT } from "@/i18n/scoped-t";
import { stats07Items, stats07Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats07Namespace);
  const items = props.items ?? stats07Items;
  const titleId = `${props.id}-title`;
  const planName = props.planName ?? t("defaultPlanName");
  const plansHref = props.plansHref ?? "#";

  return (
    <section
      aria-labelledby={titleId}
      className="flex w-full items-center justify-center p-10"
    >
      <div className="w-full">
        <h2 id={titleId} className="text-foreground text-xl font-medium text-balance">
          {tr(props.titleKey, "title")}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
          {t("description", { planName })}{" "}
          <a
            href={plansHref}
            className="text-primary inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
          >
            {t("viewOtherPlans")}
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 shadow-2xs">
              <CardContent className="flex items-center space-x-4 p-0">
                <CapacityRing value={item.capacity} label={`${item.capacity}%`} />
                <div>
                  <dt className="text-foreground text-sm font-medium">
                    {t(`items.${item.id}.name`)}
                  </dt>
                  <dd className="text-muted-foreground text-sm">
                    {t("usage", {
                      current: item.current,
                      allowed: item.allowed,
                    })}
                  </dd>
                </div>
              </CardContent>
            </Card>
          ))}
        </dl>
      </div>
    </section>
  );
}
