"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent, CardHeader } from "@/components/ui-primitives/card";
import { type ChartConfig, ChartContainer } from "@/components/ui-primitives/chart";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats12Items, stats12Namespace } from "./config";
import type { StatsBlock } from "./schema";

function DonutChart({
  percentage,
  config,
}: Readonly<{ percentage: number; config: ChartConfig }>) {
  const clamped = Math.max(0, Math.min(100, Number(percentage)));
  const backgroundData = [{ name: "background", value: 100, fill: "#E5E7EB" }];
  const foregroundData = [
    { name: "used", value: clamped, fill: "#3B82F6" },
    { name: "empty", value: 100 - clamped, fill: "transparent" },
  ];

  return (
    <ChartContainer config={config} className="aspect-square h-6 w-6 shrink-0">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={backgroundData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          isAnimationActive={false}
        >
          {backgroundData.map((entry, index) => (
            <Cell key={`bg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Pie
          data={foregroundData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          {foregroundData.map((entry, index) => (
            <Cell key={`fg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats12Namespace);
  const items = props.items ?? stats12Items;
  const titleId = `${props.id}-title`;
  const chartConfig = {
    used: { label: t("usedLabel"), color: "var(--primary)" },
    remaining: { label: t("remainingLabel"), color: "var(--muted)" },
  } satisfies ChartConfig;

  return (
    <section aria-labelledby={titleId}>
      <Card className="w-full max-w-md gap-3 py-5 shadow-2xs">
        <CardHeader className="px-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 id={titleId} className="text-sm font-medium text-balance">
                {tr(props.titleKey, "title")}
              </h3>
              <p className="text-muted-foreground text-xs font-medium text-pretty">
                {tr(props.statusKey, "status")}
              </p>
            </div>
            <Button size="sm" className="h-6 text-xs font-medium">
              {t("upgrade")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-3 pt-0">
          <div className="space-y-0">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "hover:bg-muted/50 flex items-center gap-3 rounded-sm p-2 transition-colors",
                  index % 2 === 1 && "bg-muted/20",
                )}
              >
                <DonutChart percentage={item.percentage} config={chartConfig} />
                <span className="flex-1 truncate text-sm leading-4">
                  {t(`items.${item.id}.name`)}
                </span>
                <span className="text-muted-foreground text-xs font-medium tracking-tighter tabular-nums">
                  {item.current} / <span className="text-foreground">{item.limit}</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
