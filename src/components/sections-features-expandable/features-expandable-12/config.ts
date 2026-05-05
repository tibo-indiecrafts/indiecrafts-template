import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable12Key = "features-expandable-12" as const;
export const featuresExpandable12Namespace = "blocks.features-expandable-12" as const;

export const featuresExpandable12Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-12",
  titleKey: "blocks.features-expandable-12.title",
  bodyKey: "blocks.features-expandable-12.body",
  items: [
    {
      illustration: "models",
      titleKey: "blocks.features-expandable-12.items.tab1.title",
      bodyKey: "blocks.features-expandable-12.items.tab1.body",
      supportive: {
        kind: "ideSupport",
        labelKey: "blocks.features-expandable-12.items.tab1.ideLabel",
        ides: ["antigravity", "cursor", "windsurf"],
      },
    },
    {
      illustration: "collaborationComment",
      titleKey: "blocks.features-expandable-12.items.tab2.title",
      bodyKey: "blocks.features-expandable-12.items.tab2.body",
      supportive: {
        kind: "metrics",
        stats: [
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-12.stats.soc2",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-12.stats.iso",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-12.stats.gdpr",
          },
          {
            iconKey: "hourglass",
            labelKey: "blocks.features-expandable-12.stats.uptime",
          },
        ],
      },
    },
    {
      illustration: "aiSearch",
      titleKey: "blocks.features-expandable-12.items.tab3.title",
      bodyKey: "blocks.features-expandable-12.items.tab3.body",
      supportive: {
        kind: "testimonial",
        quoteKey: "blocks.features-expandable-12.testimonial.quote",
        authorNameKey: "blocks.features-expandable-12.testimonial.authorName",
        authorRoleKey: "blocks.features-expandable-12.testimonial.authorRole",
        authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
      },
    },
  ],
};
