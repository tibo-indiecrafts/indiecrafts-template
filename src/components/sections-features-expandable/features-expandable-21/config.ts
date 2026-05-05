import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable21Key = "features-expandable-21" as const;
export const featuresExpandable21Namespace = "blocks.features-expandable-21" as const;

export const featuresExpandable21Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-21",
  eyebrowKey: "blocks.features-expandable-21.eyebrow",
  headlineLeadKey: "blocks.features-expandable-21.headlineLead",
  headlineMidKey: "blocks.features-expandable-21.headlineMid",
  headlineTailKey: "blocks.features-expandable-21.headlineTail",
  items: [
    {
      illustration: "email",
      iconKey: "brain",
      gradientKind: "amberFuchsia",
      bgImageUrl:
        "https://images.unsplash.com/photo-1684410008411-6ccac995726d?q=80&w=3029&auto=format&fit=crop",
      triggerLabelKey: "blocks.features-expandable-21.items.tab1.triggerLabel",
      titleKey: "blocks.features-expandable-21.items.tab1.title",
      bodyKey: "blocks.features-expandable-21.items.tab1.body",
      ctaLabelKey: "blocks.features-expandable-21.items.tab1.ctaLabel",
      ctaHref: "#",
      supportive: {
        kind: "testimonial",
        testimonial: {
          quoteKey: "blocks.features-expandable-21.items.tab1.testimonial.quote",
          authorNameKey:
            "blocks.features-expandable-21.items.tab1.testimonial.authorName",
          authorRoleKey:
            "blocks.features-expandable-21.items.tab1.testimonial.authorRole",
          authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
        },
      },
    },
    {
      illustration: "agentFeedback",
      iconKey: "bot",
      gradientKind: "greenSky",
      bgImageUrl:
        "https://images.unsplash.com/photo-1695151992691-a9e19f73948f?q=80&w=2206&auto=format&fit=crop",
      triggerLabelKey: "blocks.features-expandable-21.items.tab2.triggerLabel",
      titleKey: "blocks.features-expandable-21.items.tab2.title",
      bodyKey: "blocks.features-expandable-21.items.tab2.body",
      ctaLabelKey: "blocks.features-expandable-21.items.tab2.ctaLabel",
      ctaHref: "#",
      supportive: {
        kind: "metrics",
        stats: [
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-21.items.tab2.metrics.soc",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-21.items.tab2.metrics.iso",
          },
          {
            iconKey: "shieldCheck",
            labelKey: "blocks.features-expandable-21.items.tab2.metrics.gdpr",
          },
          {
            iconKey: "hourglass",
            labelKey: "blocks.features-expandable-21.items.tab2.metrics.uptime",
          },
        ],
      },
    },
  ],
};
