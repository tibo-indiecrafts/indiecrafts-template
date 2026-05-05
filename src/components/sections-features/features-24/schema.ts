import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type IdeIcon = "intellij" | "vsCode" | "windsurf";

export type CardIllustration = "invoice" | "integrations";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type FeatureCard = {
  illustration: CardIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-12` — full-bleed bordered grid identical to
 * `features-11` plus a hero row at the top: title + body + CTA, a
 * floating "Replaces your IDE" widget with 3 IDE icons, and a masked
 * product screenshot. Converted to the template pattern: props-driven
 * everything (cards, stats, IDE triple, CTA, screenshot), MessageKey-
 * typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-24";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  ideListLabelKey: MessageKey;
  ides: readonly [IdeIcon, IdeIcon, IdeIcon];
  screenshotUrl: string;
  screenshotAltKey: MessageKey;
  cards: readonly [FeatureCard, FeatureCard];
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};
