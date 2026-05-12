import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type ComparatorRow = {
  nameKey: MessageKey;

  free: { labelKey: MessageKey } | boolean;
  pro: { labelKey: MessageKey } | boolean;
};

export type PricingTierHeader = {
  nameKey: MessageKey;
  priceKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};

export type PricingBlock = {
  type: "pricing-comparator-02";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  free: PricingTierHeader;
  pro: PricingTierHeader;
  rows: ReadonlyArray<ComparatorRow>;
};
