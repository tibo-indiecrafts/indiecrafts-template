export const chartBarHorizontalKey = "chart-bar-horizontal" as const;

export const chartBarHorizontalNamespace = "blocks.chart-bar-horizontal" as const;

export const chartBarHorizontalData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export const chartBarHorizontalSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
] as const;
