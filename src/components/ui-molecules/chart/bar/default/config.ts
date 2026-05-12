export const chartBarDefaultKey = "chart-bar-default" as const;

export const chartBarDefaultNamespace = "blocks.chart-bar-default" as const;

export const chartBarDefaultData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export const chartBarDefaultSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
] as const;
