import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable6Key = "features-expandable-6" as const;
export const featuresExpandable6Namespace = "blocks.features-expandable-6" as const;

export const featuresExpandable6Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-6",
  titleKey: "blocks.features-expandable-6.title",
  bodyKey: "blocks.features-expandable-6.body",
  ctaLabelKey: "blocks.features-expandable-6.cta",
  ctaHref: "#",
  items: [
    {
      illustration: "notesMeeting",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1723869791623-3b6a012f996b?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-6.items.tab1.title",
      bodyKey: "blocks.features-expandable-6.items.tab1.body",
    },
    {
      illustration: "calendar",
      iconKey: "globe",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-6.items.tab2.title",
      bodyKey: "blocks.features-expandable-6.items.tab2.body",
    },
    {
      illustration: "agentTaskPlanning",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-6.items.tab3.title",
      bodyKey: "blocks.features-expandable-6.items.tab3.body",
    },
  ],
  stats: [
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-6.stats.soc2",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-6.stats.iso",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-6.stats.gdpr",
    },
    {
      iconKey: "hourglass",
      labelKey: "blocks.features-expandable-6.stats.uptime",
    },
  ],
  testimonial: {
    quoteKey: "blocks.features-expandable-6.testimonial.quote",
    authorNameKey: "blocks.features-expandable-6.testimonial.authorName",
    authorRoleKey: "blocks.features-expandable-6.testimonial.authorRole",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
};
