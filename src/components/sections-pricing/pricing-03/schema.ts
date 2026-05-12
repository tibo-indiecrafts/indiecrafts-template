import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type PricingBlock = {
  type: "pricing-03";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  planTitleKey: MessageKey;
  planSubtitleKey: MessageKey;
  priceCurrencyKey: MessageKey;
  priceAmountKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  includesKey: MessageKey;
  featureKeys: ReadonlyArray<MessageKey>;
  partnersTaglineKey: MessageKey;
};
