import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable11Key = "features-expandable-11" as const;
export const featuresExpandable11Namespace = "blocks.features-expandable-11" as const;

export const featuresExpandable11Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-11",
  titleKey: "blocks.features-expandable-11.title",
  bodyKey: "blocks.features-expandable-11.body",
  items: [
    {
      illustration: "flowCards",
      titleKey: "blocks.features-expandable-11.items.tab1.title",
      bodyKey: "blocks.features-expandable-11.items.tab1.body",
      supportive: {
        kind: "ideSupport",
        labelKey: "blocks.features-expandable-11.items.tab1.ideLabel",
        ides: ["antigravity", "cursor", "windsurf"],
      },
    },
    {
      illustration: "kanban",
      titleKey: "blocks.features-expandable-11.items.tab2.title",
      bodyKey: "blocks.features-expandable-11.items.tab2.body",
      supportive: {
        kind: "metrics",
        stats: [
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-11.stats.soc2",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-11.stats.iso",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-11.stats.gdpr",
          },
          {
            iconKey: "hourglass",
            labelKey: "blocks.features-expandable-11.stats.uptime",
          },
        ],
      },
    },
    {
      illustration: "aiSearch",
      titleKey: "blocks.features-expandable-11.items.tab3.title",
      bodyKey: "blocks.features-expandable-11.items.tab3.body",
      supportive: {
        kind: "testimonial",
        quoteKey: "blocks.features-expandable-11.testimonial.quote",
        authorNameKey: "blocks.features-expandable-11.testimonial.authorName",
        authorRoleKey: "blocks.features-expandable-11.testimonial.authorRole",
        authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
      },
    },
  ],
};
