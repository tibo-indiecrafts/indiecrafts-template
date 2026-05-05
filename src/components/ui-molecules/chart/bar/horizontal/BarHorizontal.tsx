"use client";

import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
  chartBarHorizontalData,
  chartBarHorizontalNamespace,
  chartBarHorizontalSeries,
} from "./config";

export type BarHorizontalProps = {
  /** Data rows. Defaults to `chartBarHorizontalData` from `./config`. */
  data?: typeof chartBarHorizontalData;
};

export function BarHorizontal({
  data = chartBarHorizontalData,
}: BarHorizontalProps = {}) {
  const t = useTranslations(chartBarHorizontalNamespace);
  const chartConfig = Object.fromEntries(
    chartBarHorizontalSeries.map((s) => [
      s.dataKey,
      { label: t(s.labelKey), ...(s.color && { color: s.color }) },
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
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="desktop" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
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
