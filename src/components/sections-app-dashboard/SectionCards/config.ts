/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const sectionCardsKey = "section-cards" as const;

/**
 * Translation namespace — `useTranslations(sectionCardsNamespace)` resolves keys from `en.json`.
 */
export const sectionCardsNamespace = "blocks.section-cards" as const;

export type SectionCardTrend = "up" | "down";

/**
 * KPI card row. `descriptionKey` / `footerTitleKey` / `footerHintKey` resolve
 * under the section namespace. `value` and `badgeDelta` are pre-formatted —
 * locale-aware number formatting is the caller's responsibility (same
 * convention as chart data).
 */
export type SectionCardItem = {
  descriptionKey: string;
  value: string;
  badgeDelta: string;
  trend: SectionCardTrend;
  footerTitleKey: string;
  footerHintKey: string;
};

export const sectionCardsItems: readonly SectionCardItem[] = [
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
