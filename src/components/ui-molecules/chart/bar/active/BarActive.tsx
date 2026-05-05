"use client";

import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import type { BarShapeProps } from "recharts/types/cartesian/Bar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui-primitives/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui-primitives/chart";

import {
  chartBarActiveData,
  chartBarActiveIndex,
  chartBarActiveNamespace,
  chartBarActiveSeries,
} from "./config";

export type BarActiveProps = {
  /** Data rows. Defaults to `chartBarActiveData` from `./config`. */
  data?: typeof chartBarActiveData;
};

export function BarActive({ data = chartBarActiveData }: BarActiveProps = {}) {
  const t = useTranslations(chartBarActiveNamespace);
  const chartConfig = Object.fromEntries(
    chartBarActiveSeries.map((s) => [
      s.dataKey,
      { label: t(s.labelKey), ...("color" in s && s.color && { color: s.color }) },
    ]),
  ) satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="browser"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={8}
              shape={({ index, ...props }: BarShapeProps) =>
                index === chartBarActiveIndex ? (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                ) : (
                  <Rectangle {...props} />
                )
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {t("trend")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">{t("footerNote")}</div>
      </CardFooter>
    </Card>
  );
}
