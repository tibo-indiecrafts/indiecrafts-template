import type { MessageKey } from "@/types/messages";

export type CardIcon = "messageCircle" | "chartBar" | "vote";
export type CardIllustration = "message" | "uptime" | "poll";

export type FeatureCard = {
  iconKey: CardIcon;
  illustration: CardIllustration;
  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-21";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard, FeatureCard];
};
