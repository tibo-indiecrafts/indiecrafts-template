import type { FeaturesBlock } from "./schema";

export const features21Key = "features-21" as const;
export const features21Namespace = "blocks.features-21" as const;

export const features21Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-21",
  cards: [
    {
      iconKey: "messageCircle",
      illustration: "message",
      titleKey: "blocks.features-21.cards.messaging.title",
      bodyKey: "blocks.features-21.cards.messaging.body",
    },
    {
      iconKey: "chartBar",
      illustration: "uptime",
      titleKey: "blocks.features-21.cards.analytics.title",
      bodyKey: "blocks.features-21.cards.analytics.body",
    },
    {
      iconKey: "vote",
      illustration: "poll",
      titleKey: "blocks.features-21.cards.polling.title",
      bodyKey: "blocks.features-21.cards.polling.body",
    },
  ],
};
