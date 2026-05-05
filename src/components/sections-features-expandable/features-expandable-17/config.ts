import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable17Key = "features-expandable-17" as const;
export const featuresExpandable17Namespace = "blocks.features-expandable-17" as const;

export const featuresExpandable17Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-17",
  items: [
    {
      illustration: "email",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1600223260976-32a509b23602?q=80&w=2340&auto=format&fit=crop",
      labelKey: "blocks.features-expandable-17.items.tab1.label",
      titleKey: "blocks.features-expandable-17.items.tab1.title",
      bodyKey: "blocks.features-expandable-17.items.tab1.body",
      ctaLabelKey: "blocks.features-expandable-17.items.tab1.ctaLabel",
      ctaHref: "#",
      supportive: {
        kind: "metrics",
        stats: [
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-17.items.tab1.metrics.soc",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-17.items.tab1.metrics.iso",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-17.items.tab1.metrics.gdpr",
          },
          {
            iconKey: "hourglass",
            labelKey: "blocks.features-expandable-17.items.tab1.metrics.uptime",
          },
        ],
      },
    },
    {
      illustration: "agentFeedback",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1712942107059-0ef8ba9efbf9?q=80&w=2340&auto=format&fit=crop",
      labelKey: "blocks.features-expandable-17.items.tab2.label",
      titleKey: "blocks.features-expandable-17.items.tab2.title",
      bodyKey: "blocks.features-expandable-17.items.tab2.body",
      ctaLabelKey: "blocks.features-expandable-17.items.tab2.ctaLabel",
      ctaHref: "#",
      supportive: {
        kind: "testimonial",
        testimonial: {
          quoteKey: "blocks.features-expandable-17.items.tab2.testimonial.quote",
          authorNameKey:
            "blocks.features-expandable-17.items.tab2.testimonial.authorName",
          authorRoleKey:
            "blocks.features-expandable-17.items.tab2.testimonial.authorRole",
          authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
        },
      },
    },
  ],
};
