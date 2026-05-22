import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-07";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  benefits: ReadonlyArray<MessageKey>;
  pricePrefixKey: MessageKey;
  priceValueKey: MessageKey;
  pricePeriodKey: MessageKey;
  priceCaptionKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
};
