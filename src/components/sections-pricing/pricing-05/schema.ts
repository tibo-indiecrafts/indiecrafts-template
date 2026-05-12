import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type PricingTier = {
  nameKey: MessageKey;
  priceKey: MessageKey;
  cadenceKey: MessageKey;
  featureKeys: ReadonlyArray<MessageKey>;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
};

export type PricingBlock = {
  type: "pricing-05";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Outer tiles (left + right) — outline CTA. */
  outer: readonly [PricingTier, PricingTier];
  /** Floating middle tier — primary CTA, ringed shadow card. */
  highlighted: PricingTier;
};
