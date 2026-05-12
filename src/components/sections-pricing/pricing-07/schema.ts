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
  type: "pricing-07";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Smaller "Free" tier — col-span-2, outline CTA. */
  basic: PricingTier;
  /** Larger "Pro" tier — col-span-3, primary CTA, tinted bg + shadow. */
  pro: PricingTier;
  /** "Everything in free plus :" intro line above the Pro tier's checklist. */
  proFeaturesIntroKey: MessageKey;
};
