export const chartAreaLinearKey = "chart-area-linear" as const;

export const chartAreaLinearNamespace = "blocks.chart-area-linear" as const;

export const chartAreaLinearData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export const chartAreaLinearSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
] as const;
