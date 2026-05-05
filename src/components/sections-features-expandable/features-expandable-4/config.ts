import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable4Key = "features-expandable-4" as const;
export const featuresExpandable4Namespace = "blocks.features-expandable-4" as const;

export const featuresExpandable4Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-4",
  titleKey: "blocks.features-expandable-4.title",
  bodyKey: "blocks.features-expandable-4.body",
  items: [
    {
      illustration: "notesMeeting",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770490085047-1460359929e7?q=80&w=2148&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-4.items.tab1.tabLabel",
    },
    {
      illustration: "calendar",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-4.items.tab2.tabLabel",
    },
    {
      illustration: "agentTaskPlanning",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-4.items.tab3.tabLabel",
    },
  ],
};
