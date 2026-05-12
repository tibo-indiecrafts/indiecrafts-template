import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type ComparatorRow = {
  nameKey: MessageKey;
  /** Either an i18n labelKey for plain-text values OR `true`/`false` for check/dash. */
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
  type: "pricing-comparator-2";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  free: PricingTierHeader;
  pro: PricingTierHeader;
  rows: ReadonlyArray<ComparatorRow>;
};
