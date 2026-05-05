import type { FeaturesBlock } from "./schema";

export const features15Key = "features-15" as const;
export const features15Namespace = "blocks.features-15" as const;

export const features15Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-15",
  items: [
    {
      illustration: "message",
      titleKey: "blocks.features-15.items.messaging.title",
      bodyKey: "blocks.features-15.items.messaging.body",
    },
    {
      illustration: "uptime",
      titleKey: "blocks.features-15.items.uptime.title",
      bodyKey: "blocks.features-15.items.uptime.body",
    },
    {
      illustration: "poll",
      titleKey: "blocks.features-15.items.polls.title",
      bodyKey: "blocks.features-15.items.polls.body",
    },
  ],
};
