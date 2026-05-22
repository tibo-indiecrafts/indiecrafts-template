import type { StaticAppPathname } from "@/config";
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
