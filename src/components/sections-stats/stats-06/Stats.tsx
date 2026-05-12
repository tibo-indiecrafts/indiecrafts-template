"use client";

import { AlertTriangle, Check, ChevronRight, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats06Items, stats06Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats06Namespace);
  const items = props.items ?? stats06Items;
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
          <Card key={item.id} className="relative p-6 shadow-2xs">
            <CardContent className="p-0">
              <dt className="text-muted-foreground text-sm font-medium">
                {t(`items.${item.id}.name`)}
              </dt>
              <dd className="text-foreground text-3xl font-semibold tabular-nums">
                {item.stat}
              </dd>
              <div className="group bg-muted/60 hover:bg-muted relative mt-6 flex items-center space-x-4 rounded-md p-2">
                <div className="flex w-full items-center justify-between truncate">
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded",
                        item.status === "within"
                          ? "bg-emerald-500 text-white"
                          : item.status === "observe"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white",
                      )}
                    >
                      {item.status === "within" ? (
                        <Check className="size-4 shrink-0" aria-hidden="true" />
                      ) : item.status === "observe" ? (
                        <Eye className="size-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
                      )}
                    </span>
                    <dd>
                      <p className="text-muted-foreground text-sm text-pretty">
                        <a href={item.href} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" />
                          {t("goalsLabel", {
                            achieved: item.goalsAchieved,
                            total: item.goalsTotal,
                          })}
                        </a>
                      </p>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          item.status === "within"
                            ? "text-emerald-800 dark:text-emerald-500"
                            : item.status === "observe"
                              ? "text-yellow-800 dark:text-yellow-500"
                              : "text-red-800 dark:text-red-500",
                        )}
                      >
                        {t(`status.${item.status}`)}
                      </p>
                    </dd>
                  </div>
                  <ChevronRight
                    className="text-muted-foreground/60 group-hover:text-muted-foreground size-5 shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </dl>
    </section>
  );
}
