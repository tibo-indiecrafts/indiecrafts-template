import type { StaticAppPathname } from "@/config/routes.types";
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
  /** Two billing-cycle options (Monthly / Annual). */
  tiers: readonly [PricingTier, PricingTier];
  /** Centered tagline beneath the cards. */
  trialNoteKey: MessageKey;
};
