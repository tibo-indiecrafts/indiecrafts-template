import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable05Key = "features-expandable-05" as const;
export const featuresExpandable05Namespace = "blocks.features-expandable-05" as const;

export const featuresExpandable05Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-05",
  titleKey: "blocks.features-expandable-05.title",
  bodyKey: "blocks.features-expandable-05.body",
  items: [
    {
      illustration: "notesMeeting",
      iconKey: "brain",
      bgImageUrl:
        "https://images.unsplash.com/photo-1723873591148-342982be8bca?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-05.items.tab1.tabLabel",
    },
    {
      illustration: "calendar",
      iconKey: "globe",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-05.items.tab2.tabLabel",
    },
    {
      illustration: "agentTaskPlanning",
      iconKey: "bot",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-05.items.tab3.tabLabel",
    },
  ],
};
