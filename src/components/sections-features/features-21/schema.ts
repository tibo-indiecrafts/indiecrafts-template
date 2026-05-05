import type { MessageKey } from "@/types/messages";

export type CardIcon = "messageCircle" | "chartBar" | "vote";
export type CardIllustration = "message" | "uptime" | "poll";

export type FeatureCard = {
  iconKey: CardIcon;
  illustration: CardIllustration;
  titleKey: MessageKey;
  /**
   * Rich-text body. The translation may use `<strong>...</strong>`
   * tags to render an emphasised inline fragment (rendered as
   * `text-foreground font-medium`).
   */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-9` — 3-column card grid; each card stacks an
 * icon + title + rich-text body over a bottom-aligned illustration.
 * Converted to the template pattern: props-driven cards with separate
 * icon / illustration discriminators, MessageKey-typed strings, theme
 * tokens.
 */
export type FeaturesBlock = {
  type: "features-21";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard, FeatureCard];
};
