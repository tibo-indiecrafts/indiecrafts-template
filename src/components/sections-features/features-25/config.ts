import type { FeaturesBlock } from "./schema";

export const features25Key = "features-25" as const;
export const features25Namespace = "blocks.features-25" as const;

export const features25Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-25",
  cards: [
    {
      illustration: "invoice",
      titleKey: "blocks.features-25.cards.dashboard.title",
      bodyKey: "blocks.features-25.cards.dashboard.body",
    },
    {
      illustration: "integrations",
      titleKey: "blocks.features-25.cards.integrations.title",
      bodyKey: "blocks.features-25.cards.integrations.body",
    },
    {
      illustration: "map",
      titleKey: "blocks.features-25.cards.global.title",
      bodyKey: "blocks.features-25.cards.global.body",
    },
    {
      illustration: "visualization",
      titleKey: "blocks.features-25.cards.analytics.title",
      bodyKey: "blocks.features-25.cards.analytics.body",
    },
  ],
  kpis: [
    {
      valueKey: "blocks.features-25.kpis.uptime.value",
      labelKey: "blocks.features-25.kpis.uptime.label",
    },
    {
      valueKey: "blocks.features-25.kpis.timeSavings.value",
      labelKey: "blocks.features-25.kpis.timeSavings.label",
    },
  ],
  testimonial: {
    quoteKey: "blocks.features-25.testimonial.quote",
    authorNameKey: "blocks.features-25.testimonial.authorName",
    authorRoleKey: "blocks.features-25.testimonial.authorRole",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
    authorInitialsKey: "blocks.features-25.testimonial.authorInitials",
  },
};
