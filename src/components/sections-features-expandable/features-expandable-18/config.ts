import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable18Key = "features-expandable-18" as const;
export const featuresExpandable18Namespace = "blocks.features-expandable-18" as const;

export const featuresExpandable18Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-18",
  titleKey: "blocks.features-expandable-18.title",
  bodyKey: "blocks.features-expandable-18.body",
  ctaLabelKey: "blocks.features-expandable-18.ctaLabel",
  ctaHref: "#",
  items: [
    {
      illustration: "email",
      bgImageUrl:
        "https://images.unsplash.com/photo-1600223260976-32a509b23602?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-18.items.tab1.tabLabel",
    },
    {
      illustration: "agentFeedback",
      bgImageUrl:
        "https://images.unsplash.com/photo-1712942107059-0ef8ba9efbf9?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-18.items.tab2.tabLabel",
    },
    {
      illustration: "agentTaskPlanning",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-18.items.tab3.tabLabel",
    },
  ],
  stats: [
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-18.stats.soc",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-18.stats.iso",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-18.stats.gdpr",
    },
    {
      iconKey: "hourglass",
      labelKey: "blocks.features-expandable-18.stats.uptime",
    },
  ],
  testimonial: {
    quoteKey: "blocks.features-expandable-18.testimonial.quote",
    authorNameKey: "blocks.features-expandable-18.testimonial.authorName",
    authorRoleKey: "blocks.features-expandable-18.testimonial.authorRole",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
};
