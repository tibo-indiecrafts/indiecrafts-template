import type { MessageKey } from "@/types/messages";

export type ComparatorIcon = "cpu" | "sparkles" | "shield" | "zap" | "globe";

export type ComparatorTier = {
  id: string;
  labelKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: string;

  highlighted?: boolean;
};

export type ComparatorCell = true | MessageKey | undefined;

export type ComparatorRow = {
  labelKey: MessageKey;

  values: readonly ComparatorCell[];
};

export type ComparatorGroup = {
  iconKey: ComparatorIcon;
  labelKey: MessageKey;
  rows: readonly ComparatorRow[];
};

export type PricingComparatorBlock = {
  type: "pricing-comparator";
  id: string;
  tiers: readonly [ComparatorTier, ComparatorTier, ComparatorTier];
  groups: readonly ComparatorGroup[];

  includedSrKey?: MessageKey;
  notIncludedSrKey?: MessageKey;
};
