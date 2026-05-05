"use client";

import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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
  chartBarLabelCustomData,
  chartBarLabelCustomLabelColor,
  chartBarLabelCustomNamespace,
  chartBarLabelCustomSeries,
} from "./config";

export type BarLabelCustomProps = {
  /** Data rows. Defaults to `chartBarLabelCustomData` from `./config`. */
  data?: typeof chartBarLabelCustomData;
};

export function BarLabelCustom({
  data = chartBarLabelCustomData,
}: BarLabelCustomProps = {}) {
  const t = useTranslations(chartBarLabelCustomNamespace);
  const chartConfig = {
    ...Object.fromEntries(
      chartBarLabelCustomSeries.map((s) => [
        s.dataKey,
        { label: t(s.labelKey), ...(s.color && { color: s.color }) },
      ]),
    ),
    label: { color: chartBarLabelCustomLabelColor },
  } satisfies ChartConfig;
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
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
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
