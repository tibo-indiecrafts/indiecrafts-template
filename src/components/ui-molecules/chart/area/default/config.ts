export const chartAreaDefaultKey = "chart-area-default" as const;

export const chartAreaDefaultNamespace = "blocks.chart-area-default" as const;

export const chartAreaDefaultData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export const chartAreaDefaultSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
] as const;
