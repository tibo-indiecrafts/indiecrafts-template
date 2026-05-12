"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui-primitives/toggle-group";

import {
  chartAreaInteractiveData,
  chartAreaInteractiveNamespace,
  chartAreaInteractiveReferenceDate,
  chartAreaInteractiveSeries,
  chartAreaInteractiveTimeRanges,
} from "./config";

export type AreaInteractiveProps = {
  data?: typeof chartAreaInteractiveData;
};

export function AreaInteractive({
  data = chartAreaInteractiveData,
}: AreaInteractiveProps = {}) {
  const t = useTranslations(chartAreaInteractiveNamespace);
  const chartConfig = Object.fromEntries(
    chartAreaInteractiveSeries.map((s) => [
      s.dataKey,
      { label: t(s.labelKey), ...("color" in s && s.color && { color: s.color }) },
    ]),
  ) satisfies ChartConfig;
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState(() => (isMobile ? "7d" : "90d"));

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(chartAreaInteractiveReferenceDate);
    const range = chartAreaInteractiveTimeRanges.find((r) => r.value === timeRange);
    const daysToSubtract = range?.days ?? 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{t("descriptionLong")}</span>
          <span className="@[540px]/card:hidden">{t("descriptionShort")}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            {chartAreaInteractiveTimeRanges.map((range) => (
              <ToggleGroupItem key={range.value} value={range.value}>
                {t(range.labelKey)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label={t("title")}
            >
              <SelectValue placeholder={t("placeholder")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {chartAreaInteractiveTimeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value} className="rounded-lg">
                  {t(range.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
