export const chartBarLabelCustomKey = "chart-bar-label-custom" as const;

export const chartBarLabelCustomNamespace = "blocks.chart-bar-label-custom" as const;

export const chartBarLabelCustomData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export const chartBarLabelCustomSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-2)" },
  { dataKey: "mobile", labelKey: "mobileLabel", color: "var(--chart-2)" },
] as const;

export const chartBarLabelCustomLabelColor = "var(--background)" as const;
