"use client";

import { Area, AreaChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { ChartContainer } from "@/components/ui-primitives/chart";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats10Items, stats10Namespace } from "./config";
import type { StatsBlock } from "./schema";

const seriesData = [
  { date: "Nov 24", alpha: 142.87, beta: 65.32, gamma: 83.25 },
  { date: "Nov 25", alpha: 151.43, beta: 59.78, gamma: 79.64 },
  { date: "Nov 26", alpha: 157.28, beta: 64.21, gamma: 76.19 },
  { date: "Nov 27", alpha: 162.94, beta: 57.46, gamma: 72.84 },
  { date: "Nov 28", alpha: 148.37, beta: 49.82, gamma: 81.56 },
  { date: "Nov 29", alpha: 139.56, beta: 55.63, gamma: 92.38 },
  { date: "Nov 30", alpha: 145.83, beta: 61.27, gamma: 88.75 },
  { date: "Dec 01", alpha: 138.29, beta: 68.94, gamma: 93.42 },
  { date: "Dec 02", alpha: 129.64, beta: 74.56, gamma: 97.18 },
  { date: "Dec 03", alpha: 119.82, beta: 71.38, gamma: 89.43 },
  { date: "Dec 04", alpha: 128.54, beta: 63.95, gamma: 92.76 },
  { date: "Dec 05", alpha: 137.21, beta: 58.47, gamma: 84.29 },
  { date: "Dec 06", alpha: 134.68, beta: 69.12, gamma: 79.38 },
  { date: "Dec 07", alpha: 152.73, beta: 73.89, gamma: 81.42 },
  { date: "Dec 08", alpha: 168.59, beta: 78.54, gamma: 75.68 },
];

/**
 * Area-chart sparkline cards per stock. Sourced from
 * `@blocks-so/stats-10`.
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats10Namespace);
  const items = props.items ?? stats10Items;
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
        {items.map((item) => {
          const gradientId = `${props.id}-gradient-${item.id}`;
          const color =
            item.changeType === "positive"
              ? "hsl(142.1 76.2% 36.3%)"
              : "hsl(0 72.2% 50.6%)";
          const name = t(`items.${item.id}.name`);
          const ticker = t(`items.${item.id}.tickerSymbol`);

          return (
            <Card key={item.id} className="p-0 shadow-2xs">
              <CardContent className="p-4 pb-0">
                <div>
                  <dt className="text-foreground text-sm font-medium">
                    {name}{" "}
                    <span className="text-muted-foreground font-normal">({ticker})</span>
                  </dt>
                  <div className="flex items-baseline justify-between">
                    <dd
                      className={cn(
                        item.changeType === "positive"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500",
                        "text-lg font-semibold",
                      )}
                    >
                      {item.value}
                    </dd>
                    <dd className="flex items-center space-x-1 text-sm">
                      <span className="text-foreground font-medium">{item.change}</span>
                      <span
                        className={cn(
                          item.changeType === "positive"
                            ? "text-green-600 dark:text-green-500"
                            : "text-red-600 dark:text-red-500",
                        )}
                      >
                        ({item.percentageChange})
                      </span>
                    </dd>
                  </div>
                </div>

                <div className="mt-2 h-16 overflow-hidden">
                  <ChartContainer
                    className="h-full w-full"
                    config={{ [item.id]: { label: name, color } }}
                  >
                    <AreaChart data={seriesData}>
                      <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide={true} />
                      <Area
                        dataKey={item.id}
                        stroke={color}
                        fill={`url(#${gradientId})`}
                        fillOpacity={0.4}
                        strokeWidth={1.5}
                        type="monotone"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </dl>
    </section>
  );
}
