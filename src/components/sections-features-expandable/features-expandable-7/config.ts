import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable7Key = "features-expandable-7" as const;
export const featuresExpandable7Namespace = "blocks.features-expandable-7" as const;

export const featuresExpandable7Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-7",
  ctaLabelKey: "blocks.features-expandable-7.cta",
  ctaHref: "#",
  items: [
    {
      illustration: "email",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1600223260976-32a509b23602?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-7.items.tab1.tabLabel",
      titleKey: "blocks.features-expandable-7.items.tab1.title",
      bodyKey: "blocks.features-expandable-7.items.tab1.body",
      supportive: {
        kind: "metrics",
        stats: [
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-7.stats.soc2",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-7.stats.iso",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-7.stats.gdpr",
          },
          {
            iconKey: "hourglass",
            labelKey: "blocks.features-expandable-7.stats.uptime",
          },
        ],
      },
    },
    {
      illustration: "agentFeedback",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1712942107059-0ef8ba9efbf9?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-7.items.tab2.tabLabel",
      titleKey: "blocks.features-expandable-7.items.tab2.title",
      bodyKey: "blocks.features-expandable-7.items.tab2.body",
      supportive: {
        kind: "testimonial",
        quoteKey: "blocks.features-expandable-7.testimonial.quote",
        authorNameKey: "blocks.features-expandable-7.testimonial.authorName",
        authorRoleKey: "blocks.features-expandable-7.testimonial.authorRole",
        authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
      },
    },
  ],
};
