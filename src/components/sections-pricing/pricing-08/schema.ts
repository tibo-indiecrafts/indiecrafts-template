import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type PricingTier = {
  nameKey: MessageKey;
  descriptionKey: MessageKey;
  priceKey: MessageKey;
  periodKey: MessageKey;
  featureKeys: ReadonlyArray<MessageKey>;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  highlighted?: boolean;
};

export type PricingBlock = {
  type: "pricing-08";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  tiers: readonly [PricingTier, PricingTier];

  trialNoteKey: MessageKey;
};
