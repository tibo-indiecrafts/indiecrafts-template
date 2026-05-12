export const kpiCardsKey = "section-cards" as const;

export const kpiCardsNamespace = "blocks.section-cards" as const;

export type KpiCardTrend = "up" | "down";

export type KpiCardItem = {
  descriptionKey: string;
  value: string;
  badgeDelta: string;
  trend: KpiCardTrend;
  footerTitleKey: string;
  footerHintKey: string;
};

export const kpiCardsItems: readonly KpiCardItem[] = [
  {
    descriptionKey: "revenue.description",
    value: "$1,250.00",
    badgeDelta: "+12.5%",
    trend: "up",
    footerTitleKey: "revenue.footerTitle",
    footerHintKey: "revenue.footerHint",
  },
  {
    descriptionKey: "customers.description",
    value: "1,234",
    badgeDelta: "-20%",
    trend: "down",
    footerTitleKey: "customers.footerTitle",
    footerHintKey: "customers.footerHint",
  },
  {
    descriptionKey: "accounts.description",
    value: "45,678",
    badgeDelta: "+12.5%",
    trend: "up",
    footerTitleKey: "accounts.footerTitle",
    footerHintKey: "accounts.footerHint",
  },
  {
    descriptionKey: "growth.description",
    value: "4.5%",
    badgeDelta: "+4.5%",
    trend: "up",
    footerTitleKey: "growth.footerTitle",
    footerHintKey: "growth.footerHint",
  },
] as const;
