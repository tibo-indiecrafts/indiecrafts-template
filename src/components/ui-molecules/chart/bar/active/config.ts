export const chartBarActiveKey = "chart-bar-active" as const;

export const chartBarActiveNamespace = "blocks.chart-bar-active" as const;

export const chartBarActiveData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

export const chartBarActiveSeries = [
  { dataKey: "visitors", labelKey: "visitorsLabel" },
  { dataKey: "chrome", labelKey: "chromeLabel", color: "var(--chart-1)" },
  { dataKey: "safari", labelKey: "safariLabel", color: "var(--chart-2)" },
  { dataKey: "firefox", labelKey: "firefoxLabel", color: "var(--chart-3)" },
  { dataKey: "edge", labelKey: "edgeLabel", color: "var(--chart-4)" },
  { dataKey: "other", labelKey: "otherLabel", color: "var(--chart-5)" },
] as const;

export const chartBarActiveIndex = 2 as const;
