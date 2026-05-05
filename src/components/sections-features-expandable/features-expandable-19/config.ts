import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable19Key = "features-expandable-19" as const;
export const featuresExpandable19Namespace = "blocks.features-expandable-19" as const;

export const featuresExpandable19Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-19",
  titleKey: "blocks.features-expandable-19.title",
  bodyKey: "blocks.features-expandable-19.body",
  ctaLabelKey: "blocks.features-expandable-19.ctaLabel",
  ctaHref: "#",
  items: [
    {
      illustration: "notesMeeting",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1723869791623-3b6a012f996b?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-19.items.tab1.title",
      bodyKey: "blocks.features-expandable-19.items.tab1.body",
    },
    {
      illustration: "calendar",
      iconKey: "globe",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-19.items.tab2.title",
      bodyKey: "blocks.features-expandable-19.items.tab2.body",
    },
    {
      illustration: "agentTaskPlanning",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-19.items.tab3.title",
      bodyKey: "blocks.features-expandable-19.items.tab3.body",
    },
  ],
  stats: [
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-19.stats.soc",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-19.stats.iso",
    },
    {
      iconKey: "shieldCheck",
      labelKey: "blocks.features-expandable-19.stats.gdpr",
    },
    {
      iconKey: "hourglass",
      labelKey: "blocks.features-expandable-19.stats.uptime",
    },
  ],
  testimonial: {
    quoteKey: "blocks.features-expandable-19.testimonial.quote",
    authorNameKey: "blocks.features-expandable-19.testimonial.authorName",
    authorRoleKey: "blocks.features-expandable-19.testimonial.authorRole",
    authorAvatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
};
