import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable06Key = "features-expandable-06" as const;
export const featuresExpandable06Namespace = "blocks.features-expandable-06" as const;

export const featuresExpandable06Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-06",
  titleKey: "blocks.features-expandable-06.title",
  bodyKey: "blocks.features-expandable-06.body",
  ctaLabelKey: "blocks.features-expandable-06.cta",
  ctaHref: "#",
  items: [
    {
      illustration: "notesMeeting",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1723869791623-3b6a012f996b?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-06.items.tab1.title",
      bodyKey: "blocks.features-expandable-06.items.tab1.body",
    },
    {
      illustration: "calendar",
      iconKey: "globe",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-06.items.tab2.title",
      bodyKey: "blocks.features-expandable-06.items.tab2.body",
    },
    {
      illustration: "agentTaskPlanning",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-06.items.tab3.title",
      bodyKey: "blocks.features-expandable-06.items.tab3.body",
    },
  ],
  stats: [
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-06.stats.soc2",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-06.stats.iso",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-06.stats.gdpr",
    },
    {
      iconKey: "hourglass",
      labelKey: "blocks.features-expandable-06.stats.uptime",
    },
  ],
  testimonial: {
    quoteKey: "blocks.features-expandable-06.testimonial.quote",
    authorNameKey: "blocks.features-expandable-06.testimonial.authorName",
    authorRoleKey: "blocks.features-expandable-06.testimonial.authorRole",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
};
