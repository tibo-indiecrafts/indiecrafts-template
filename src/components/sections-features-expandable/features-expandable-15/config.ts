import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable15Key = "features-expandable-15" as const;
export const featuresExpandable15Namespace = "blocks.features-expandable-15" as const;

export const featuresExpandable15Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-15",
  titleKey: "blocks.features-expandable-15.title",
  bodyKey: "blocks.features-expandable-15.body",
  items: [
    {
      illustration: "campaign",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1723869791623-3b6a012f996b?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-15.items.tab1.title",
      bodyKey: "blocks.features-expandable-15.items.tab1.body",
    },
    {
      illustration: "collaborationText",
      iconKey: "globe",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-15.items.tab2.title",
      bodyKey: "blocks.features-expandable-15.items.tab2.body",
    },
    {
      illustration: "notesMeeting",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      titleKey: "blocks.features-expandable-15.items.tab3.title",
      bodyKey: "blocks.features-expandable-15.items.tab3.body",
    },
  ],
};
